import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product } from '../domain/product.model';
import { Price } from '../domain/price.value-object';
import { ApiProduct, ApiProductResponse } from './product-api.dto';

/**
 * Maps an API product DTO to a domain Product entity.
 * This adapter isolates the domain from external API contract changes.
 */
const mapToProduct = (api: ApiProduct): Product =>
  Product.create({
    id: String(api.id),
    name: api.title,
    price: Price.create(api.price, 'USD'),
  });

@Service()
export class ProductHttp {
  readonly #http = inject(HttpClient);

  readonly baseUrl = 'https://dummyjson.com/products';

  getAll(): Observable<Product[]> {
    return this.#http.get<ApiProductResponse>(this.baseUrl).pipe(
      map(response => response.products.map(mapToProduct)),
    );
  }

  create(product: Product): Observable<Product> {
    return this.#http.post<Product>(this.baseUrl, product);
  }
}
