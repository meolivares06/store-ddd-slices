import { Component, inject, OnInit } from '@angular/core';
import { ProductStore } from '../../product-store';
import { ProductComponent } from '../product/product';
import { CartService } from '../../../../cart/application/cart.service';
import { Product } from '../../../domain/product.model';

@Component({
  selector: 'app-product-list',
  imports: [ProductComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
  host: {
    class: 'product-list border',
  }
})
export class ProductList implements OnInit {
  protected productService = inject(ProductStore);
  readonly #cartService = inject(CartService);

  ngOnInit(): void {
    this.productService.loadProducts();
  }

  applyDiscount(): void {
    this.productService.applyDiscountToAll(10);
  }

  handleAddToCart(product: Product): void {
    this.#cartService.addToCart(product.id, product.price, 1);
  }
}
