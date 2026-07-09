import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { ProductList } from './product-list';
import { ProductStore } from '../../product-store';
import { CartService } from '../../../../cart/application/cart.service';
import { Product } from '../../../domain/product.model';
import { Price } from '../../../../shared/domain/price.value-object';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let mockCartService: Partial<CartService>;
  let mockProductStore: {
    products: WritableSignal<Product[]>;
    loadProducts: () => void;
    applyDiscountToAll: (percentage: number) => void;
  };

  beforeEach(async () => {
    mockCartService = {
      addToCart: vi.fn(),
    };

    mockProductStore = {
      products: signal<Product[]>([]),
      loadProducts: vi.fn(),
      applyDiscountToAll: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: ProductStore, useValue: mockProductStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render catalogue metadata with products count and sort label', () => {
    const firstProduct = Product.create({ id: '1', name: 'Test', price: Price.create(10, 'USD'), thumbnail: 'thumb.jpg', images: ['img.jpg'] });
    const secondProduct = Product.create({ id: '2', name: 'Another', price: Price.create(20, 'USD'), thumbnail: 'thumb.jpg', images: ['img.jpg'] });
    mockProductStore.products.set([firstProduct, secondProduct]);

    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const catalogueMeta = host.querySelector('.list-meta__catalogue');
    const sortMeta = host.querySelector('.list-meta__sort');

    expect(catalogueMeta?.textContent?.trim()).toBe('CATALOGUE [2 ITEMS]');
    expect(sortMeta?.textContent?.trim()).toBe('SORT BY: RELEVANCE →');
  });

  it('should not render discount button in the list header', () => {
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const discountButton = host.querySelector('app-button');

    expect(discountButton).toBeNull();
  });

  describe('handleAddToCart', () => {
    it('should call cartService.addToCart with product id, price, and quantity 1', () => {
      const product = Product.create({ id: '1', name: 'Test', price: Price.create(10, 'USD'), thumbnail: 'thumb.jpg', images: ['img.jpg'] });
      (component as unknown as { handleAddToCart(product: Product): void }).handleAddToCart(product);

      expect(mockCartService.addToCart).toHaveBeenCalledOnce();
      expect(mockCartService.addToCart).toHaveBeenCalledWith('1', Price.create(10, 'USD'), 1, {
        title: 'Test',
        imageUrl: 'thumb.jpg',
        priceLabel: '10 USD',
      });
    });

    it('should call cartService.addToCart for different products', () => {
      const product = Product.create({ id: '2', name: 'Another', price: Price.create(25, 'USD'), thumbnail: 'thumb.jpg', images: ['img.jpg'] });
      (component as unknown as { handleAddToCart(product: Product): void }).handleAddToCart(product);

      expect(mockCartService.addToCart).toHaveBeenCalledWith('2', Price.create(25, 'USD'), 1, {
        title: 'Another',
        imageUrl: 'thumb.jpg',
        priceLabel: '25 USD',
      });
    });
  });
});
