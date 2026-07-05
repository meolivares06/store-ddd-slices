import { Price } from '../../products/domain/price.value-object';

export interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: Price;
}

export class Cart {
  readonly id: string;
  readonly customerId: string;

  private _items: CartItem[] = [];

  private constructor(id: string, customerId: string) {
    this.id = id;
    this.customerId = customerId;
  }

  static create(id: string, customerId: string): Cart {
    if (!id || id.trim() === '') throw new Error('Cart id is required');
    if (!customerId || customerId.trim() === '') throw new Error('Customer id is required');
    return new Cart(id, customerId);
  }

  get items(): readonly CartItem[] {
    return this._items;
  }

  addItem(productId: string, price: Price, quantity: number): void {
    if (quantity <= 0) throw new Error('Quantity must be greater than zero');

    const existing = this._items.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this._items.push({ productId, quantity, unitPrice: price });
    }
  }

  removeItem(productId: string): void {
    this._items = this._items.filter(item => item.productId !== productId);
  }

  get total(): Price {
    return this._items.reduce(
      (acc, item) => acc.add(
        Price.create(item.unitPrice.amount * item.quantity, item.unitPrice.currency),
      ),
      Price.create(0, 'USD'),
    );
  }

  get itemCount(): number {
    return this._items.reduce((acc, item) => acc + item.quantity, 0);
  }
}
