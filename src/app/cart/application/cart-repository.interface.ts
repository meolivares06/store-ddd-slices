import { InjectionToken } from '@angular/core';
import { Cart } from '../domain/cart.model';

export interface CartRepository {
  save(cart: Cart): void;
  load(): Cart | null;
  clear(): void;
}

export const CART_REPOSITORY_TOKEN = new InjectionToken<CartRepository>(
  'CartRepositoryToken',
);
