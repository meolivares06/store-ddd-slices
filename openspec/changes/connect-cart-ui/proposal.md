# Proposal: Connect Cart to UI

## Intent

Cart domain exists (aggregate, service, persistence) but has no UI. Products display without purchase interaction. This bridges that gap — add-to-cart, cart indicator, and cart page.

## Scope

### In Scope
- `addToCart` output on `ProductComponent` with "Agregar al carrito" button
- `ProductList` handles event via `CartService.addToCart()`
- Cart icon + count in `Layout` header; nav links for `/products` and `/cart`
- `CartPage` under `cart/application/ui/cart/` — item list, remove, total, clear, empty state
- Route `/cart` in `app.routes.ts`

### Out of Scope
- Loading/skeleton states for product list
- Checkout flow
- Quantity adjustment in cart (only add/remove)
- Product detail page
- Cart persistence changes (stays LocalStorage)
- Product name in cart items (shows ID only)

## Capabilities

### New Capabilities
- `cart-ui`: Cart page, header indicator, add-to-cart interaction wiring

### Modified Capabilities
- None

## Approach

1. **ProductComponent** — add `addToCart = output<Product>()`, button in template. No cart dependency.
2. **ProductList** — inject `CartService`, bind `(addToCart)`, call `cartService.addToCart(product.id, product.price, 1)`.
3. **Layout** — inject `CartService`, show badge with `itemCount()`, add `routerLink` for both routes.
4. **CartPage** — `@for` over items, show `productId`, `unitPrice.formatted`, `quantity`. Remove per item. Total from `cartService.total`. Clear calls `clearCart()`. `@if` empty state.
5. **Routes** — add `{ path: 'cart', component: CartPage }`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `products/application/ui/product/` | Modified | Add `addToCart` output + button |
| `products/application/ui/product-list/` | Modified | Handle addToCart, inject CartService |
| `layout/layout/` | Modified | Cart badge, nav links |
| `cart/application/ui/cart/` | New | CartPage component |
| `app.routes.ts` | Modified | Add `/cart` route |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Cart shows productId not name — poor UX | High | Known limitation; future cross-ref with ProductStore |
| Cart badge update delayed | Low | Signals react instantly — no risk |

## Rollback Plan

Revert all changed files. Remove `cart/application/ui/cart/`. Remove `/cart` route. Remove CartService from Layout. Remove output from ProductComponent.

## Dependencies

- None external. `CartService` provides all needed signals.

## Success Criteria

- [ ] "Agregar al carrito" updates cart count in header immediately
- [ ] `/cart` shows items with product ID, price, quantity
- [ ] Empty cart displays empty state
- [ ] Remove / clear buttons work
- [ ] All existing tests pass
