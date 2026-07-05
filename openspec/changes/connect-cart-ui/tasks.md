# Tasks: Connect Cart to UI

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~250 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Cart UI wiring | PR 1 | All 5 deliverables; ~250 lines, within budget |

## Phase 1: ProductComponent — addToCart Output

- [x] 1.1 Move `product.html` content to inline `template` in `product.ts`
- [x] 1.2 Add `addToCart = output<Product>()` and "Agregar al carrito" button emitting the current product on click
- [x] 1.3 Delete `products/application/ui/product/product.html`

## Phase 2: ProductList — Wire addToCart to CartService

- [x] 2.1 Inject `CartService` in `product-list.ts`, add `handleAddToCart(product)` calling `cartService.addToCart(product.id, product.price, 1)`
- [x] 2.2 Bind `(addToCart)="handleAddToCart($event)"` on `<app-product>` in `product-list.html`

## Phase 3: Layout — Cart Badge and Navigation

- [x] 3.1 Inject `CartService` and import `RouterLink` in `layout.ts`; expose `itemCount()`
- [x] 3.2 Add `<nav>` with `routerLink="/products"` and `routerLink="/cart"` in `layout.html`
- [x] 3.3 Add cart badge bound to `itemCount()`, hidden via `@if (itemCount() > 0)` when empty

## Phase 4: CartPage — Create Component

- [x] 4.1 Create `cart/application/ui/cart/cart.ts` — standalone, inject `CartService`, expose items/total/remove/clear
- [x] 4.2 Create `cart/application/ui/cart/cart.html` — `@for` over items, remove button, total, clear button, `@if` empty state, "Continue Shopping" link to `/products`
- [x] 4.3 Create `cart/application/ui/cart/cart.css` — scoped styles

## Phase 5: Routes — Register /cart

- [x] 5.1 Import `CartPage` and add `{ path: 'cart', component: CartPage }` in `app.routes.ts`

## Phase 6: Tests

- [x] 6.1 Update `product.spec.ts` — add test for button click emitting product via `addToCart`
- [x] 6.2 Update `product-list.spec.ts` — provide mock `CartService` via `CART_REPOSITORY_TOKEN`
- [x] 6.3 Update `layout.spec.ts` — provide mock `CartService`, assert badge renders `itemCount()`
- [x] 6.4 Create `cart.spec.ts` — test render items, remove, clear, empty state with mock `CartService`
