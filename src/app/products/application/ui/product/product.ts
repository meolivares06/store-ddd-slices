import { Component, input, output } from '@angular/core';
import { Product } from '../../../domain/product.model';

@Component({
  selector: 'app-product',
  imports: [],
  template: `
    <div class="card">
      <div class="card__image">
        <img [src]="product().thumbnail" alt="{{ product().name }}" />
      </div>
      <div class="card__header">
        <h4 class="card__title">{{ product().name }}</h4>
        <p class="card__price">Price: {{ product().price.format() }}</p>
      </div>
      <button (click)="addToCart.emit(product())">Agregar al carrito</button>
    </div>
  `,
  styleUrl: './product.css',
  host: {
    class: 'product-card border',
  },
})
export class ProductComponent {
  product = input.required<Product>();
  addToCart = output<Product>();
}
