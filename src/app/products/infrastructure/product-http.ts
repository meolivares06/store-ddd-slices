import { inject, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product } from '../domain/product.model';
import { Price } from '../../shared/domain/price.value-object';
import { ProductRepository } from '../application/product-repository.interface';
import { ApiProduct, ApiProductResponse } from './product-api.dto';
import { ProductSortCriteria } from '../application/product-sort-criteria';

/**
 * Maps an API product DTO to a domain Product entity.
 * This adapter isolates the domain from external API contract changes.
 */
const mapToProduct = (api: ApiProduct): Product =>
  Product.create({
    id: String(api.id),
    name: api.title,
    price: Price.create(api.price),
    thumbnail: api.thumbnail || 'https://via.placeholder.com/300',
    images: api.images || [],
    description: api.description || '',
  });

@Service()
export class ProductHttp implements ProductRepository {
  readonly #http = inject(HttpClient);

  readonly baseUrl = 'https://dummyjson.com/products';

  getAll(criteria?: ProductSortCriteria): Observable<Product[]> {
    return this.#http.get<ApiProductResponse>(this.baseUrl, { params: buildSortParams(criteria) }).pipe(
      map(response => response.products.map(mapToProduct)),
    );
  }
}

const buildSortParams = (criteria?: ProductSortCriteria): HttpParams => {
  if (!criteria) {
    return new HttpParams();
  }

  if (criteria.field !== 'RELEVANCE' && criteria.field !== 'PRICE') {
    return new HttpParams();
  }

  if (criteria.direction !== 'asc' && criteria.direction !== 'desc') {
    return new HttpParams();
  }

  const sortBy = criteria.field === 'RELEVANCE' ? 'rating' : 'price';
  return new HttpParams({ fromObject: { sortBy, order: criteria.direction } });
};
