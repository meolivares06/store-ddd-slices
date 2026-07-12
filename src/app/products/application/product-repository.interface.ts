import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../domain/product.model';
import { ProductSortCriteria } from './product-sort-criteria';

export interface ProductRepository {
  getAll(criteria?: ProductSortCriteria): Observable<Product[]>;
}

export const PRODUCT_REPOSITORY_TOKEN = new InjectionToken<ProductRepository>(
  'ProductRepositoryToken',
);
