import { inject, Service, signal } from '@angular/core';
import { Product } from '../domain/product.model';
import { PRODUCT_REPOSITORY_TOKEN } from './product-repository.interface';

@Service()
export class ProductStore {
  readonly #repository = inject(PRODUCT_REPOSITORY_TOKEN);

  readonly #products = signal<Product[]>([]);
  readonly products = this.#products.asReadonly();

  loadProducts() {
    return this.#repository.getAll().subscribe(data => this.#products.set(data));
  }

  applyDiscountToAll(percentage: number): void {
    this.#products.update(list =>
      list.map(product => product.applyDiscount(percentage)),
    );
  }
}
