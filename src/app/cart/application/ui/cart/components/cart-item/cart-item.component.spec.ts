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
    unitPrice: Price.create(1000, 'USD'),
    title: 'Snapshot title',
    imageUrl: 'https://cdn.example.com/prod-123.jpg',
    hasProductChanged: false,
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

  it('should render snapshot title when available', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Snapshot title');
  });

  it('should show updated price badge when hasProductChanged is true', () => {
    fixture.componentRef.setInput('item', {
      ...mockItem,
      hasProductChanged: true,
    });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('PRICE UPDATED SINCE ADDED');
  });
});
