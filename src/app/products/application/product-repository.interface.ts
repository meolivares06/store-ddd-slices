import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../domain/product.model';

export interface ProductRepository {
  getAll(): Observable<Product[]>;
}

export const PRODUCT_REPOSITORY_TOKEN = new InjectionToken<ProductRepository>(
  'ProductRepositoryToken',
);
