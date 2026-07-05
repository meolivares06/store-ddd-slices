# Tasks: Evolve Products Domain

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 250-350 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Full implementation | PR 1 | Base branch: main; tests/docs included |

## Phase 1: Domain Foundation

- [x] 1.1 Update `src/app/shared/domain/price.value-object.ts` to add `format(locale)` method for currency (avoid Angular pipes).
- [x] 1.2 Update `src/app/products/domain/product.model.ts` to ensure it integrates the `Price` VO properly.
- [x] 1.3 Create `src/app/products/application/product-repository.interface.ts` with `PRODUCT_REPOSITORY_TOKEN`.

## Phase 2: Infrastructure & Adapters

- [x] 2.1 Create `src/app/products/infrastructure/product-api.dto.ts` for the API response interface.
- [x] 2.2 Update `src/app/products/infrastructure/product-http.ts` to implement `ProductRepository` and map `ApiProduct` to `Product`.

## Phase 3: Application State

- [x] 3.1 Update `src/app/products/application/product-store.ts` to inject `PRODUCT_REPOSITORY_TOKEN`.
- [x] 3.2 Update `ProductStore` to compute formatted prices using `Price.format()` instead of exposing raw values for pipes.

## Phase 4: User Interface

- [x] 4.1 Create `src/app/products/application/ui/product-form` using Angular Signal Forms (`@angular/forms/signals`).
- [x] 4.2 Update `src/app/products/application/ui/product-list/product-list.html` to remove `CurrencyPipe` usage and use computed domain strings.
- [x] 4.3 Update `src/app/products/application/ui/product/product.html` to remove `CurrencyPipe` usage and use computed domain strings.

## Phase 5: Verification

- [x] 5.1 Test `Price.format()` and `Product` entity creation logic.
- [x] 5.2 Test `ProductHttp` mapping logic from `ApiProduct` to `Product` entity.
- [x] 5.3 Test `ProductStore` signal updates and DI behavior.
- [x] 5.4 Test `ProductForm` Signal Forms validation and submission.
