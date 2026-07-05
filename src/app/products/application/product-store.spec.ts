import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ProductStore } from './product-store';
import { PRODUCT_REPOSITORY_TOKEN, ProductRepository } from './product-repository.interface';
import { Product } from '../domain/product.model';
import { Price } from '../domain/price.value-object';

describe('ProductStore', () => {
  let store: ProductStore;
  let mockRepo: ProductRepository;

  const makeProduct = (id: string, price: number) =>
    Product.create({ id, name: `Product ${id}`, price: Price.create(price, 'USD') });

  beforeEach(() => {
    mockRepo = {
      getAll: vi.fn(),
      create: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProductStore,
        { provide: PRODUCT_REPOSITORY_TOKEN, useValue: mockRepo },
      ],
    });

    store = TestBed.inject(ProductStore);
  });

  describe('initial state', () => {
    it('should start with an empty product list', () => {
      expect(store.products()).toEqual([]);
    });
  });

  describe('loadProducts', () => {
    it('should load products from the repository into the signal', () => {
      const items = [makeProduct('1', 10), makeProduct('2', 20)];
      mockRepo.getAll = vi.fn().mockReturnValue(of(items));

      store.loadProducts();

      expect(store.products().length).toBe(2);
      expect(store.products()[0].name).toBe('Product 1');
      expect(store.products()[1].price.amount).toBe(20);
    });

    it('should call getAll on the repository', () => {
      mockRepo.getAll = vi.fn().mockReturnValue(of([]));

      store.loadProducts();

      expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('applyDiscountToAll', () => {
    it('should apply a discount to every product using domain logic', () => {
      const items = [makeProduct('1', 100), makeProduct('2', 200)];
      mockRepo.getAll = vi.fn().mockReturnValue(of(items));
      store.loadProducts();

      store.applyDiscountToAll(10);

      expect(store.products()[0].price.amount).toBe(90);
      expect(store.products()[1].price.amount).toBe(180);
    });

    it('should not mutate the original products', () => {
      const original = makeProduct('1', 100);
      mockRepo.getAll = vi.fn().mockReturnValue(of([original]));
      store.loadProducts();

      store.applyDiscountToAll(10);

      expect(original.price.amount).toBe(100);
    });
  });
});
