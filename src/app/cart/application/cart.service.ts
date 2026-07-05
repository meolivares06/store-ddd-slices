import { inject, Service, signal, computed } from '@angular/core';
import { CART_REPOSITORY_TOKEN } from './cart-repository.interface';
import { Price } from '../../shared/domain/price.value-object';
import { Cart } from '../domain/cart.model';

@Service()
export class CartService {
  readonly #repository = inject(CART_REPOSITORY_TOKEN);

  readonly #cart = signal<Cart | null>(null);
  readonly cart = this.#cart.asReadonly();

  readonly total = computed(() => this.#cart()?.total ?? Price.create(0, 'USD'));
  readonly itemCount = computed(() => this.#cart()?.itemCount ?? 0);

  constructor() {
    this.#loadFromStorage();
  }

  addToCart(productId: string, price: Price, quantity: number): void {
    let currentCart = this.#cart();

    if (!currentCart) {
      currentCart = Cart.create(crypto.randomUUID(), 'anonymous_user');
    } else {
      currentCart = currentCart.clone();
    }

    try {
      currentCart.addItem(productId, price, quantity);
      this.#repository.save(currentCart);
      this.#cart.set(currentCart);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  }

  removeFromCart(productId: string): void {
    const currentCart = this.#cart();
    if (!currentCart) return;

    const clonedCart = currentCart.clone();
    clonedCart.removeItem(productId);
    this.#repository.save(clonedCart);

    if (clonedCart.itemCount === 0) {
      this.#repository.clear();
    }

    this.#cart.set(clonedCart);
  }

  clearCart(): void {
    this.#repository.clear();
    this.#cart.set(null);
  }

  #loadFromStorage(): void {
    const saved = this.#repository.load();
    if (saved) {
      this.#cart.set(saved);
    }
  }
}
