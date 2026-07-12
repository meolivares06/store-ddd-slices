import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProductHttp } from './product-http';
import { Product } from '../domain/product.model';
import { Price } from '../../shared/domain/price.value-object';

describe('ProductHttp', () => {
  let service: ProductHttp;
  let httpController: HttpTestingController;

  const apiResponse = {
    products: [
      {
        id: 1,
        title: 'Phone',
        description: 'Desc',
        category: 'electronics',
        price: 100,
        discountPercentage: 0,
        rating: 4.8,
        stock: 10,
        tags: [],
        sku: 'SKU-1',
        weight: 1,
        dimensions: { width: 1, height: 1, depth: 1 },
        warrantyInformation: '1 year',
        shippingInformation: 'Standard',
        availabilityStatus: 'In Stock',
        reviews: [],
        returnPolicy: '30 days',
        minimumOrderQuantity: 1,
        meta: {
          createdAt: '2020-01-01',
          updatedAt: '2020-01-01',
          barcode: '123',
          qrCode: 'qr',
        },
        images: ['img.jpg'],
        thumbnail: 'thumb.jpg',
      },
    ],
    total: 1,
    skip: 0,
    limit: 30,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductHttp);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('maps PRICE asc criteria to price/asc query params', () => {
    service.getAll({ field: 'PRICE', direction: 'asc' }).subscribe();

    const request = httpController.expectOne(req =>
      req.url === 'https://dummyjson.com/products' &&
      req.params.get('sortBy') === 'price' &&
      req.params.get('order') === 'asc',
    );

    expect(request.request.method).toBe('GET');
    request.flush(apiResponse);
  });

  it('maps RELEVANCE desc criteria to rating/desc query params', () => {
    service.getAll({ field: 'RELEVANCE', direction: 'desc' }).subscribe();

    const request = httpController.expectOne(req =>
      req.url === 'https://dummyjson.com/products' &&
      req.params.get('sortBy') === 'rating' &&
      req.params.get('order') === 'desc',
    );

    expect(request.request.method).toBe('GET');
    request.flush(apiResponse);
  });

  it('omits sortBy/order params when criteria is absent', () => {
    service.getAll().subscribe();

    const request = httpController.expectOne(req => req.url === 'https://dummyjson.com/products');

    expect(request.request.params.has('sortBy')).toBe(false);
    expect(request.request.params.has('order')).toBe(false);
    request.flush(apiResponse);
  });

  it('omits sortBy/order params when criteria is invalid at runtime', () => {
    service.getAll({ field: 'UNKNOWN', direction: 'up' } as never).subscribe();

    const request = httpController.expectOne(req => req.url === 'https://dummyjson.com/products');

    expect(request.request.params.has('sortBy')).toBe(false);
    expect(request.request.params.has('order')).toBe(false);
    request.flush(apiResponse);
  });

  it('maps ApiProduct DTOs to Product entities with Price value-object semantics', () => {
    let mappedProducts: Product[] = [];

    service.getAll({ field: 'PRICE', direction: 'asc' }).subscribe(products => {
      mappedProducts = products;
    });

    const request = httpController.expectOne(req =>
      req.url === 'https://dummyjson.com/products' &&
      req.params.get('sortBy') === 'price' &&
      req.params.get('order') === 'asc',
    );

    request.flush(apiResponse);

    expect(mappedProducts).toHaveLength(1);
    expect(mappedProducts[0]).toBeInstanceOf(Product);
    expect(mappedProducts[0]?.id).toBe('1');
    expect(mappedProducts[0]?.name).toBe('Phone');
    expect(mappedProducts[0]?.price).toBeInstanceOf(Price);
    expect(mappedProducts[0]?.price.amount).toBe(100);
    expect(mappedProducts[0]?.price.currency).toBe('BRL');
    expect(mappedProducts[0]?.price.formatted).toBe('100 BRL');
  });
});
