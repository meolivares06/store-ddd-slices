import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductList } from './product-list';
import { ProductHttp } from '../../../infrastructure/product-http';
import { PRODUCT_REPOSITORY_TOKEN } from '../../../application/product-repository.interface';
import { CartService } from '../../../../cart/application/cart.service';
import { Product } from '../../../domain/product.model';
import { Price } from '../../../../shared/domain/price.value-object';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let mockCartService: Partial<CartService>;

  beforeEach(async () => {
    mockCartService = {
      addToCart: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideHttpClient(),
        { provide: PRODUCT_REPOSITORY_TOKEN, useExisting: ProductHttp },
        { provide: CartService, useValue: mockCartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleAddToCart', () => {
    it('should call cartService.addToCart with product id, price, and quantity 1', () => {
      const product = Product.create({ id: '1', name: 'Test', price: Price.create(10, 'USD'), thumbnail: 'thumb.jpg', images: ['img.jpg'] });
      (component as unknown as { handleAddToCart(product: Product): void }).handleAddToCart(product);

      expect(mockCartService.addToCart).toHaveBeenCalledOnce();
      expect(mockCartService.addToCart).toHaveBeenCalledWith('1', Price.create(10, 'USD'), 1);
    });

    it('should call cartService.addToCart for different products', () => {
      const product = Product.create({ id: '2', name: 'Another', price: Price.create(25, 'USD'), thumbnail: 'thumb.jpg', images: ['img.jpg'] });
      (component as unknown as { handleAddToCart(product: Product): void }).handleAddToCart(product);

      expect(mockCartService.addToCart).toHaveBeenCalledWith('2', Price.create(25, 'USD'), 1);
    });
  });
});
