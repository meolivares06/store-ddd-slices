# Apply Progress: Evolve Products Domain

## Completed Tasks
- [x] 1.1 Update `src/app/shared/domain/price.value-object.ts` to add `format(locale)` method for currency (avoid Angular pipes).
- [x] 1.2 Update `src/app/products/domain/product.model.ts` to ensure it integrates the `Price` VO properly.
- [x] 1.3 Create `src/app/products/application/product-repository.interface.ts` with `PRODUCT_REPOSITORY_TOKEN`.
- [x] 2.1 Create `src/app/products/infrastructure/product-api.dto.ts` for the API response interface.
- [x] 2.2 Update `src/app/products/infrastructure/product-http.ts` to implement `ProductRepository` and map `ApiProduct` to `Product`.
- [x] 3.1 Update `src/app/products/application/product-store.ts` to inject `PRODUCT_REPOSITORY_TOKEN`.
- [x] 3.2 Update `ProductStore` to compute formatted prices using `Price.format()` instead of exposing raw values for pipes.
- [x] 4.1 Create `src/app/products/application/ui/product-form` using Angular Signal Forms (`@angular/forms/signals`).
- [x] 4.2 Update `src/app/products/application/ui/product-list/product-list.html` to remove `CurrencyPipe` usage and use computed domain strings.
- [x] 4.3 Update `src/app/products/application/ui/product/product.html` to remove `CurrencyPipe` usage and use computed domain strings.
- [x] 5.1 Test `Price.format()` and `Product` entity creation logic.
- [x] 5.2 Test `ProductHttp` mapping logic from `ApiProduct` to `Product` entity.
- [x] 5.3 Test `ProductStore` signal updates and DI behavior.
- [x] 5.4 Test `ProductForm` Signal Forms validation and submission.

## Fixes Added
- Rewrote `product-form.spec.ts` to use native Angular `TestBed` instead of Testing Library.
- Fixed `Price` Value Object default values to `currency = 'BRL'` and `locale = 'pt-BR'`.
- Updated `price.value-object.spec.ts` to reflect the new default currency.
- Added `Validators.minLength(3)` to `ProductForm` name field and added test to verify it.

## TDD Cycle Evidence
| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|------|-----------|-------|------------|-----|-------|-------------|----------|
| Fix Defaults | `price.value-object.spec.ts` | Unit | ✅ 14/14 | ✅ Written | ✅ Passed | ➖ Single | ✅ Clean |
| Fix Form Valid. | `product-form.spec.ts` | Integration | ✅ 4/4 | ✅ Written | ✅ Passed | ✅ 3 cases | ✅ Clean |

## Status
14/14 tasks complete. Ready for verify.