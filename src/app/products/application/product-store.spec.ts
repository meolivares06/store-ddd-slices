import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductStore } from './product-store';
import { ProductHttp } from '../infrastructure/product-http';
import { PRODUCT_REPOSITORY_TOKEN } from './product-repository.interface';

describe('ProductStore', () => {
  let service: ProductStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: PRODUCT_REPOSITORY_TOKEN, useExisting: ProductHttp },
      ],
    });
    service = TestBed.inject(ProductStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
