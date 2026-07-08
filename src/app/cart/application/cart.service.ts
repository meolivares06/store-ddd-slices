import { inject, Service, signal, computed } from '@angular/core';
import { CART_REPOSITORY_TOKEN } from './cart-repository.interface';
import {
  CART_ITEM_SNAPSHOT_REPOSITORY_TOKEN,
  CartItemSnapshot,
} from './cart-item-snapshot-repository.interface';
import { Price } from '../../shared/domain/price.value-object';
import { Cart } from '../domain/cart.model';

export interface AddToCartSnapshotInput {
  title: string;
  imageUrl: string;
  priceLabel?: string;
}

@Service()
export class CartService {
  readonly #repository = inject(CART_REPOSITORY_TOKEN);
  readonly #snapshotRepository = inject(CART_ITEM_SNAPSHOT_REPOSITORY_TOKEN);

  readonly #cart = signal<Cart | null>(null);
  readonly #itemSnapshots = signal<Record<string, CartItemSnapshot>>({});
  readonly cart = this.#cart.asReadonly();
  readonly itemSnapshots = this.#itemSnapshots.asReadonly();

  readonly total = computed(() => this.#cart()?.total ?? Price.create(0));
  readonly itemCount = computed(() => this.#cart()?.itemCount ?? 0);

  constructor() {
    this.#loadFromStorage();
  }

  addToCart(
    productId: string,
    price: Price,
    quantity: number,
    snapshot?: AddToCartSnapshotInput,
  ): void {
    let currentCart = this.#cart();

    if (!currentCart) {
      currentCart = Cart.create(crypto.randomUUID(), 'anonymous_user');
    } else {
      currentCart = currentCart.clone();
    }

    try {
      currentCart.addItem(productId, price, quantity);
      this.#repository.save(currentCart);
      if (snapshot) {
        const storedSnapshot: CartItemSnapshot = {
          productId,
          title: snapshot.title,
          imageUrl: snapshot.imageUrl,
          priceLabel: snapshot.priceLabel,
        };
        this.#snapshotRepository.save(storedSnapshot);
        this.#itemSnapshots.update(current => ({
          ...current,
          [productId]: storedSnapshot,
        }));
      }
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

    if (!clonedCart.items.some(item => item.productId === productId)) {
      this.#snapshotRepository.remove(productId);
      this.#itemSnapshots.update(current => {
        const next = { ...current };
        delete next[productId];
        return next;
      });
    }

    if (clonedCart.itemCount === 0) {
      this.#repository.clear();
      this.#snapshotRepository.clear();
      this.#itemSnapshots.set({});
    }

    this.#cart.set(clonedCart);
  }

  clearCart(): void {
    this.#repository.clear();
    this.#snapshotRepository.clear();
    this.#itemSnapshots.set({});
    this.#cart.set(null);
  }

  setCartItemQuantity(productId: string, quantity: number): void {
    const currentCart = this.#cart();
    if (!currentCart) return;

    const clonedCart = currentCart.clone();

    try {
      clonedCart.setItemQuantity(productId, quantity);
      this.#repository.save(clonedCart);
      this.#cart.set(clonedCart);
    } catch (error) {
      console.error('Failed to set cart item quantity:', error);
    }
  }

  #loadFromStorage(): void {
    const saved = this.#repository.load();
    const snapshots = this.#snapshotRepository.loadAll();
    this.#itemSnapshots.set(snapshots);
    console.log('Loaded cart from storage:', saved);
    if (saved) {
      this.#cart.set(saved);
    }
  }
}
