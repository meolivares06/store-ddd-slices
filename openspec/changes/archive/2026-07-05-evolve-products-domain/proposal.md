# Proposal: Evolve Products Domain

## Intent

Introduce strict Domain-Driven Design (DDD) patterns to the Products slice to eliminate primitive obsession, enforce dependency inversion, and centralize business logic. This resolves current technical debt where API DTOs leak into the domain and UI.

## Scope

### In Scope
- Create `Price` Value Object (immutable, validates currency and amount).
- Convert `Product` to a rich Domain Entity with factory methods and encapsulated behaviors (e.g., `applyDiscount`).
- Introduce `ProductRepository` interface and injection token for dependency inversion.
- Create `ApiProduct` DTO and a mapper in the Infrastructure layer.
- Update `ProductStore` to use the repository token and manage loading/error states.
- Create a `ProductForm` component using Signal Forms.
- Replace smoke tests with meaningful domain, infrastructure, and application tests.

### Out of Scope
- Modifying other domains (e.g., Cart) beyond shared interfaces.
- Pagination or advanced filtering in the Product List.
- Actual backend API changes (we keep using `dummyjson` with mapping).

## Capabilities

### New Capabilities
- `products-management`: Core product catalog display, creation, and discount application with strict domain validation.

### Modified Capabilities
- None

## Approach

We will build from the inside out:
1. **Domain**: Implement `Price` Value Object and `Product` Entity with pure TS tests.
2. **Application (Ports)**: Define `ProductRepository` interface and injection token.
3. **Infrastructure (Adapters)**: Implement `ProductHttp` with `ApiProduct` mapper.
4. **Application (State)**: Refactor `ProductStore` to use DI token and handle status signals.
5. **UI**: Update components to use formatted values and implement `ProductForm`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `domain/price.value-object.ts` | New | Immutable Price VO |
| `domain/product.model.ts` | Modified | Convert interface to rich Entity class |
| `application/product-repository.interface.ts` | New | DI token and interface |
| `infrastructure/product-http.ts` | Modified | Implement mapper and repository |
| `application/product-store.ts` | Modified | Use token, update state logic |
| `application/ui/` | Modified | Update `product-list`, `product`, add `product-form` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| UI Breakage from Entity changes | High | Update all template bindings synchronously with the `Product` entity refactor. |
| Memory leaks from subscriptions | Med | Use `takeUntilDestroyed()` in the store. |

## Rollback Plan

Revert the Git commit for this change, or checkout the previous branch. The changes are localized to the `products` feature slice.

## Dependencies

- DummyJSON API (existing)
- `@angular/forms` (Signal Forms)

## Success Criteria

- [ ] `Product` is a class, not an interface, and uses `Price` Value Object.
- [ ] `ProductStore` injects `PRODUCT_REPOSITORY_TOKEN`, not `ProductHttp`.
- [ ] `ProductHttp` maps `ApiProduct` DTOs to `Product` Entities.
- [ ] All 4 existing smoke tests are replaced with real assertions (Domain, Mapper, Store).
- [ ] `ProductForm` correctly validates entity rules before submission.

## Proposal question round

To finalize the product behavior before writing specs, please clarify:
1. **Discounts**: Are there business rules for `applyDiscount(percentage)` (e.g., max 100%, no negative prices after discount)?
2. **ProductForm**: What are the exact fields required to create a Product, and what are their validation rules (e.g., title max length, price minimum)?
3. **Currencies**: Should the `Price` VO assume a default currency (e.g., USD) since DummyJSON doesn't provide one?
