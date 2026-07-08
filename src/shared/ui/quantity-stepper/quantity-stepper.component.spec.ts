import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuantityStepperComponent } from './quantity-stepper.component';

describe('QuantityStepperComponent', () => {
  let component: QuantityStepperComponent;
  let fixture: ComponentFixture<QuantityStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityStepperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QuantityStepperComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('quantity', 2);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the current quantity', () => {
    const valueEl = fixture.nativeElement.querySelector('[data-testid="qty-value"]');
    expect(valueEl.textContent.trim()).toBe('2');
  });

  it('should emit quantity - 1 on decrement when quantity > 1', () => {
    let emittedValue: number | undefined;
    component.quantityChange.subscribe((val) => (emittedValue = val));

    const decBtn = fixture.nativeElement.querySelector('[data-testid="dec-btn"]');
    decBtn.click();

    expect(emittedValue).toBe(1);
  });

  it('should not emit decrement when quantity is 1', () => {
    fixture.componentRef.setInput('quantity', 1);
    fixture.detectChanges();

    let emittedValue: number | undefined;
    component.quantityChange.subscribe((val) => (emittedValue = val));

    const decBtn = fixture.nativeElement.querySelector('[data-testid="dec-btn"]');
    expect(decBtn.disabled).toBe(true);
    decBtn.click();

    expect(emittedValue).toBeUndefined();
  });

  it('should emit quantity + 1 on increment', () => {
    let emittedValue: number | undefined;
    component.quantityChange.subscribe((val) => (emittedValue = val));

    const incBtn = fixture.nativeElement.querySelector('[data-testid="inc-btn"]');
    incBtn.click();

    expect(emittedValue).toBe(3);
  });
});
