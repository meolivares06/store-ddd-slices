import { DomainEvent } from './domain-event.base';
import { Price } from '../price.value-object';

export interface AddToCartSnapshotInput {
  title: string;
  imageUrl: string;
  priceLabel?: string;
}

export class AddToCartRequestedEvent extends DomainEvent {
  constructor(
    public readonly productId: string,
    public readonly price: Price,
    public readonly quantity: number,
    public readonly snapshot?: AddToCartSnapshotInput
  ) {
    super();
  }
}
