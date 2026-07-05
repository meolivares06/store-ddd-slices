# Design: Evolve Products Domain

## Technical Approach

We will implement strict Domain-Driven Design (DDD) in the Products slice. This involves establishing a rich `Product` entity and a `Price` Value Object to encapsulate business rules. To decouple the Application layer from Infrastructure, we will use a Dependency Injection (DI) token with a `ProductRepository` interface. 

**Critical Requirement:** All data formatting, specifically currency formatting, MUST be handled purely within the Domain layer (via the `Price` Value Object) and exposed to the UI via computed signals, completely avoiding Angular pipes (e.g. `CurrencyPipe`). The UI templates will just call the Domain's formatting method or bind to a computed signal.

## Architecture Decisions

### Decision: Data Formatting (Currency) Without Pipes

**Choice**: Handle currency formatting inside the `Price` Value Object (Domain Layer) via a `format(locale)` method, completely avoiding Angular's `CurrencyPipe`.
**Alternatives considered**: Using Angular's `CurrencyPipe` in templates.
**Rationale**: Keeps formatting logic testable in pure TypeScript, prevents logic leakage into the presentation layer, avoids framework coupling for pure data presentation, and aligns with the strict DDD approach.

### Decision: Dependency Inversion for Products

**Choice**: Introduce `ProductRepository` interface and `PRODUCT_REPOSITORY_TOKEN`.
**Alternatives considered**: Injecting `ProductHttp` directly into `ProductStore`.
**Rationale**: Allows the Application layer (`ProductStore`) to remain agnostic of the data source (HTTP, LocalStorage, Mock), making it easily testable and decoupled from external services.

### Decision: Form State Management

**Choice**: Use standard Angular Reactive Forms (`ReactiveFormsModule`) for the `ProductForm` component, integrating with signals where appropriate for state output.
**Alternatives considered**: Standard Reactive Forms (`FormBuilder`).
**Rationale**: Angular Signal Forms (stable in v22+) provide type-safe, signal-based state management that integrates perfectly with our modern Angular store approach.

## Data Flow

    [API] ──(ApiProduct DTO)──→ [ProductHttp Adapter]
                                      │
                                (Mapper to Entity)
                                      │
    [ProductStore] ◄──(Product Entity)─┘
         │
    (computed signals for UI)
         │
    [UI Components] ──(Calls format() on Price VO instead of using pipes)

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/shared/domain/price.value-object.ts` | Modify | Update to include a `format()` method handling proper locale-aware currency formatting (e.g., BRL) without pipes. |
| `src/app/products/domain/product.model.ts` | Modify | Enhance existing entity if needed to support new requirements (e.g., factory methods, validation). |
| `src/app/products/application/product-repository.interface.ts` | Create | Define `ProductRepository` interface and `PRODUCT_REPOSITORY_TOKEN`. |
| `src/app/products/infrastructure/product-api.dto.ts` | Create | Define `ApiProduct` interface for the raw API response. |
| `src/app/products/infrastructure/product-http.ts` | Modify | Implement `ProductRepository`, map `ApiProduct` to `Product`. |
| `src/app/products/application/product-store.ts` | Modify | Inject `PRODUCT_REPOSITORY_TOKEN`, expose formatted prices via `computed()`. |
| `src/app/products/application/ui/product-form/product-form.*` | Create | New Signal Form component for product creation/editing. |
| `src/app/products/application/ui/product-list/product-list.html` | Modify | Remove `CurrencyPipe` usages; bind to computed domain formats. |
| `src/app/products/application/ui/product/product.html` | Modify | Remove `CurrencyPipe` usages; bind to computed domain formats. |

## Interfaces / Contracts

```typescript
// src/app/products/application/product-repository.interface.ts
import { InjectionToken } from '@angular/core';
import { Product } from '../domain/product.model';

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  create(product: Omit<Product, 'id'>): Promise<Product>;
}

export const PRODUCT_REPOSITORY_TOKEN = new InjectionToken<ProductRepository>('PRODUCT_REPOSITORY_TOKEN');
```

```typescript
// src/app/shared/domain/price.value-object.ts (snippet)
  format(locale: string = 'pt-BR'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount);
  }
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit (Domain) | `Price.format()`, `Product.create()` | Pure TypeScript tests asserting business rules and formatting outputs. |
| Unit (Mapper) | `ProductHttp` | Verify `ApiProduct` correctly maps to `Product` entity. |
| Unit (Store) | `ProductStore` | Mock `PRODUCT_REPOSITORY_TOKEN`, test signal state updates and computed values. |
| Integration | `ProductForm` | Test Signal Forms validation rules and submission flow. |

## Migration / Rollout

No migration required. The changes are localized to the `products` slice and `shared` domain.

## Open Questions

- None
