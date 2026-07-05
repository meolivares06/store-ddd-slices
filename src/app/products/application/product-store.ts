import { inject, Service, signal } from '@angular/core';
import { ProductHttp } from '../infrastructure/product-http';
import { Product } from '../domain/product.model';

@Service()
export class ProductStore {
    readonly #productHttp = inject(ProductHttp);

    readonly #products = signal<Product[]>([]);
    readonly products = this.#products.asReadonly();

    loadProducts() {
        return this.#productHttp.getAll().subscribe(data => this.#products.set(data));
    }

    // Operación específica de la feature (Lógica de aplicación)
    applyDiscountToAll(percentage: number): void {
        this.#products.update(list => 
        list.map(p => ({ ...p, price: p.price * (1 - percentage / 100) }))
        );
    }
}
