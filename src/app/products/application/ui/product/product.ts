import { Component, input, output } from '@angular/core';
import { Product } from '../../../domain/product.model';

@Component({
  selector: 'app-product',
  imports: [],
  template: `
    <div class="product-card">
      <h3>{{ product().name }}</h3>
      <p>Price: {{ product().price.formatted }}</p>
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
