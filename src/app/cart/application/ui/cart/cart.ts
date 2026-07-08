import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../cart.service';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';
import { CartItem } from '../../../domain/cart.model';

export interface CartItemViewModel extends CartItem {
  title: string;
  imageUrl: string | null;
  hasProductChanged: boolean;
}

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

  readonly items = computed<CartItemViewModel[]>(() => {
    const snapshots = this.#cartService.itemSnapshots();
    return (this.#cartService.cart()?.items ?? []).map(item => {
      const snapshot = snapshots[item.productId];
      const fallbackTitle = `Product ${item.productId.substring(0, 4)}`;
      const hasProductChanged =
        snapshot?.priceLabel !== undefined && snapshot.priceLabel !== item.unitPrice.formatted;

      return {
        ...item,
        title: snapshot?.title || fallbackTitle,
        imageUrl: snapshot?.imageUrl || null,
        hasProductChanged,
      };
    });
  });
  readonly total = this.#cartService.total;
  readonly itemCount = this.#cartService.itemCount;

  removeFromCart(productId: string): void {
    this.#cartService.removeFromCart(productId);
  }

  updateQuantity(event: { productId: string; quantity: number }): void {
    const item = this.items().find(i => i.productId === event.productId);
    if (item && event.quantity !== item.quantity) {
      this.#cartService.setCartItemQuantity(event.productId, event.quantity);
    }
  }

  clearCart(): void {
    this.#cartService.clearCart();
  }
}
