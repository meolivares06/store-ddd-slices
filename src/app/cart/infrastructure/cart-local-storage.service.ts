import { Service, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartRepository } from '../application/cart-repository.interface';
import { Cart } from '../domain/cart.model';
import { Price } from '../../products/domain/price.value-object';

interface CartStore {
  id: string;
  customerId: string;
  items: { productId: string; quantity: number; amount: number; currency: string }[];
}

// TODO(Senior): SSR fix — localStorage no existe en Node.js durante el prerender.
//  Al inyectar PLATFORM_ID + isPlatformBrowser() en load() se resuelve:
//
//    #platformId = inject(PLATFORM_ID);
//    if (!isPlatformBrowser(this.#platformId)) return null;
//
//  Esto permite que las rutas que dependen de CartService se prerendericen sin error.
//  Referencia: openspec/changes/connect-cart-ui/verify-report.md → SSR prerender regression

@Service()
export class CartLocalStorageService implements CartRepository {
  private readonly KEY = 'shopping_cart_data';

  save(cart: Cart): void {
    const plainData: CartStore = {
      id: cart.id,
      customerId: cart.customerId,
      items: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        amount: item.unitPrice.amount,
        currency: item.unitPrice.currency,
      })),
    };
    localStorage.setItem(this.KEY, JSON.stringify(plainData));
  }

  load(): Cart | null {
    const data = localStorage.getItem(this.KEY);
    if (!data) return null;

    try {
      const parsed: CartStore = JSON.parse(data);
      const cart = Cart.create(parsed.id, parsed.customerId);

      parsed.items.forEach(item => {
        cart.addItem(item.productId, Price.create(item.amount, item.currency), item.quantity);
      });

      return cart;
    } catch {
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(this.KEY);
  }
}
