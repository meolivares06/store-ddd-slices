import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { CART_REPOSITORY_TOKEN } from './cart/application/cart-repository.interface';
import { CART_ITEM_SNAPSHOT_REPOSITORY_TOKEN } from './cart/application/cart-item-snapshot-repository.interface';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: CART_REPOSITORY_TOKEN, useValue: { save: vi.fn(), load: vi.fn(() => null), clear: vi.fn() } },
        {
          provide: CART_ITEM_SNAPSHOT_REPOSITORY_TOKEN,
          useValue: { save: vi.fn(), loadAll: vi.fn(() => ({})), remove: vi.fn(), clear: vi.fn() },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the store title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('DDD ONLINE STORE');
  });
});

describe('Routes', () => {
  it('should include a /cart route pointing to CartPage', async () => {
    const cartRoute = routes.find(r => r.path === 'cart');
    expect(cartRoute).toBeDefined();

    const { CartPage } = await import('./cart/application/ui/cart/cart');
    expect(cartRoute!.component).toBe(CartPage);
  });

  it('should still include /products route pointing to ProductList', async () => {
    const productsRoute = routes.find(r => r.path === 'products');
    expect(productsRoute).toBeDefined();

    const { ProductList } = await import('./products/application/ui/product-list/product-list');
    expect(productsRoute!.component).toBe(ProductList);
  });
});
