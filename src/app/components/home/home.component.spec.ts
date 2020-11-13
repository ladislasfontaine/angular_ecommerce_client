import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';
import { of, Observable } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { Location } from '@angular/common';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let helper: Helper;
  let dh: DOMHelper;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        DummyComponent,
        ProductCardComponent
      ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        RouterTestingModule.withRoutes(
          [
            { path: 'cart', component: DummyComponent }
          ]
        )
      ],
      providers: [
        { provide: ProductService, useClass: ProductServiceStub }
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
    const location = TestBed.inject(Location);
    const cartButtonDes = fixture.debugElement.queryAll(By.css('button'));
    const cartButton: HTMLButtonElement = cartButtonDes[1].nativeElement;
    cartButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(location.path()).toBe('/cart');
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

@Component({ template: '' })
class DummyComponent {}

class ProductServiceStub {
  getAllProducts(numberOfResults = 10): Observable<any[]> {
    return of([]);
  }
}

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

class DOMHelper {
  fixture: ComponentFixture<HomeComponent>;

  constructor(fixture: ComponentFixture<HomeComponent>) {
    this.fixture = fixture;
  }

  singleText(tagName: string): string {
    const elem = this.fixture.debugElement.query(By.css(tagName));
    if (elem) {
      return elem.nativeElement.textContent;
    }
  }

  count(tagName: string): number {
    const elements = this.fixture.debugElement.queryAll(By.css(tagName));
    return elements.length;
  }

  countText(tagName: string, text: string): number {
    const elements = this.fixture.debugElement.queryAll(By.css(tagName));
    return elements.filter(element => element.nativeElement.textContent.trim() === text).length;
  }
}
