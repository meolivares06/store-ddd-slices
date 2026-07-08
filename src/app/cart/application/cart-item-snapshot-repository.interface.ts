import { InjectionToken } from '@angular/core';

export interface CartItemSnapshot {
  productId: string;
  title: string;
  imageUrl: string;
  priceLabel?: string;
}

export interface CartItemSnapshotRepository {
  save(snapshot: CartItemSnapshot): void;
  loadAll(): Record<string, CartItemSnapshot>;
  remove(productId: string): void;
  clear(): void;
}

export const CART_ITEM_SNAPSHOT_REPOSITORY_TOKEN =
  new InjectionToken<CartItemSnapshotRepository>('CartItemSnapshotRepositoryToken');
