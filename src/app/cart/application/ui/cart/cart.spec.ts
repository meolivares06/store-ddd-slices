import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartPage } from './cart';
import { CartService } from '../../cart.service';
import { signal, computed } from '@angular/core';
import { Price } from '../../../../shared/domain/price.value-object';
import { CartItem } from '../../../domain/cart.model';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

function createMockItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    productId: '1',
    quantity: 2,
    unitPrice: Price.create(1000, 'USD'), // $10.00
    ...overrides,
  };
}

describe('CartPage', () => {
  let component: CartPage;
  let fixture: ComponentFixture<CartPage>;
  let mockCartSignal: ReturnType<typeof signal<{ items: CartItem[] } | null>>;
  let mockRemoveFromCart: ReturnType<typeof vi.fn>;
  let mockClearCart: ReturnType<typeof vi.fn>;
  let mockAddToCart: ReturnType<typeof vi.fn>;

  function setCartItems(items: CartItem[]) {
    mockCartSignal.set(items.length > 0 ? { items } : null);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    mockCartSignal = signal<{ items: CartItem[] } | null>(null);
    mockRemoveFromCart = vi.fn();
    mockClearCart = vi.fn();
    mockAddToCart = vi.fn();

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
      addToCart: mockAddToCart,
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
    const item1 = createMockItem({ productId: '1', quantity: 2, unitPrice: Price.create(1000, 'USD') });
    const item2 = createMockItem({ productId: '2', quantity: 1, unitPrice: Price.create(2500, 'USD') });

    beforeEach(() => {
      setCartItems([item1, item2]);
    });

    it('should call removeFromCart when remove event is emitted from CartItemComponent', () => {
      const cartItemDebug = fixture.debugElement.query(By.css('app-cart-item'));
      expect(cartItemDebug).toBeTruthy();
      
      cartItemDebug.triggerEventHandler('remove', '1');
      expect(mockRemoveFromCart).toHaveBeenCalledWith('1');
    });

    it('should call addToCart with relative quantity difference when quantityChange event is emitted', () => {
      const cartItemDebug = fixture.debugElement.query(By.css('app-cart-item'));
      
      // Emit a quantity change from 2 to 4 (diff of +2)
      cartItemDebug.triggerEventHandler('quantityChange', { productId: '1', quantity: 4 });
      
      expect(mockAddToCart).toHaveBeenCalledWith('1', item1.unitPrice, 2);
    });

    it('should call addToCart with negative difference when quantity decreases', () => {
      const cartItemDebug = fixture.debugElement.query(By.css('app-cart-item'));
      
      // Emit a quantity change from 2 to 1 (diff of -1)
      cartItemDebug.triggerEventHandler('quantityChange', { productId: '1', quantity: 1 });
      
      expect(mockAddToCart).toHaveBeenCalledWith('1', item1.unitPrice, -1);
    });

    it('should call clearCart when clear button is clicked', () => {
      const clearBtn = fixture.debugElement.query(By.css('.clear-cart-btn'));
      expect(clearBtn).toBeTruthy();

      clearBtn.nativeElement.click();
      expect(mockClearCart).toHaveBeenCalledOnce();
    });
  });
});
