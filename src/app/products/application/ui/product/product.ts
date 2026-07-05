import { Component, input } from '@angular/core';
import { Product } from '../../../domain/product.model';

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class ProductComponent {
  product = input.required<Product>(); 
}
