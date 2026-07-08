import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../cart.service';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CartItemComponent, CartSummaryComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  host: {
    class: 'cart-page',
  },
})
export class CartPage {
  readonly #cartService = inject(CartService);

  readonly items = computed(() => {
    // TODO: Event/Snapshot Logic
    // We need to map the pure domain CartItems (productId, quantity, unitPrice)
    // into a ViewModel that joins data with Product (name, images, etc.)
    return this.#cartService.cart()?.items ?? [];
  });
  readonly total = this.#cartService.total;
  readonly itemCount = this.#cartService.itemCount;

  removeFromCart(productId: string): void {
    this.#cartService.removeFromCart(productId);
  }

  updateQuantity(event: { productId: string; quantity: number }): void {
    // The previous implementation used addItem to increase quantity. 
    // Assuming we need to set exact quantity or adjust. Wait, CartService model addItem adds relative quantity.
    // Let me check CartService.
    const item = this.items().find(i => i.productId === event.productId);
    if (item) {
      const diff = event.quantity - item.quantity;
      if (diff !== 0) {
        this.#cartService.addToCart(event.productId, item.unitPrice, diff);
      }
    }
  }

  clearCart(): void {
    this.#cartService.clearCart();
  }
}
