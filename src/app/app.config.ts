import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { ProductHttp } from './products/infrastructure/product-http';
import { PRODUCT_REPOSITORY_TOKEN } from './products/application/product-repository.interface';
import { CART_REPOSITORY_TOKEN } from './cart/application/cart-repository.interface';
import { CartLocalStorageService } from './cart/infrastructure/cart-local-storage.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    provideClientHydration(),
    { provide: PRODUCT_REPOSITORY_TOKEN, useExisting: ProductHttp },
    { provide: CART_REPOSITORY_TOKEN, useExisting: CartLocalStorageService },
  ],
};
