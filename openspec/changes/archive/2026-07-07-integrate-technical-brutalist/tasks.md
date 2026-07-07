# Tasks: Integrate Technical Brutalist Design System

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 250 - 350 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Full Implementation | PR 1 | The scope is small enough for a single PR encompassing tokens, UI components, and the product view refactor. |

## Phase 1: Infrastructure / Foundation

- [x] 1.1 Create `src/styles/_tokens.css` with the Brutalist custom properties (`--color-bg`, `--font-family-mono`, `--border-width-thick`, `--shadow-hard`, etc.).
- [x] 1.2 Update `src/styles.css` (or equivalent global stylesheet) to import `_tokens.css` and remove any global Tailwind CSS imports if present.

## Phase 2: Shared UI Components (Presentational)

- [x] 2.1 Create the standalone `app-badge` component (`src/shared/ui/badge/badge.component.ts`, `badge.component.css`, `badge.component.spec.ts`) using signals `input()`.
- [x] 2.2 Style `app-badge` using raw CSS custom properties (monospace font, solid borders, high contrast).
- [x] 2.3 Create the standalone `app-button` component (`src/shared/ui/button/button.component.ts`, `button.component.css`, `button.component.spec.ts`) using signals `input()` and `output()`.
- [x] 2.4 Style `app-button` with raw CSS to include a hard shadow (`--shadow-hard`) and implement hover states that shift the shadow for a pseudo-3D effect.

## Phase 3: Core Implementation & Refactoring

- [x] 3.1 Refactor `ProductComponent` (`src/app/products/application/ui/product/product.component.ts` & `css`): Remove Tailwind utility classes and replace them with semantic raw CSS mapped to our tokens.
- [x] 3.2 Update `ProductComponent` template to use the new `app-badge` for tags/prices and `app-button` for actions.
- [x] 3.3 Refactor `ProductListComponent` (`src/app/products/application/ui/product-list/product-list.component.ts` & `css`): Remove Tailwind classes and implement CSS Grid/Flexbox layouts using raw CSS classes.

## Phase 4: Testing & Verification

- [x] 4.1 Write/update unit tests for `badge.component.spec.ts` ensuring input bindings map correctly.
- [x] 4.2 Write/update unit tests for `button.component.spec.ts` ensuring click events are emitted properly.
- [x] 4.3 Verify `ProductListComponent` and `ProductComponent` tests pass after structural template changes.
- [x] 4.4 Run accessibility checks (e.g., AXE) on the new button and badge components to guarantee WCAG AA compliance (especially focus states and contrast).