import { Component, inject, OnInit } from '@angular/core';
import { ProductStore } from '../../product-store';
import { ProductComponent } from '../product/product';
import { CartService } from '../../../../cart/application/cart.service';
import { Product } from '../../../domain/product.model';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-product-list',
  imports: [ProductComponent, ButtonComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
  host: {
    class: 'product-list-host',
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
    console.log('Adding product to cart:', product);
    this.#cartService.addToCart(product.id, product.price, 1, {
      title: product.name,
      imageUrl: product.thumbnail,
      priceLabel: product.price.formatted,
    });
  }
}
