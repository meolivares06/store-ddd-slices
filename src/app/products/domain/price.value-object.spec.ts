import { Price } from './price.value-object';

describe('Price Value Object', () => {
  describe('creation', () => {
    it('should create a Price with valid amount and default currency', () => {
      const price = Price.create(10);

      expect(price.amount).toBe(10);
      expect(price.currency).toBe('USD');
    });

    it('should create a Price with a custom currency', () => {
      const price = Price.create(25, 'EUR');

      expect(price.amount).toBe(25);
      expect(price.currency).toBe('EUR');
    });

    it('should throw when amount is negative', () => {
      expect(() => Price.create(-5)).toThrow('Price amount cannot be negative');
    });

    it('should throw when currency is empty', () => {
      expect(() => Price.create(10, '')).toThrow('Currency is required');
    });
  });

  describe('formatted', () => {
    it('should return formatted string with amount and currency', () => {
      const price = Price.create(15.99, 'USD');

      expect(price.formatted).toBe('15.99 USD');
    });
  });

  describe('add', () => {
    it('should add two prices with the same currency', () => {
      const a = Price.create(10, 'USD');
      const b = Price.create(20, 'USD');

      const result = a.add(b);

      expect(result.amount).toBe(30);
      expect(result.currency).toBe('USD');
    });

    it('should throw when adding prices with different currencies', () => {
      const a = Price.create(10, 'USD');
      const b = Price.create(20, 'EUR');

      expect(() => a.add(b)).toThrow('Cannot add prices with different currencies');
    });

    it('should not mutate the original prices', () => {
      const a = Price.create(10, 'USD');
      const b = Price.create(20, 'USD');

      a.add(b);

      expect(a.amount).toBe(10);
      expect(b.amount).toBe(20);
    });
  });

  describe('applyDiscount', () => {
    it('should apply a percentage discount', () => {
      const price = Price.create(100, 'USD');

      const discounted = price.applyDiscount(20);

      expect(discounted.amount).toBe(80);
    });

    it('should throw when percentage is negative', () => {
      const price = Price.create(100);

      expect(() => price.applyDiscount(-10)).toThrow('Invalid discount percentage');
    });

    it('should throw when percentage exceeds 100', () => {
      const price = Price.create(100);

      expect(() => price.applyDiscount(150)).toThrow('Invalid discount percentage');
    });

    it('should not mutate the original price', () => {
      const price = Price.create(100, 'USD');

      price.applyDiscount(20);

      expect(price.amount).toBe(100);
    });
  });
});
