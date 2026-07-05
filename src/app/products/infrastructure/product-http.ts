import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product, ProductApiResponse } from '../domain/product.model';

/**
 Adapter/Mapper Pattern: transform the API response before enters into Domain Layer.
 This is a good practice to decouple the API response from the Domain model.
 The Mapper: Pure function that maps the API product data to the Domain
 Purpose: If tomorrow the API changes, we can adapt the mapping logic here without affecting the rest of the application.
 In this case, the API product structure matches the Domain model, so we can return it directly.
 * @param apiProduct The product data from the API
 * @returns The product data mapped to the Domain model
 */

const mapToProduct = (apiProduct: Product): Product => apiProduct; 


@Service()
export class ProductHttp {
    readonly #http = inject(HttpClient);

    readonly baseUrl = 'https://dummyjson.com/products';
    
    getAll(): Observable<Product[]> {
        return this.#http.get<ProductApiResponse>(this.baseUrl).pipe(
            map(response => response.products.map(mapToProduct))
        );
    }

    create(product: Omit<Product, 'id'>): Observable<Product> {
        return this.#http.post<Product>(this.baseUrl, product);
    }
}