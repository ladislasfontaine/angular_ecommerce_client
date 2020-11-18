import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { DOMHelper } from 'src/testing/dom-helper';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let helper: Helper;
  let dh: DOMHelper<HomeComponent>;
  let productServiceMock: any;

  beforeEach(async () => {
    productServiceMock = jasmine.createSpyObj('ProductService', ['getAllProducts']);
    productServiceMock.getAllProducts.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        ProductCardComponent
      ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        RouterTestingModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    helper = new Helper();
    dh = new DOMHelper(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain an h2 tag', () => {
    expect(dh.singleText('h2')).toBe('NEW COLLECTION');
  });

  it('should contain at least one button', () => {
    expect(dh.count('button')).toBeGreaterThanOrEqual(1);
  });

  it('should be a "Shop now" button first on the page', () => {
    expect(dh.singleText('button')).toBe('Shop now');
  });

  it('should be a "View cart" button second on the page', () => {
    const cartButtonDes = fixture.debugElement.queryAll(By.css('button'));
    const cartButton: HTMLButtonElement = cartButtonDes[1].nativeElement;
    expect(cartButton.textContent).toBe('View cart');
  });

  it('should navigate to "/" before any button click', () => {
    const location = TestBed.inject(Location);
    expect(location.path()).toBe('');
  });

  it('should navigate to "/cart" on "View cart" button click', async () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    const cartButtonDes = fixture.debugElement.queryAll(By.css('button'));
    const cartButton: HTMLButtonElement = cartButtonDes[1].nativeElement;
    cartButton.click();
    expect(router.navigateByUrl)
      .toHaveBeenCalledWith(
        router.createUrlTree(['/cart']),
        { skipLocationChange: false, replaceUrl: false, state: undefined }
      );
  });

  it('should show no app-product-card when no products are available', () => {
    expect(dh.count('app-product-card')).toBe(0);
  });

  it('should show one app-product-card when I have one product', () => {
    component.products = helper.getProducts(1);
    fixture.detectChanges();
    expect(dh.count('app-product-card')).toBe(1);
  });

  it('should show 10 products if there are 10 products', () => {
    component.products = helper.getProducts(10);
    fixture.detectChanges();
    expect(dh.count('app-product-card')).toBe(10);
  });

  it('should show 10 price paragraphs, 1 per product', () => {
    component.products = helper.getProducts(10);
    fixture.detectChanges();
    expect(dh.count('.price')).toBe(10);
  });

  it('should show 1 Add to cart button, 1 per product', () => {
    component.products = helper.getProducts(1);
    fixture.detectChanges();
    expect(dh.countText('button', 'Add to cart')).toBe(1);
  });

  it('should show 20 Add to cart button, 1 per product', () => {
    component.products = helper.getProducts(20);
    fixture.detectChanges();
    expect(dh.countText('button', 'Add to cart')).toBe(20);
  });
});

class Helper {
  products = [];

  getProducts(amount: number): any[] {
    for (let i = 0; i < amount; i++) {
      this.products.push(
        {
          id: i + 1,
          category: 'trail',
          name: 'Running1',
          price: 99,
          quantity: 3,
          image: '/assets/img/products/p1.jpg',
          images: '',
          description: 'test'
        }
      );
    }
    return this.products;
  }
}
