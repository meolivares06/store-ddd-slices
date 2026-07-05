import { Cart } from './cart.model';
import { Price } from '../../shared/domain/price.value-object';

describe('Cart Aggregate Root', () => {
  const validId = 'cart-1';
  const customerId = 'user-1';
  const bookPrice = Price.create(10, 'USD');
  const shirtPrice = Price.create(25, 'USD');

  describe('creation', () => {
    it('should create a cart with valid id and customer', () => {
      const cart = Cart.create(validId, customerId);

      expect(cart.id).toBe(validId);
      expect(cart.customerId).toBe(customerId);
      expect(cart.items).toEqual([]);
      expect(cart.itemCount).toBe(0);
    });

    it('should throw when id is empty', () => {
      expect(() => Cart.create('', customerId)).toThrow('Cart id is required');
    });

    it('should throw when customerId is empty', () => {
      expect(() => Cart.create(validId, '')).toThrow('Customer id is required');
    });
  });

  describe('addItem', () => {
    it('should add a new item to the cart', () => {
      const cart = Cart.create(validId, customerId);

      cart.addItem('book-1', bookPrice, 2);

      expect(cart.items.length).toBe(1);
      expect(cart.items[0].productId).toBe('book-1');
      expect(cart.items[0].quantity).toBe(2);
      expect(cart.items[0].unitPrice.amount).toBe(10);
    });

    it('should increment quantity when adding an existing product', () => {
      const cart = Cart.create(validId, customerId);

      cart.addItem('book-1', bookPrice, 2);
      cart.addItem('book-1', bookPrice, 3);

      expect(cart.items.length).toBe(1);
      expect(cart.items[0].quantity).toBe(5);
    });

    it('should throw when quantity is zero or negative', () => {
      const cart = Cart.create(validId, customerId);

      expect(() => cart.addItem('book-1', bookPrice, 0)).toThrow(
        'Quantity must be greater than zero',
      );
      expect(() => cart.addItem('book-1', bookPrice, -1)).toThrow(
        'Quantity must be greater than zero',
      );
    });

    it('should keep items from different products separate', () => {
      const cart = Cart.create(validId, customerId);

      cart.addItem('book-1', bookPrice, 2);
      cart.addItem('shirt-1', shirtPrice, 1);

      expect(cart.items.length).toBe(2);
    });
  });

  describe('removeItem', () => {
    it('should remove an existing item from the cart', () => {
      const cart = Cart.create(validId, customerId);
      cart.addItem('book-1', bookPrice, 2);
      cart.addItem('shirt-1', shirtPrice, 1);

      cart.removeItem('book-1');

      expect(cart.items.length).toBe(1);
      expect(cart.items[0].productId).toBe('shirt-1');
    });

    it('should do nothing when removing a non-existent item', () => {
      const cart = Cart.create(validId, customerId);
      cart.addItem('book-1', bookPrice, 2);

      cart.removeItem('nonexistent');

      expect(cart.items.length).toBe(1);
    });
  });

  describe('total', () => {
    it('should be zero for an empty cart', () => {
      const cart = Cart.create(validId, customerId);

      expect(cart.total.amount).toBe(0);
      expect(cart.total.currency).toBe('USD');
    });

    it('should calculate total for a single item', () => {
      const cart = Cart.create(validId, customerId);
      cart.addItem('book-1', Price.create(10, 'USD'), 3);

      expect(cart.total.amount).toBe(30);
    });

    it('should calculate total for multiple items', () => {
      const cart = Cart.create(validId, customerId);
      cart.addItem('book-1', Price.create(10, 'USD'), 2);
      cart.addItem('shirt-1', Price.create(25, 'USD'), 3);

      expect(cart.total.amount).toBe(95);
    });
  });

  describe('itemCount', () => {
    it('should return total quantity across all items', () => {
      const cart = Cart.create(validId, customerId);
      cart.addItem('book-1', bookPrice, 2);
      cart.addItem('shirt-1', shirtPrice, 3);

      expect(cart.itemCount).toBe(5);
    });
  });

  describe('clone', () => {
    it('should return a new instance with the same id and customerId', () => {
      const original = Cart.create(validId, customerId);
      const cloned = original.clone();

      expect(cloned).not.toBe(original);
      expect(cloned.id).toBe(original.id);
      expect(cloned.customerId).toBe(original.customerId);
    });

    it('should contain the same items as the original', () => {
      const original = Cart.create(validId, customerId);
      original.addItem('book-1', bookPrice, 2);
      original.addItem('shirt-1', shirtPrice, 1);

      const cloned = original.clone();

      expect(cloned.items.length).toBe(2);
      expect(cloned.items[0].productId).toBe('book-1');
      expect(cloned.items[0].quantity).toBe(2);
      expect(cloned.items[1].productId).toBe('shirt-1');
      expect(cloned.items[1].quantity).toBe(1);
    });

    it('should be independent — mutating the clone does not affect the original', () => {
      const original = Cart.create(validId, customerId);
      original.addItem('book-1', bookPrice, 2);

      const cloned = original.clone();
      cloned.addItem('shirt-1', shirtPrice, 1);

      expect(original.items.length).toBe(1);
      expect(cloned.items.length).toBe(2);
    });
  });
});
