import { Price } from './price.value-object';

export interface ProductProps {
  id: string;
  name: string;
  price: Price;
}

export class Product {
  readonly id: string;
  readonly name: string;
  readonly price: Price;

  private constructor(props: ProductProps) {
    this.id = props.id;
    this.name = props.name;
    this.price = props.price;
  }

  static create(props: ProductProps): Product {
    if (!props.name || props.name.trim() === '') {
      throw new Error('Product name cannot be empty');
    }
    return new Product(props);
  }

  applyDiscount(percentage: number): Product {
    return Product.create({
      id: this.id,
      name: this.name,
      price: this.price.applyDiscount(percentage),
    });
  }
}
