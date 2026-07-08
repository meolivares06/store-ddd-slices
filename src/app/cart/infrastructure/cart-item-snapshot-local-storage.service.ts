import { Service, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CartItemSnapshot,
  CartItemSnapshotRepository,
} from '../application/cart-item-snapshot-repository.interface';

interface SnapshotStore {
  [productId: string]: CartItemSnapshot;
}

@Service()
export class CartItemSnapshotLocalStorageService implements CartItemSnapshotRepository {
  readonly #platformId = inject(PLATFORM_ID);
  readonly #key = 'shopping_cart_item_snapshots';

  save(snapshot: CartItemSnapshot): void {
    if (!isPlatformBrowser(this.#platformId)) return;

    const snapshots = this.loadAll();
    snapshots[snapshot.productId] = snapshot;
    localStorage.setItem(this.#key, JSON.stringify(snapshots));
  }

  loadAll(): Record<string, CartItemSnapshot> {
    if (!isPlatformBrowser(this.#platformId)) return {};

    const raw = localStorage.getItem(this.#key);
    if (!raw) return {};

    try {
      return JSON.parse(raw) as SnapshotStore;
    } catch {
      return {};
    }
  }

  remove(productId: string): void {
    if (!isPlatformBrowser(this.#platformId)) return;

    const snapshots = this.loadAll();
    delete snapshots[productId];
    localStorage.setItem(this.#key, JSON.stringify(snapshots));
  }

  clear(): void {
    if (!isPlatformBrowser(this.#platformId)) return;
    localStorage.removeItem(this.#key);
  }
}
