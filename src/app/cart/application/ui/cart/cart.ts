import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../cart.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  host: {
    class: 'cart-page border',
  },
})
export class CartPage {
  readonly #cartService = inject(CartService);

  readonly items = computed(() => this.#cartService.cart()?.items ?? []);
  readonly total = this.#cartService.total;

  removeFromCart(productId: string): void {
    this.#cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.#cartService.clearCart();
  }
}
