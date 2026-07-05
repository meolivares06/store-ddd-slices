import { Routes } from '@angular/router';
import { ProductList } from './products/application/ui/product-list/product-list';
import { CartPage } from './cart/application/ui/cart/cart';

export const routes: Routes = [
    // product list route
    {
        path: 'products',
        component: ProductList
    },
    {
        path: 'cart',
        component: CartPage
    }
];
