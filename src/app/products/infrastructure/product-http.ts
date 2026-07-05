import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product, ProductResponse } from '../domain/product.model';

@Service()
export class ProductHttp {
    readonly #http = inject(HttpClient);

    readonly baseUrl = 'https://dummyjson.com/products';
    
    getAll(): Observable<Product[]> {
        return this.#http.get<ProductResponse>(this.baseUrl).pipe(
            map(response => response.products)
        );
    }

    create(product: Omit<Product, 'id'>): Observable<Product> {
        return this.#http.post<Product>(this.baseUrl, product);
    }
}
