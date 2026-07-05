import { Routes } from '@angular/router';
import { ProductList } from './products/application/ui/product-list/product-list';

export const routes: Routes = [
    // product list route
    {
        path: 'products',
        component: ProductList
    }
];
