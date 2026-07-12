import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { ProductList } from './product-list';
import { ProductStore } from '../../product-store';
import { CartService } from '../../../../cart/application/cart.service';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../../domain/product.model';
import { Price } from '../../../../shared/domain/price.value-object';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let mockCartService: Partial<CartService>;
  let queryParamMap$: BehaviorSubject<ParamMap>;
  let mockRouter: Pick<Router, 'navigate'>;
  let mockProductStore: {
    products: WritableSignal<Product[]>;
    loadProducts: (criteria?: { field: 'RELEVANCE' | 'PRICE'; direction: 'asc' | 'desc' }) => void;
    applyDiscountToAll: (percentage: number) => void;
  };

  beforeEach(async () => {
    mockCartService = {
      addToCart: vi.fn(),
    };

    queryParamMap$ = new BehaviorSubject(convertToParamMap({}));
    mockRouter = {
      navigate: vi.fn(),
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
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: queryParamMap$.asObservable(),
          },
        },
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
    const sortMeta = host.querySelector('.list-meta__sort-label');

    expect(catalogueMeta?.textContent?.trim()).toBe('CATALOGUE [2 ITEMS]');
    expect(sortMeta?.textContent?.trim()).toBe('SORT BY:');
  });

  it('should not render discount button in the list header', () => {
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const discountButton = host.querySelector('app-button');

    expect(discountButton).toBeNull();
  });

  it('loads default RELEVANCE desc on init when query params are missing', () => {
    expect(mockProductStore.loadProducts).toHaveBeenCalledWith({
      field: 'RELEVANCE',
      direction: 'desc',
    });
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('loads default RELEVANCE desc on init when query params are invalid without rewriting URL', () => {
    queryParamMap$.next(convertToParamMap({ sortBy: 'x', order: 'y' }));

    expect(mockProductStore.loadProducts).toHaveBeenLastCalledWith({
      field: 'RELEVANCE',
      direction: 'desc',
    });
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('reflects valid URL params in selected sort and load criteria', async () => {
    queryParamMap$.next(convertToParamMap({ sortBy: 'price', order: 'asc' }));
    await fixture.whenStable();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const select = host.querySelector('#product-sort') as HTMLSelectElement | null;

    expect(mockProductStore.loadProducts).toHaveBeenLastCalledWith({
      field: 'PRICE',
      direction: 'asc',
    });
    expect(select?.value).toBe('price:asc');
  });

  it('renders exactly the 4 supported sort options', () => {
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const optionLabels = Array.from(host.querySelectorAll('#product-sort option')).map(option =>
      option.textContent?.trim(),
    );

    expect(optionLabels).toEqual([
      'RELEVANCE ↓',
      'RELEVANCE ↑',
      'PRICE ↑',
      'PRICE ↓',
    ]);
  });

  it('pushes history on sort changes using public sortBy/order query keys', () => {
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const select = host.querySelector('#product-sort') as HTMLSelectElement | null;

    expect(select).not.toBeNull();

    if (!select) {
      return;
    }

    select.value = 'price:desc';
    select.dispatchEvent(new Event('change'));

    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        sortBy: 'price',
        order: 'desc',
      },
      replaceUrl: false,
    });
  });

  it('recomputes effective sort from restored URL params (Back behavior)', () => {
    queryParamMap$.next(convertToParamMap({ sortBy: 'price', order: 'desc' }));
    queryParamMap$.next(convertToParamMap({ sortBy: 'relevance', order: 'desc' }));
    fixture.detectChanges();

    expect(mockProductStore.loadProducts).toHaveBeenNthCalledWith(2, {
      field: 'PRICE',
      direction: 'desc',
    });
    expect(mockProductStore.loadProducts).toHaveBeenNthCalledWith(3, {
      field: 'RELEVANCE',
      direction: 'desc',
    });
  });

  it('preserves backend order when active sort has equal values (tie-order behavior)', async () => {
    queryParamMap$.next(convertToParamMap({ sortBy: 'price', order: 'asc' }));

    const first = Product.create({ id: '3', name: 'Gamma', price: Price.create(100, 'USD'), thumbnail: 'thumb.jpg', images: ['img.jpg'] });
    const second = Product.create({ id: '1', name: 'Alpha', price: Price.create(100, 'USD'), thumbnail: 'thumb.jpg', images: ['img.jpg'] });
    const third = Product.create({ id: '2', name: 'Beta', price: Price.create(100, 'USD'), thumbnail: 'thumb.jpg', images: ['img.jpg'] });
    mockProductStore.products.set([first, second, third]);

    await fixture.whenStable();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const renderedNames = Array.from(host.querySelectorAll('.card__title')).map(title => title.textContent?.trim());

    expect(mockProductStore.loadProducts).toHaveBeenLastCalledWith({ field: 'PRICE', direction: 'asc' });
    expect(renderedNames).toEqual(['Gamma', 'Alpha', 'Beta']);
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
