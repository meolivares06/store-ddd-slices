import { DomainEvent } from './domain-event.base';
import { AddToCartRequestedEvent } from './add-to-cart-requested.event';
import { Price } from '../price.value-object';

describe('AddToCartRequestedEvent', () => {
  it('should create an event with correct payload', () => {
    const price = Price.create(100);
    const event = new AddToCartRequestedEvent(
      'prod-1',
      price,
      2,
      {
        title: 'Product 1',
        imageUrl: 'http://img.com',
        priceLabel: '$100.00',
      }
    );

    expect(event).toBeInstanceOf(DomainEvent);
    expect(event.productId).toBe('prod-1');
    expect(event.price).toBe(price);
    expect(event.quantity).toBe(2);
    expect(event.snapshot?.title).toBe('Product 1');
  });
});
