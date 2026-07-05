import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductList } from './product-list';
import { ProductHttp } from '../../../infrastructure/product-http';
import { PRODUCT_REPOSITORY_TOKEN } from '../../../application/product-repository.interface';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideHttpClient(),
        { provide: PRODUCT_REPOSITORY_TOKEN, useExisting: ProductHttp },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
