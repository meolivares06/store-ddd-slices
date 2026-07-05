import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { CartService } from './cart.service';
import { CART_REPOSITORY_TOKEN, CartRepository } from './cart-repository.interface';
import { Cart } from '../domain/cart.model';
import { Price } from '../../shared/domain/price.value-object';

describe('CartService', () => {
  let service: CartService;
  let mockRepo: CartRepository;

  const makeCart = () => Cart.create('cart-1', 'user-1');

  beforeEach(() => {
    mockRepo = {
      save: vi.fn(),
      load: vi.fn().mockReturnValue(null),
      clear: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: CART_REPOSITORY_TOKEN, useValue: mockRepo },
      ],
    });

    service = TestBed.inject(CartService);
  });

  describe('initial state', () => {
    it('should load cart from repository on creation', () => {
      expect(mockRepo.load).toHaveBeenCalledTimes(1);
    });

    it('should start with empty cart when no saved cart exists', () => {
      expect(service.cart()).toBeNull();
      expect(service.total().amount).toBe(0);
      expect(service.itemCount()).toBe(0);
    });

    it('should restore cart when saved data exists', () => {
      const savedCart = makeCart();
      savedCart.addItem('book-1', Price.create(10, 'USD'), 2);

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          CartService,
          {
            provide: CART_REPOSITORY_TOKEN,
            useValue: { save: vi.fn(), load: vi.fn().mockReturnValue(savedCart), clear: vi.fn() },
          },
        ],
      });

      const restored = TestBed.inject(CartService);

      expect(restored.cart()).not.toBeNull();
      expect(restored.cart()!.items.length).toBe(1);
      expect(restored.itemCount()).toBe(2);
      expect(restored.total().amount).toBe(20);
    });
  });

  describe('addToCart', () => {
    it('should add an item to the cart', () => {
      service.addToCart('book-1', Price.create(10, 'USD'), 2);

      expect(service.cart()).not.toBeNull();
      expect(service.itemCount()).toBe(2);
      expect(service.total().amount).toBe(20);
    });

    it('should increment quantity when adding same product twice', () => {
      service.addToCart('book-1', Price.create(10, 'USD'), 2);
      service.addToCart('book-1', Price.create(10, 'USD'), 3);

      expect(service.itemCount()).toBe(5);
    });

    it('should persist to repository after each add', () => {
      service.addToCart('book-1', Price.create(10, 'USD'), 1);

      expect(mockRepo.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('addToCart (reactivity)', () => {
    it('should create a new Cart reference when adding a new product to an existing cart', () => {
      service.addToCart('book-1', Price.create(10, 'USD'), 2);
      const firstCart = service.cart();

      service.addToCart('shirt-1', Price.create(25, 'USD'), 1);
      const secondCart = service.cart();

      expect(secondCart).not.toBe(firstCart);
      expect(service.itemCount()).toBe(3);
    });

    it('should create a new Cart reference when incrementing quantity of an existing product', () => {
      service.addToCart('book-1', Price.create(10, 'USD'), 2);
      const cartAfterFirstAdd = service.cart();

      service.addToCart('book-1', Price.create(10, 'USD'), 3);
      const cartAfterSecondAdd = service.cart();

      expect(cartAfterSecondAdd).not.toBe(cartAfterFirstAdd);
      expect(service.itemCount()).toBe(5);
    });
  });

  describe('removeFromCart', () => {
    it('should remove an item from the cart', () => {
      service.addToCart('book-1', Price.create(10, 'USD'), 2);
      service.addToCart('shirt-1', Price.create(25, 'USD'), 1);

      service.removeFromCart('book-1');

      expect(service.itemCount()).toBe(1);
      expect(service.cart()!.items[0].productId).toBe('shirt-1');
    });

    it('should clear storage when removing the last item', () => {
      service.addToCart('book-1', Price.create(10, 'USD'), 1);

      service.removeFromCart('book-1');

      expect(mockRepo.clear).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeFromCart (reactivity)', () => {
    it('should create a new Cart reference when removing an item', () => {
      service.addToCart('book-1', Price.create(10, 'USD'), 2);
      service.addToCart('shirt-1', Price.create(25, 'USD'), 1);
      const cartBeforeRemove = service.cart();

      service.removeFromCart('book-1');
      const cartAfterRemove = service.cart();

      expect(cartAfterRemove).not.toBe(cartBeforeRemove);
      expect(service.itemCount()).toBe(1);
    });

    it('should create a new Cart reference even when removing a non-existent product', () => {
      service.addToCart('book-1', Price.create(10, 'USD'), 2);
      const cartBeforeRemove = service.cart();

      service.removeFromCart('nonexistent');
      const cartAfterRemove = service.cart();

      expect(cartAfterRemove).not.toBe(cartBeforeRemove);
      expect(service.itemCount()).toBe(2);
    });
  });

  describe('clearCart', () => {
    it('should clear the cart and repository', () => {
      service.addToCart('book-1', Price.create(10, 'USD'), 2);

      service.clearCart();

      expect(service.cart()).toBeNull();
      expect(service.itemCount()).toBe(0);
      expect(mockRepo.clear).toHaveBeenCalledTimes(1);
    });
  });
});
