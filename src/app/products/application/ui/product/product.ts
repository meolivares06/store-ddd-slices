import { Component, input, output } from '@angular/core';
import { Product } from '../../../domain/product.model';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { BadgeComponent } from '../../../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-product',
  imports: [ButtonComponent, BadgeComponent],
  template: `
    <div class="product-card">
      <div class="card__image">
        <img [src]="product().thumbnail" alt="{{ product().name }}" />
      </div>
      <div class="card__header">
        <h4 class="card__title">{{ product().name }}</h4>
        <div class="card__price-row">
          <app-badge [text]="'Price'" />
          <p class="card__price">{{ product().price.format() }}</p>
        </div>
      </div>
      <app-button 
        [label]="'Agregar al carrito'" 
        [variant]="'primary'" 
        (clicked)="addToCart.emit(product())" 
      />
    </div>
  `,
  styleUrl: './product.css',
  host: {
    class: 'product-host',
  },
})
export class ProductComponent {
  product = input.required<Product>();
  addToCart = output<Product>();
}
