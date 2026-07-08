# Proposal: cart-brutalist-ui

## Intent

Implement a Brutalist design system for the shopping cart interface using raw CSS and the Container-Presentational pattern, migrating away from the current generic design to a bold, high-contrast aesthetic.

## Scope

### In Scope
- Translating the Brutalist cart layout (main grid, item list, sticky sidebar) into `CartPage` CSS using raw variables from `_tokens.css`.
- Creating a `CartItemComponent` (presentational) to render individual products with thick borders and hard shadows.
- Creating a `CartSummaryComponent` (presentational) for the sticky checkout sidebar.
- Creating a `QuantityStepperComponent` generic atom in `shared/ui`.
- Wiring the container (`CartPage`) to pass Signal data to the new dumb components.

### Out of Scope
- Migrating other pages (e.g., product listing, checkout) to Brutalism.
- Modifying the underlying `Cart` domain logic or `CartService` state management.

## Capabilities

### New Capabilities
- `cart-brutalist-ui`: Full translation of the Brutalist UI layout and design tokens to the Cart slice.

### Modified Capabilities
- None

## Approach

1. **Atoms**: Create a `QuantityStepperComponent` in `shared/ui/quantity-stepper` using `--font-family-mono`, hard borders, and `app-button`.
2. **Presentational Components**: Add `cart-item.component.ts` and `cart-summary.component.ts` to `src/app/cart/application/ui/cart/components/`. These will use standard Angular `input()` for data (`CartItem`, total) and `output()` for actions (remove, change quantity).
3. **Container**: Update `CartPage` (`cart.ts` and `cart.html`) to act as a pure CSS Grid layout wrapper, delegating rendering to the presentational components and passing the `CartService` signals.
4. **Styling**: Leverage `src/styles/_tokens.css` (e.g., `var(--border-width-thick)`, `var(--shadow-hard)`) in vanilla CSS to achieve the Brutalist look without Tailwind. No `ngStyle` or `ngClass`—just semantic classes and native bindings.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/cart/application/ui/cart/cart.html` | Modified | Rewritten to use grid and new dumb components. |
| `src/app/cart/application/ui/cart/cart.css` | Modified | Add grid layout, sticky sidebar, and token usages. |
| `src/app/cart/application/ui/cart/components/cart-item/` | New | Presentational component for items. |
| `src/app/cart/application/ui/cart/components/cart-summary/` | New | Presentational component for totals. |
| `src/shared/ui/quantity-stepper/` | New | Generic atom for numeric input. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Mobile responsiveness of hard-coded grid | High | Use CSS Grid with `minmax` and standard media queries for stacking the sticky sidebar below the item list on small screens. |
| Accessibility of brutalist contrast | Low | The tokens use black on white (`#000000` on `#ffffff`), natively satisfying WCAG AAA. Ensure focus rings are thick and visible. |

## Rollback Plan

Revert the Git commit introducing the new components and `cart.html`/`cart.css` changes. The domain and service layers are untouched, so no state corruption can occur.

## Dependencies

- Existing `CartService` and `CartItem` domain models (already implemented).
- `src/styles/_tokens.css` variables.

## Success Criteria

- [ ] Cart renders in a two-column grid (items + sticky summary) on desktop.
- [ ] UI exactly matches the Brutalist theme (hard shadows, thick borders, Space Mono fonts).
- [ ] `CartPage` maintains Container-Presentational separation with 0 domain logic in dumb components.
- [ ] Axe accessibility checks pass with 0 errors.