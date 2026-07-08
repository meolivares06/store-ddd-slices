import { Component, input, output } from '@angular/core';
import { CartItem } from '../../../../../domain/cart.model';
import { QuantityStepperComponent } from '../../../../../../../shared/ui/quantity-stepper/quantity-stepper.component';

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
  item = input.required<CartItem>();
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
