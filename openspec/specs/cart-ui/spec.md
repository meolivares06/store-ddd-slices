# Cart UI Specification

## Purpose

Defines the UI layer connecting the existing Cart domain (aggregate, CartService, localStorage persistence) into the application — add-to-cart interaction on product cards, a reactive cart badge in the header, and a dedicated cart management page at `/cart`.

## Requirements

### Requirement: addToCart Output on ProductComponent

ProductComponent MUST expose `addToCart = output<Product>()`. The template MUST render a "Agregar al carrito" `<button>` that emits the current product on click. The component MUST NOT depend on CartService or any cart infrastructure.

#### Scenario: Button emits product on click

- GIVEN a ProductComponent with a product input
- WHEN the user clicks the "Agregar al carrito" button
- THEN the component emits the product via `addToCart`

#### Scenario: No cart coupling in dumb component

- GIVEN the ProductComponent
- THEN it MUST NOT inject CartService or any cart-specific dependency

### Requirement: ProductList Handles addToCart

ProductList MUST bind `(addToCart)` on `<app-product>`, inject CartService, and call `cartService.addToCart(product.id, product.price, 1)` when the event fires.

#### Scenario: Delegates to CartService

- GIVEN ProductList displays products via ProductComponent
- WHEN the user clicks "Agregar al carrito" on a product
- THEN ProductList calls `cartService.addToCart(product.id, product.price, 1)` with that product's ID, Price value-object, and quantity 1

### Requirement: Layout Cart Badge and Navigation

Layout MUST inject CartService, display the `itemCount()` signal as a badge near the cart icon, and provide `routerLink` navigation for `/products` and `/cart`.

#### Scenario: Badge updates reactively

- GIVEN Layout renders
- WHEN CartService.itemCount() changes (add/remove item)
- THEN the badge updates to reflect the new count immediately (signals)

#### Scenario: Empty cart badge

- GIVEN the cart has no items (itemCount is 0)
- THEN the badge SHOULD show "0" or be hidden

#### Scenario: Navigation links present

- GIVEN Layout renders
- THEN it MUST contain anchor/routerLink elements pointing to `/products` and `/cart`

### Requirement: CartPage Displays and Manages Cart

CartPage MUST use `CartService.cart` to list items showing `productId`, `unitPrice.formatted`, and `quantity`. It MUST provide a remove button per item, display `CartService.total.formatted`, and include a clear cart button. An empty state message MUST appear when the cart has no items.

#### Scenario: Display cart items

- GIVEN the cart has items
- WHEN CartPage renders
- THEN each item displays productId, unitPrice.formatted, and quantity

#### Scenario: Remove item

- GIVEN the cart has items
- WHEN the user clicks remove on an item
- THEN CartService.removeFromCart(productId) is called for that item

#### Scenario: Clear cart

- GIVEN the cart has items
- WHEN the user clicks "Clear cart"
- THEN CartService.clearCart() is called
- AND the page shows the empty state

#### Scenario: Empty state

- GIVEN the cart has no items
- WHEN CartPage renders
- THEN it displays an empty state message (e.g., "Your cart is empty")

#### Scenario: Total display

- GIVEN the cart has items
- THEN CartPage displays `CartService.total.formatted` as the total

### Requirement: Cart Route

The application routes MUST include `{ path: 'cart', component: CartPage }` imported from `cart/application/ui/cart/cart`. Existing `/products` route MUST remain unchanged.

#### Scenario: Navigate to cart

- GIVEN the app is running
- WHEN the user navigates to `/cart`
- THEN CartPage renders

#### Scenario: Existing routes preserved

- GIVEN the app is running
- WHEN the user navigates to `/products`
- THEN ProductList renders (unchanged)
