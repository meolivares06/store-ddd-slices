import { Component, input, output } from '@angular/core';
import { QuantityStepperComponent } from '../../../../../../../shared/ui/quantity-stepper/quantity-stepper.component';
import type { CartItemViewModel } from '../../cart';

@Component({
  selector: 'app-cart-item',
  imports: [QuantityStepperComponent],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.css',
  host: {
    class: 'cart-item',
  },
})
export class CartItemComponent {
  item = input.required<CartItemViewModel>();
  remove = output<string>();
  quantityChange = output<{ productId: string; quantity: number }>();

  onRemove(): void {
    this.remove.emit(this.item().productId);
  }

  onQuantityChange(newQuantity: number): void {
    this.quantityChange.emit({
      productId: this.item().productId,
      quantity: newQuantity,
    });
  }
}
