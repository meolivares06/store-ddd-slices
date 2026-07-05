# Tasks: Extract Shared Kernel Price

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~50 lines |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Not needed |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Extract Price VO and update imports | PR 1 | Single PR is sufficient |

## Phase 1: Infrastructure

- [x] 1.1 Create directory `src/app/shared/domain`.
- [x] 1.2 Move `src/app/products/domain/price.value-object.ts` to `src/app/shared/domain/`.
- [x] 1.3 Move `src/app/products/domain/price.value-object.spec.ts` to `src/app/shared/domain/`.

## Phase 2: Core Implementation

- [x] 2.1 Update imports in `src/app/products/` to point to the new shared kernel location.
- [x] 2.2 Update imports in `src/app/cart/` to point to the new shared kernel location.

## Phase 3: Testing / Verification

- [x] 3.1 Run tests `npm run test` or `ng test` to verify all domain tests pass.
- [x] 3.2 Run `tsc --noEmit` to verify there are no broken types or imports across the codebase.
