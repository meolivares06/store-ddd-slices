import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartItemComponent } from './cart-item.component';
import { Price } from '../../../../../../shared/domain/price.value-object';
import { By } from '@angular/platform-browser';

describe('CartItemComponent', () => {
  let component: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;

  const mockItem = {
    productId: 'prod-123',
    quantity: 2,
    unitPrice: Price.create(1000, 'USD')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', mockItem);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit remove event when remove button is clicked', () => {
    let emittedId: string | undefined;
    component.remove.subscribe((id) => (emittedId = id));

    const removeBtn = fixture.debugElement.query(By.css('[data-testid="remove-btn"]')).nativeElement;
    removeBtn.click();

    expect(emittedId).toBe('prod-123');
  });

  it('should emit quantityChange event when stepper changes quantity', () => {
    let emittedEvent: { productId: string; quantity: number } | undefined;
    component.quantityChange.subscribe((event) => (emittedEvent = event));

    const stepper = fixture.debugElement.query(By.css('app-quantity-stepper')).componentInstance;
    stepper.quantityChange.emit(3);

    expect(emittedEvent).toEqual({ productId: 'prod-123', quantity: 3 });
  });
});
