import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-quantity-stepper',
  templateUrl: './quantity-stepper.html',
  styleUrl: './quantity-stepper.css',
  host: {
    class: 'quantity-stepper',
  },
})
export class QuantityStepperComponent {
  quantity = input.required<number>();
  quantityChange = output<number>();

  decrement(): void {
    if (this.quantity() > 1) {
      this.quantityChange.emit(this.quantity() - 1);
    }
  }

  increment(): void {
    this.quantityChange.emit(this.quantity() + 1);
  }
}
