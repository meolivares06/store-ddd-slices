import { Component, input, output } from '@angular/core';
import { Price } from '../../../../../../shared/domain/price.value-object';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.html',
  styleUrl: './cart-summary.css',
  host: {
    class: 'cart-summary-panel',
  },
})
export class CartSummaryComponent {
  total = input.required<Price>();
}
