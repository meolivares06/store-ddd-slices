import { computed, inject, Service, signal } from '@angular/core';
import { Product } from '../domain/product.model';
import { PRODUCT_REPOSITORY_TOKEN } from './product-repository.interface';

export interface ProductView {
  id: string;
  name: string;
  formattedPrice: string;
}

@Service()
export class ProductStore {
  readonly #repository = inject(PRODUCT_REPOSITORY_TOKEN);

  readonly #products = signal<Product[]>([]);
  readonly products = this.#products.asReadonly();

  readonly productsView = computed<ProductView[]>(() =>
    this.#products().map(product => ({
      id: product.id,
      name: product.name,
      formattedPrice: product.price.format('en-US'),
    })),
  );

  loadProducts() {
    return this.#repository.getAll().subscribe(data => this.#products.set(data));
  }

  applyDiscountToAll(percentage: number): void {
    this.#products.update(list =>
      list.map(product => product.applyDiscount(percentage)),
    );
  }
}
