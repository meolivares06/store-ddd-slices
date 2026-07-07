import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Layout } from './layout';
import { CartService } from '../../cart/application/cart.service';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;
  let mockItemCount: ReturnType<typeof signal<number>>;

  beforeEach(async () => {
    mockItemCount = signal(0);

    const mockCartService = {
      itemCount: mockItemCount.asReadonly(),
    } as Partial<CartService> as CartService;

    await TestBed.configureTestingModule({
      imports: [Layout],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: mockCartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose itemCount from CartService', () => {
    expect(component.itemCount).toBeDefined();
    expect(component.itemCount()).toBe(0);
  });

  describe('navigation links', () => {
    it('should contain a link to /products', () => {
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      const link = el.querySelector('a[routerLink="/products"], a[href="/products"]');
      expect(link).toBeTruthy();
    });

    it('should contain a link to /cart', () => {
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      const link = el.querySelector('[routerLink="/cart"], [href="/cart"]');
      expect(link).toBeTruthy();
    });
  });

  describe('cart badge', () => {
    it('should show the item count when cart has items', () => {
      mockItemCount.set(3);
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).toContain('3');
    });

    it('should hide the badge when itemCount is 0', () => {
      mockItemCount.set(0);
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      // The badge container should not be present when count is 0
      const badgeContainer = el.querySelector('[data-testid="cart-badge"]');
      expect(badgeContainer).toBeNull();
    });
  });
});
