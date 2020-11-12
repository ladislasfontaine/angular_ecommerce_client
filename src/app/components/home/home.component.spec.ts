import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        DummyComponent
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain an h2 tag', () => {
    const h2Element = fixture.debugElement.query(By.css('h2'));
    const h2HtmlElement: HTMLHeadElement = h2Element.nativeElement;
    expect(h2HtmlElement.textContent).toBe('NEW COLLECTION');
  });

  it('should contain at least one button', () => {
    const buttons = fixture.debugElement
      .queryAll(By.css('button'));
    expect(buttons.length >= 1).toBeTruthy();
  });

  it('should be a "Shop now" button first on the page', () => {
    const buttonDes = fixture.debugElement.queryAll(By.css('button'));
    const button: HTMLButtonElement = buttonDes[0].nativeElement;
    expect(button.textContent).toBe('Shop now');
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
    const productCardDes = fixture.debugElement.queryAll(By.css('app-product-card'));
    expect(productCardDes.length).toBe(0);
  });

  it('should show one app-product-card when I have one product', () => {
    component.products = [
      {
        id: 1,
        category: 'trail',
        name: 'Running1',
        price: 99,
        quantity: 3,
        image: '/assets/img/products/p1.jpg',
        images: '',
        description: 'test'
      }
    ];
    fixture.detectChanges();
    const productCardDes = fixture.debugElement.queryAll(By.css('app-product-card'));
    expect(productCardDes.length).toBe(1);
  });

  it('should show 10 products if there are 10 products', () => {
    component.products = [];
    for (let i = 0; i < 10; i++) {
      component.products.push(
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
    fixture.detectChanges();
    const products = fixture.debugElement.queryAll(By.css('app-product-card'));
    expect(products.length).toBe(10);
  });
});

@Component({ template: '' })
class DummyComponent {}

class ProductServiceStub {
  getAllProducts(numberOfResults = 10): Observable<any[]> {
    return of([]);
  }
}
