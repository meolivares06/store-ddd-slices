export class Price {
  readonly amount: number;
  readonly currency: string;

  private constructor(amount: number, currency: string) {
    this.amount = amount;
    this.currency = currency;
  }

  static create(amount: number, currency = 'USD'): Price {
    if (amount < 0) throw new Error('Price amount cannot be negative');
    if (!currency || currency.trim() === '') throw new Error('Currency is required');
    return new Price(amount, currency);
  }

  get formatted(): string {
    return `${this.amount} ${this.currency}`;
  }

  add(other: Price): Price {
    if (this.currency !== other.currency) throw new Error('Cannot add prices with different currencies');
    return Price.create(this.amount + other.amount, this.currency);
  }

  applyDiscount(percentage: number): Price {
    if (percentage < 0 || percentage > 100) throw new Error('Invalid discount percentage');
    return Price.create(this.amount * (1 - percentage / 100), this.currency);
  }
}
