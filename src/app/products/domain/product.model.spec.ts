import { Product } from './product.model';
import { Price } from '../../shared/domain/price.value-object';

describe('Product Domain Entity', () => {
  const validProps = { id: '1', name: 'Test Product', price: Price.create(100), thumbnail: 'thumb.jpg', images: ['img1.jpg'] };

  describe('creation', () => {
    it('should create a Product with valid props', () => {
      const product = Product.create(validProps);

      expect(product).toBeInstanceOf(Product);
      expect(product.id).toBe('1');
      expect(product.name).toBe('Test Product');
      expect(product.price.amount).toBe(100);
    });

    it('should throw when name is empty', () => {
      expect(() => Product.create({ ...validProps, name: '' })).toThrow(
        'Product name cannot be empty',
      );
    });

    it('should throw when name is only whitespace', () => {
      expect(() => Product.create({ ...validProps, name: '   ' })).toThrow(
        'Product name cannot be empty',
      );
    });
  });

  describe('applyDiscount', () => {
    it('should return a new Product with discounted price', () => {
      const product = Product.create(validProps);

      const discounted = product.applyDiscount(10);

      expect(discounted.price.amount).toBe(90);
      expect(discounted.id).toBe(product.id);
      expect(discounted.name).toBe(product.name);
    });

    it('should not mutate the original Product', () => {
      const product = Product.create(validProps);

      product.applyDiscount(50);

      expect(product.price.amount).toBe(100);
    });

    it('should preserve the original Product equality after discount', () => {
      const product = Product.create(validProps);

      product.applyDiscount(30);

      expect(product).toEqual(Product.create(validProps));
    });
  });

  describe('updatePrice', () => {
    it('should return a new Product with the updated price', () => {
      const product = Product.create(validProps);
      const newPrice = Price.create(150, 'USD');

      const updated = product.updatePrice(newPrice);

      expect(updated.price.amount).toBe(150);
      expect(updated.price.currency).toBe('USD');
      expect(updated.id).toBe(product.id);
      expect(updated.name).toBe(product.name);
    });
  });
});
