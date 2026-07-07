import { Component, input, output } from '@angular/core';
import { Product } from '../../../domain/product.model';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-product',
  imports: [ButtonComponent],
  template: `
    <div class="product-card">
      <div class="card__image-container">
        <div class="card__image" [style.backgroundImage]="'url(' + product().thumbnail + ')'"></div>
        <div class="card__badge">IN_STOCK</div>
      </div>
      <div class="card__content">
        <div class="card__header">
          <h4 class="card__title">{{ product().name }}</h4>
          <span class="card__price"><span class="price-label">PRICE</span> {{ product().price.format() }}</span>
        </div>
        <p class="card__description">Precision engineered utility for the contemporary user.</p>
        <div class="card__action">
          <app-button 
            [label]="'Agregar al carrito'" 
            [variant]="'primary'" 
            (clicked)="addToCart.emit(product())" 
          />
        </div>
      </div>
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