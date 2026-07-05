# Design: Connect Cart to UI

## Technical Approach

Wire the existing `CartService` (`cart/application/`) into the UI layer. Add `addToCart = output<Product>()` to the dumb `ProductComponent`. Handle the event in `ProductList` (smart) calling `cartService.addToCart(id, price, 1)`. Inject `CartService` into `Layout` to expose `itemCount()` as a badge. Create `CartPage` at `cart/application/ui/cart/` (list, remove, total, clear, empty state). Register `{ path: 'cart', component: CartPage }` in `app.routes.ts`.

## Architecture Decisions

| Option | Trade-off | Decision |
|--------|-----------|----------|
| CartService facade for UI | Extra abstraction with no benefit — `CartService` signals already map 1:1 to UI needs | Inject directly into smart components |
| CartService in ProductComponent | Violates dumb/smart split — `ARCHITECTURE.md` forbids service injection in dumb components | Keep `output<Product>()`, delegate to ProductList |
| CartPage in shared `ui/` folder | Breaks vertical slice autonomy — each feature owns its UI | Place at `cart/application/ui/cart/` |
| RouterModule vs RouterLink directive | Only `RouterLink` needed for nav links; importing `RouterModule` pulls more than required | Import `RouterLink` directly |

## Data Flow

```
User clicks "Agregar al carrito"
  → ProductComponent emits (addToCart)
    → ProductList calls cartService.addToCart(id, price, 1)
      → CartService updates #cart signal

Layout reads cartService.itemCount()  ─→ badge updates reactively
CartPage reads cartService.cart()     ─→ item list, total, remove/clear
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `cart/application/ui/cart/cart.ts` | Create | `CartPage` — standalone component, injects `CartService`, exposes items/total/remove/clear |
| `cart/application/ui/cart/cart.html` | Create | Template: `@for` over items, remove button, total, clear button, `@if` empty state |
| `cart/application/ui/cart/cart.css` | Create | Scoped styles |
| `cart/application/ui/cart/cart.spec.ts` | Create | UI tests: render items, remove, clear, empty state; mock `CartService` |
| `products/application/ui/product/product.ts` | Modify | Add `addToCart = output<Product>()`, switch to inline `template` |
| `products/application/ui/product/product.html` | Delete | Content moved to inline template in `product.ts` |
| `products/application/ui/product/product.spec.ts` | Modify | Add test for output emission on button click |
| `products/application/ui/product-list/product-list.ts` | Modify | Inject `CartService`, add `handleAddToCart(product)` method |
| `products/application/ui/product-list/product-list.html` | Modify | Bind `(addToCart)="handleAddToCart($event)"` on `<app-product>` |
| `products/application/ui/product-list/product-list.spec.ts` | Modify | Provide `CartService` + mock `CART_REPOSITORY_TOKEN` in TestBed |
| `layout/layout/layout.ts` | Modify | Inject `CartService`, expose `itemCount` signal, import `RouterLink` |
| `layout/layout/layout.html` | Modify | Add `<nav>` with `routerLink="/products"` and `routerLink="/cart"`, badge for `itemCount()` |
| `layout/layout/layout.spec.ts` | Modify | Provide `CartService` + mock `CART_REPOSITORY_TOKEN` |
| `app.routes.ts` | Modify | Add `{ path: 'cart', component: CartPage }` |

## Interfaces / Contracts

No new interfaces. `CartService` API consumed:

```
CartService.addToCart(productId: string, price: Price, quantity: number): void
CartService.removeFromCart(productId: string): void
CartService.clearCart(): void
CartService.cart: Signal<Cart | null>
CartService.itemCount: Signal<number>
CartService.total: Signal<Price>
```

Rendered properties from `CartItem`: `productId: string`, `unitPrice.formatted: string`, `quantity: number`.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit/UI | ProductComponent button emission | `fixture.debugElement.query` button, trigger click, assert `addToCart` emitted product |
| Unit/UI | ProductList handler calls CartService | Mock `CartService`, simulate `(addToCart)`, assert `addToCart` called with correct params |
| Unit/UI | Layout badge renders itemCount | Mock `CartService` with controlled `itemCount` signal, assert badge text |
| Unit/UI | CartPage renders items/empty/remove/clear | Mock `CartService`, set `cart` signal with items, assert DOM |
| Integration | Route /cart renders CartPage | Provide mock services, navigate with `RouterTestingHarness`, assert component created |
| Unit | Existing tests pass | Run `ng test`, verify no regressions |

## Migration / Rollout

No migration required. Cart data lives in localStorage — existing data survives. The change is purely additive UI wiring; no existing behavior changes.

## Open Questions

- [ ] Should the cart badge be hidden when `itemCount` is 0 (spec says "SHOULD show '0' or be hidden")? Decision needed by developer.
- [ ] CartPage needs `RouterLink` for navigation back to products? Not in scope, but consider adding a "Continue Shopping" link.
