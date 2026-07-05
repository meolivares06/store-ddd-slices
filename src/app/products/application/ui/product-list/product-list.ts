import { Component, inject, OnInit } from '@angular/core';
import { ProductStore } from '../../product-store';
import { ProductComponent } from '../product/product';

@Component({
  selector: 'app-product-list',
  imports: [ProductComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  protected productService = inject(ProductStore);

  ngOnInit(): void {
    this.productService.loadProducts();
  }

  applyDiscount(): void {
    this.productService.applyDiscountToAll(10);
  }
}
