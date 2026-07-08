# Tasks: Cart Brutalist UI Refactoring

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~450 lines |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | `QuantityStepperComponent` | PR 1 | Base `main`; standalone atom with tests. |
| 2 | Cart Presentational Components | PR 2 | Base `PR 1`; adds `CartItem` and `CartSummary` and their unit tests. |
| 3 | Cart Container Refactor | PR 3 | Base `PR 2`; integrates components in `CartPage` using CSS Grid and fixes integration tests. |

## Phase 1: Foundation (Quantity Stepper)

- [x] 1.1 Create `src/shared/ui/quantity-stepper/quantity-stepper.component.ts` with `input<number>` and `output<number>`.
- [x] 1.2 Create `src/shared/ui/quantity-stepper/quantity-stepper.html` with increment/decrement buttons.
- [x] 1.3 Create `src/shared/ui/quantity-stepper/quantity-stepper.css` using `--font-family-mono` and brutalist borders.
- [x] 1.4 Write unit tests in `quantity-stepper.component.spec.ts` for I/O logic.

## Phase 2: Cart Presentational Components

- [x] 2.1 Create `src/app/cart/application/ui/cart/components/cart-item/cart-item.component.ts` with `CartItem` input and update/remove outputs.
- [x] 2.2 Create `src/app/cart/application/ui/cart/components/cart-item/cart-item.html` leveraging `app-quantity-stepper` and formatting the price.
- [x] 2.3 Create `src/app/cart/application/ui/cart/components/cart-item/cart-item.css` using `--border-width-thick` and `--shadow-hard`.
- [x] 2.4 Create `src/app/cart/application/ui/cart/components/cart-summary/cart-summary.component.ts` with `Price` input and `clear` output.
- [x] 2.5 Create `src/app/cart/application/ui/cart/components/cart-summary/cart-summary.html` and `.css` for the brutalist totals display.

## Phase 3: Container Integration

- [x] 3.1 Update `src/app/cart/application/ui/cart/cart.component.ts` to import `CartItemComponent` and `CartSummaryComponent`.
- [x] 3.2 Refactor `src/app/cart/application/ui/cart/cart.html` to strip old markup and use the new presentational components.
- [x] 3.3 Refactor `src/app/cart/application/ui/cart/cart.css` to implement a two-column desktop grid, sticky sidebar, and single-column mobile view.

## Phase 4: Testing & Verification

- [x] 4.1 Write unit tests for `CartItemComponent` ensuring outputs emit correctly on interactions.
- [x] 4.2 Write unit tests for `CartSummaryComponent`.
- [x] 4.3 Update `src/app/cart/application/ui/cart/cart.component.spec.ts` to ensure event bubbling from presentational components correctly invokes `CartService`.
