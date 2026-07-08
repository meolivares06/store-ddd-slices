import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartSummaryComponent } from './cart-summary.component';
import { Price } from '../../../../../../shared/domain/price.value-object';
import { By } from '@angular/platform-browser';

describe('CartSummaryComponent', () => {
  let component: CartSummaryComponent;
  let fixture: ComponentFixture<CartSummaryComponent>;

  const mockPrice = Price.create(5000, 'USD');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSummaryComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CartSummaryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('total', mockPrice);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the formatted total price', () => {
    const totalEl = fixture.debugElement.query(By.css('[data-testid="total-price"]')).nativeElement;
    expect(totalEl.textContent.trim()).toBe('5000 USD');
  });
});
