import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../cart/application/cart.service';

@Component({
  selector: 'app-layout',
  imports: [RouterLink],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  readonly #cartService = inject(CartService);
  readonly itemCount = this.#cartService.itemCount;
}
