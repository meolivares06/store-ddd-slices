import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductStore } from '../../product-store';
import { ProductComponent } from '../product/product';
import { CartService } from '../../../../cart/application/cart.service';
import { Product } from '../../../domain/product.model';
import {
  normalizeProductSortQuery,
  productSortCriteriaFromOptionId,
  PRODUCT_SORT_OPTIONS,
  productSortOptionIdFromCriteria,
  serializeProductSortQuery,
} from './product-sort-query';

@Component({
  selector: 'app-product-list',
  imports: [ProductComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
  host: {
    class: 'product-list-host',
  }
})
export class ProductList implements OnInit {
  protected productService = inject(ProductStore);
  readonly #cartService = inject(CartService);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);

  protected readonly sortOptions = PRODUCT_SORT_OPTIONS;
  protected readonly selectedSortOptionId = signal(
    productSortOptionIdFromCriteria(normalizeProductSortQuery({})),
  );

  ngOnInit(): void {
    this.#route.queryParamMap.subscribe(params => {
      const criteria = normalizeProductSortQuery({
        sortBy: params.get('sortBy'),
        order: params.get('order'),
      });

      this.selectedSortOptionId.set(productSortOptionIdFromCriteria(criteria));
      this.productService.loadProducts(criteria);
    });
  }

  applyDiscount(): void {
    this.productService.applyDiscountToAll(10);
  }

  handleAddToCart(product: Product): void {
    this.#cartService.addToCart(product.id, product.price, 1, {
      title: product.name,
      imageUrl: product.thumbnail,
      priceLabel: product.price.formatted,
    });
  }

  protected onSortChange(optionId: string): void {
    const criteria = productSortCriteriaFromOptionId(optionId);

    if (!criteria) {
      return;
    }

    this.selectedSortOptionId.set(productSortOptionIdFromCriteria(criteria));

    this.#router.navigate([], {
      queryParams: serializeProductSortQuery(criteria),
      replaceUrl: false,
    });
  }
}
