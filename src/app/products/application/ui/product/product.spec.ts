import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product';
import { Product } from '../../../domain/product.model';
import { Price } from '../../../../shared/domain/price.value-object';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  const defaultProduct = Product.create({
    id: '1',
    name: 'Test Product',
    price: Price.create(10, 'USD'),
  });

  function configureComponent(product: Product) {
    fixture.componentRef.setInput('product', product);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render product name and price', () => {
    configureComponent(defaultProduct);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Test Product');
    expect(el.textContent).toContain('US$');
    expect(el.textContent).toContain('10,00');
  });

  describe('addToCart output', () => {
    it('should emit the product when "Agregar al carrito" button is clicked', () => {
      configureComponent(defaultProduct);
      fixture.detectChanges();

      const emitted = vi.fn<(product: Product) => void>();
      component.addToCart.subscribe(emitted);

      const buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('button');
      const addButton = Array.from(buttons).find(b => b.textContent?.trim() === 'Agregar al carrito');
      expect(addButton).toBeDefined();
      addButton!.click();

      expect(emitted).toHaveBeenCalledWith(defaultProduct);
    });

    it('should emit the correct product when multiple products exist', () => {
      const anotherProduct = Product.create({
        id: '2',
        name: 'Another Product',
        price: Price.create(25, 'USD'),
      });
      configureComponent(anotherProduct);
      fixture.detectChanges();

      const emitted = vi.fn<(product: Product) => void>();
      component.addToCart.subscribe(emitted);

      const buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('button');
      const addButton = Array.from(buttons).find(b => b.textContent?.trim() === 'Agregar al carrito');
      addButton!.click();

      expect(emitted).toHaveBeenCalledWith(anotherProduct);
    });
  });
});
