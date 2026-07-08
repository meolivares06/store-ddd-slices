# Design: cart-brutalist-ui

## Technical Approach

Refactor the existing `CartPage` into a strict Container component that leverages CSS Grid for a two-column desktop layout. The template will be split into three new presentational components: `CartItemComponent`, `CartSummaryComponent`, and a generic `QuantityStepperComponent` atom. All styling will use pure CSS and the variables defined in `_tokens.css` to achieve the Brutalist look (hard shadows, thick borders, Space Mono font) without Tailwind.

## Architecture Decisions

### Decision: Component Architecture

**Choice**: Use the Container-Presentational pattern. `CartPage` is the Container; `CartItemComponent` and `CartSummaryComponent` are Presentational.
**Alternatives considered**: Keeping all markup in `CartPage` and styling it directly.
**Rationale**: Splitting the UI promotes reusability, simplifies the Container's template, and strictly isolates the domain state (Signals) from the dumb UI rendering, adhering to DDD slice boundaries.

### Decision: Styling Approach

**Choice**: Raw CSS using CSS Custom Properties from `_tokens.css`.
**Alternatives considered**: Tailwind CSS or Angular inline styles.
**Rationale**: The proposal explicitly mandates raw CSS custom properties to maintain the Brutalist theme's integrity and avoid Tailwind dependencies in this module.

### Decision: Quantity Input

**Choice**: Create a generic `QuantityStepperComponent` in `src/shared/ui/quantity-stepper`.
**Alternatives considered**: Building the stepper directly inside `CartItemComponent`.
**Rationale**: Quantity steppers are common UI atoms. Placing it in `shared/ui` allows future reuse in the product detail page while keeping `CartItemComponent` focused on cart specifics.

## Data Flow

    CartService (Signals: cart, total)
         │
         ▼
      CartPage (Container)
         │
         ├───[cart item data]───> CartItemComponent ──(remove/qty change)──> CartPage
         │                              │
         │                              └──[qty data]──> QuantityStepperComponent ──(qty change)──> CartItemComponent
         │
         └───[total data]───────> CartSummaryComponent ──(clear cart)──────> CartPage

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/cart/application/ui/cart/cart.html` | Modify | Strip existing markup. Replace with CSS grid structure and `<app-cart-item>`, `<app-cart-summary>` tags. |
| `src/app/cart/application/ui/cart/cart.css` | Modify | Add grid layout rules (`display: grid`, `grid-template-columns`), sticky positioning for the sidebar, and media queries for mobile stacking. |
| `src/app/cart/application/ui/cart/components/cart-item/cart-item.component.ts` | Create | Dumb component using `input<CartItem>()` and `output<string>()`. |
| `src/app/cart/application/ui/cart/components/cart-item/cart-item.html` | Create | Markup with `--border-width-thick` and `--shadow-hard` classes. |
| `src/app/cart/application/ui/cart/components/cart-summary/cart-summary.component.ts` | Create | Dumb component for totals using `input<Price>()` and `output<void>()`. |
| `src/app/cart/application/ui/cart/components/cart-summary/cart-summary.html` | Create | Brutalist total display and checkout/clear actions. |
| `src/shared/ui/quantity-stepper/quantity-stepper.component.ts` | Create | Standalone atom component using `input<number>()` and `output<number>()`. |
| `src/shared/ui/quantity-stepper/quantity-stepper.css` | Create | Styling using `--font-family-mono` and hard borders. |

## Interfaces / Contracts

No new interfaces required. We will reuse the existing `CartItem` and `Price` models from the domain. The presentational components will use Angular's `input()` and `output()` API:

```typescript
// CartItemComponent
item = input.required<CartItem>();
remove = output<string>();
quantityChange = output<{productId: string, quantity: number}>();

// CartSummaryComponent
total = input.required<Price>();
clear = output<void>();

// QuantityStepperComponent
quantity = input.required<number>();
quantityChange = output<number>();
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `QuantityStepperComponent` | Test increment/decrement logic and output emissions. |
| Unit | `CartItemComponent` | Test that inputs bind correctly and outputs fire on clicks. |
| Integration | `CartPage` | Mount page with mocked `CartService`, verify child components are rendered and events bubble up correctly to service calls. |

## Migration / Rollout

No migration required. The changes are isolated to the Cart application UI layer and do not affect underlying domain state or persistence.

## Open Questions

- None