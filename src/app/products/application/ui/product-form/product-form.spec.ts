import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductForm } from './product-form';
import { By } from '@angular/platform-browser';

describe('ProductForm', () => {
  let component: ProductForm;
  let fixture: ComponentFixture<ProductForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render form fields', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('label[for="name"]')?.textContent).toContain('Name');
    expect(compiled.querySelector('label[for="price"]')?.textContent).toContain('Price');
  });

  it('should emit saved product on valid submit', () => {
    const saveSpy = vi.fn();
    component.save.subscribe(saveSpy);

    const nameInput = fixture.debugElement.query(By.css('#name')).nativeElement as HTMLInputElement;
    const priceInput = fixture.debugElement.query(By.css('#price')).nativeElement as HTMLInputElement;
    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement as HTMLButtonElement;

    nameInput.value = 'New Product';
    nameInput.dispatchEvent(new Event('input'));

    priceInput.value = '150';
    priceInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(submitBtn.disabled).toBeFalsy();
    submitBtn.click();

    expect(saveSpy).toHaveBeenCalledWith({ name: 'New Product', price: 150 });
  });

  it('should not allow submission when invalid (empty fields)', () => {
    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement as HTMLButtonElement;
    expect(submitBtn.disabled).toBeTruthy();
  });

  it('should not allow submission when name is less than 3 characters', () => {
    const nameInput = fixture.debugElement.query(By.css('#name')).nativeElement as HTMLInputElement;
    const priceInput = fixture.debugElement.query(By.css('#price')).nativeElement as HTMLInputElement;
    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement as HTMLButtonElement;

    nameInput.value = 'Ab';
    nameInput.dispatchEvent(new Event('input'));

    priceInput.value = '150';
    priceInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(submitBtn.disabled).toBeTruthy();
  });
});
