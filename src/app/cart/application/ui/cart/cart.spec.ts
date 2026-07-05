import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartPage } from './cart';
import { CartService } from '../../cart.service';
import { signal, computed } from '@angular/core';
import { Price } from '../../../../products/domain/price.value-object';
import { CartItem } from '../../../domain/cart.model';
import { provideRouter } from '@angular/router';

function createMockItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    productId: '1',
    quantity: 2,
    unitPrice: Price.create(10, 'USD'),
    ...overrides,
  };
}

describe('CartPage', () => {
  let component: CartPage;
  let fixture: ComponentFixture<CartPage>;
  let mockCartSignal: ReturnType<typeof signal<{ items: CartItem[] } | null>>;
  let mockRemoveFromCart: ReturnType<typeof vi.fn>;
  let mockClearCart: ReturnType<typeof vi.fn>;

  function setCartItems(items: CartItem[]) {
    mockCartSignal.set(items.length > 0 ? { items } : null);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    mockCartSignal = signal<{ items: CartItem[] } | null>(null);
    mockRemoveFromCart = vi.fn();
    mockClearCart = vi.fn();

    const mockCartService = {
      cart: mockCartSignal.asReadonly(),
      itemCount: computed(() => mockCartSignal()?.items.length ?? 0),
      total: computed(() => {
        const items = mockCartSignal()?.items ?? [];
        return items.reduce(
          (acc, item) => acc.add(Price.create(item.unitPrice.amount * item.quantity, item.unitPrice.currency)),
          Price.create(0, 'USD'),
        );
      }),
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
      addToCart: vi.fn(),
    } as Partial<CartService> as CartService;

    await TestBed.configureTestingModule({
      imports: [CartPage],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: mockCartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('empty state', () => {
    it('should display empty state message when cart has no items', () => {
      setCartItems([]);
      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).toContain('Your cart is empty');
    });

    it('should show empty state when cart is null', () => {
      mockCartSignal.set(null);
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).toContain('Your cart is empty');
    });
  });

  describe('with items', () => {
    const item1 = createMockItem({ productId: '1', quantity: 2, unitPrice: Price.create(10, 'USD') });
    const item2 = createMockItem({ productId: '2', quantity: 1, unitPrice: Price.create(25, 'USD') });

    beforeEach(() => {
      setCartItems([item1, item2]);
    });

    it('should display each item productId, unitPrice, and quantity', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).toContain('1');
      expect(el.textContent).toContain('10 USD');
      expect(el.textContent).toContain('2');
      expect(el.textContent).toContain('2');
      expect(el.textContent).toContain('25 USD');
      expect(el.textContent).toContain('1');
    });

    it('should display the total formatted price', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).toContain('45 USD');
    });

    it('should call removeFromCart when remove button is clicked', () => {
      const el: HTMLElement = fixture.nativeElement;
      const removeButtons = el.querySelectorAll<HTMLButtonElement>('[data-testid="remove-btn"]');
      expect(removeButtons.length).toBe(2);

      removeButtons[0].click();
      expect(mockRemoveFromCart).toHaveBeenCalledWith('1');
    });

    it('should call clearCart when clear button is clicked', () => {
      const el: HTMLElement = fixture.nativeElement;
      const clearButton = Array.from(el.querySelectorAll<HTMLButtonElement>('button'))
        .find(b => b.textContent?.trim().toLowerCase().includes('clear'));
      expect(clearButton).toBeDefined();
      clearButton!.click();
      expect(mockClearCart).toHaveBeenCalledOnce();
    });
  });

  describe('navigation', () => {
    it('should have a "Continue Shopping" link to /products', () => {
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      const link = el.querySelector('a[routerLink="/products"], a[href="/products"]');
      expect(link).toBeTruthy();
      expect(link?.textContent?.trim().toLowerCase()).toContain('continue shopping');
    });
  });
});
