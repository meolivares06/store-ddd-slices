import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductHttp } from './product-http';

describe('ProductHttp', () => {
  let service: ProductHttp;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(ProductHttp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
