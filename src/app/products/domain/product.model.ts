import { Price } from '../../shared/domain/price.value-object';

export interface ProductProps {
  id: string;
  name: string;
  price: Price;
  thumbnail: string;
  images: string[];
}

export class Product {
  readonly id: string;
  readonly name: string;
  readonly price: Price;
  readonly thumbnail: string;
  readonly images: string[];

  private constructor(props: ProductProps) {
    this.id = props.id;
    this.name = props.name;
    this.price = props.price;
    this.thumbnail = props.thumbnail;
    this.images = props.images;
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
      thumbnail: this.thumbnail,
      images: this.images,
    });
  }

  updatePrice(newPrice: Price): Product {
    return Product.create({
      ...this,
      price: newPrice,
    });
  }
}
