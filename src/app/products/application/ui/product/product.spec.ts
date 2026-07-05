import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product';
import { Product } from '../../../domain/product.model';
import { Price } from '../../../domain/price.value-object';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', Product.create({
      id: '1',
      name: 'Test Product',
      price: Price.create(10, 'USD'),
    }));
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
