import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductStore } from './product-store';

describe('ProductStore', () => {
  let service: ProductStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(ProductStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
