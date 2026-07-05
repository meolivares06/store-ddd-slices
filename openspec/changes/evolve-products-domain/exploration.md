## Exploration: evolve-products-domain

### Current State

The products slice exists with code across all three layers, but none of the DDD patterns from the bitácora are implemented yet:

**Domain Layer** (`domain/product.model.ts`):
- Plain TypeScript interfaces only — `Product`, `Root`, `Dimensions`, `Review`, `Meta`
- `Product` has 25 flat fields mirroring the `dummyjson` API response directly
- `price` is a raw `number` — **primitive obsession** (no currency, no validation)
- No entity class, no factory method, no business behavior
- No Value Objects exist

**Infrastructure Layer** (`infrastructure/product-http.ts`):
- Exports `ProductHttp` class with `getAll()` and `create()` methods
- Returns raw `Observable<Product[]>` — **no mapping/transformation** (API DTO === domain entity)
- Hardcoded `baseUrl = 'https://dummyjson.com/products'`
- Directly imports `Product` from domain for typing (tight coupling)
- **Smoke-only test**: verifies creation, nothing else

**Application Layer** (`application/product-store.ts`):
- `ProductStore` **directly imports `ProductHttp`** — violates Dependency Inversion
- Signal-based state with `#products` / `products` readonly pattern
- `loadProducts()` calls `ProductHttp.getAll()` inline with `.subscribe()`
- `applyDiscountToAll(percentage)` mutates prices inline with spread — no domain encapsulation
- **Smoke-only test**: verifies creation, nothing else

**UI Layer**:
- `ProductComponent` — presentational, `input.required<Product>()`, shows title + price
- `ProductList` — container, injects `ProductStore`, calls `loadProducts()` in `ngOnInit()`
  - Template has button + `<pre>{{ products | json }}</pre>` dump (debug artifact)
  - No loading/error states, no subscription cleanup
- Both component tests are smoke-only

### Gap Analysis

| Pattern (from bitácora) | Current State | Missing |
|---|---|---|
| **Price Value Object** (Evolución 2) | `price: number` — no currency, no validation | `domain/price.value-object.ts` with immutable `Price` class |
| **Product Domain Entity** (Evolución 1/2 prerequisite) | Raw interface, no behavior | Class with `create()` factory, validation, `applyDiscount()` method |
| **Mapper + ApiProduct DTO** (Evolución 1) | No transformation; API shape === domain shape | `ApiProduct` type + `mapToProduct()` in infrastructure |
| **Repository Interface + Token** (Evolución 3) | No abstraction, direct class import | `ProductRepository` interface + `PRODUCT_REPOSITORY_TOKEN` in application |
| **Dependency Inversion** (Evolución 3) | `ProductStore` → `ProductHttp` (direct) | Store injects the **token**, not the class |
| **Real Tests** (Evolución 5) | All 4 specs are smoke-only | Domain tests (pure TS), application tests (mocked token), infrastructure tests (mapper) |
| **ProductForm** | Does not exist | Form component with Signal Forms + domain validation |
| **Subscription Mgmt** | `loadProducts()` subscribes without cleanup | `takeUntilDestroyed()` or similar |

### Affected Areas

- `src/app/products/domain/product.model.ts` — Convert from interface to entity class with factory; will reference Price VO
- `src/app/products/domain/price.value-object.ts` — **New file**: immutable Price Value Object
- `src/app/products/domain/product.model.spec.ts` — **New file**: pure TS tests for entity & price
- `src/app/products/infrastructure/product-http.ts` — Add `ApiProduct` DTO type, implement `ProductRepository`, use mapper
- `src/app/products/infrastructure/product-http.spec.ts` — Replace smoke test with mapper + HTTP tests
- `src/app/products/application/product-repository.interface.ts` — **New file**: interface + InjectionToken
- `src/app/products/application/product-store.ts` — Replace `inject(ProductHttp)` with `inject(PRODUCT_REPOSITORY_TOKEN)`
- `src/app/products/application/product-store.spec.ts` — Replace smoke test with mocked repository tests
- `src/app/products/application/ui/product-list/product-list.ts` — Might need minor adjustments if store API changes
- `src/app/products/application/ui/product-list/product-list.html` — Remove JSON dump, add loading/error states
- `src/app/products/application/ui/product/product.ts` — May adapt to use Price VO's `formatted` getter
- `src/app/products/application/ui/product/product.html` — Show formatted price instead of raw number
- `src/app/products/application/ui/product-form/` — **New directory**: form component with Signal Forms
- App config / providers — Register `ProductRepository` token at feature routing or bootstrap

### Evolution Steps (in order)

These are ordered by **dependency** — each step builds on the previous one so you get green tests at every stage.

1. **Price Value Object** — Create `domain/price.value-object.ts`
   - Immutable class with `amount`, `currency`, `create()` factory with validation (no negatives), `add()`, `formatted` getter
   - Pure TypeScript, zero Angular imports
   - **Effort**: Low (~15 min)
   - **Tests**: Write domain tests for Price creation, validation, add, immutability

2. **Product Domain Entity** — Evolve `domain/product.model.ts`
   - Convert `Product` from interface to class with `private constructor` + `static create()` factory
   - Add validation (name non-empty, etc.)
   - Replace `price: number` with `price: Price`
   - Add `applyDiscount(percentage)` method returning a new instance (immutability)
   - Other fields (`description`, `category`, etc.) remain as-is or become plain props
   - **Effort**: Medium (~30 min)
   - **Tests**: Domain tests for Product creation, validation, applyDiscount immutability

3. **Repository Interface + Token** — Create `application/product-repository.interface.ts`
   - `ProductRepository` interface with `getAll(): Observable<Product[]>` and `create(product: Product): Observable<Product>`
   - Export `PRODUCT_REPOSITORY_TOKEN = new InjectionToken<ProductRepository>(...)`
   - **Effort**: Low (~10 min)
   - **Tests**: None needed (pure contract)

4. **Mapper + ApiProduct DTO** — Evolve `infrastructure/product-http.ts`
   - Add `ApiProduct` interface matching the actual JSON API shape
   - Add pure `mapToProduct(api: ApiProduct): Product` function using Price VO
   - Add `mapFromProduct(product: Product): ApiProduct` for create operations
   - Make `ProductHttp` implement `ProductRepository`
   - Use mapper inside `getAll()` and `create()`
   - **Effort**: Low (~20 min)
   - **Tests**: Test mapper with realistic API payloads, test HTTP integration with mock

5. **Refactor ProductStore** — Evolve `application/product-store.ts`
   - Replace `inject(ProductHttp)` with `inject(PRODUCT_REPOSITORY_TOKEN)`
   - Update `loadProducts()` signature (no change needed, interface is identical)
   - Add loading/error signals for UI state management
   - **Effort**: Low (~15 min)
   - **Tests**: Mock repository token, verify signal state updates

6. **Wire DI** — Register repository provider
   - In feature routing or app config: `{ provide: PRODUCT_REPOSITORY_TOKEN, useClass: ProductHttp }`
   - **Effort**: Low (~5 min)

7. **Polish Tests** — Replace all smoke tests with meaningful ones
   - `domain/product.model.spec.ts` + `domain/price.value-object.spec.ts` — pure TS
   - `application/product-store.spec.ts` — mocked token, verify signal emissions
   - `infrastructure/product-http.spec.ts` — mapper tests + HTTP mock
   - **Effort**: Medium (~30 min)

8. **Polish UI** — Remove debug dump, add quality
   - `product-list.html`: Remove `<pre>{{ products | json }}</pre>`, show formatted prices with `price.formatted`
   - `product.ts` template: Use `Price.formatted` if exposing it, or format in component
   - Add loading/error feedback (spinner, error message) based on store signals
   - Provide `PRODUCT_REPOSITORY_TOKEN` in the test to fix component tests
   - **Effort**: Medium (~20 min)

9. **ProductForm Component** — Create `application/ui/product-form/`
   - Signal Forms with field-level validation
   - Domain validation (via Product.create() inside form submission)
   - **Effort**: Medium (~25 min)
   - **Tests**: Component tests with mocked repository

### Risks

- **Breaking changes**: Converting `Product` from interface to class and `price` to `Price` VO will break all consumers (components, templates) that access `product.price` as a raw number. Need to update template bindings and component props simultaneously.
- **Subscription management**: Current `loadProducts()` subscribes without cleanup. If not migrated to `takeUntilDestroyed()` or an async pipe pattern, this can cause memory leaks and unexpected behavior after the refactor.
- **Test runner**: The project uses Vitest 4 via `@angular/build:unit-test`. Domain tests (pure TS) should work without TestBed, but need to confirm Vitest config supports this without Angular modules.
- **Inline discount logic**: `product-store.ts` has `applyDiscountToAll()` that mutates prices inline. After the refactor, this should use `Product.applyDiscount()` instead, which changes the API shape in the store.

### Ready for Proposal
Yes — the bitácora provides clear guidance for each evolution step. The dependency order is well-defined, and each step is small enough to be independently testable. Ready to proceed with the proposal phase.
