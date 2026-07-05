# Tasks: Fix Cart UI Reactivity

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~20–30 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | size-exception |

```
Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low
```

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Clone Cart before mutation in both operations | Single PR | main branch; tests pass |

## Phase 1: Domain Model

- [x] 1.1 Add `clone(): Cart` to `src/app/cart/domain/cart.model.ts` — create new instance via private constructor, shallow-copy `_items` with spread

## Phase 2: Service

- [x] 2.1 In `src/app/cart/application/cart.service.ts` `addToCart()`: clone `currentCart` before `addItem()` when cart exists
- [x] 2.2 In `src/app/cart/application/cart.service.ts` `removeFromCart()`: call `currentCart.clone()` before `removeItem()`

## Phase 3: Verify

- [x] 3.1 Run `ng test` — confirm all existing `CartService` tests pass (including `addToCart` quantity increment and `removeFromCart` item removal)
