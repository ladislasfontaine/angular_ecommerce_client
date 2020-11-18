import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { Component, ViewChild } from '@angular/core';
import { DOMHelper } from 'src/testing/dom-helper';

describe('ProductCardComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let dh: DOMHelper<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCardComponent, TestHostComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    dh = new DOMHelper(testHostFixture);
    testHostFixture.detectChanges();
  });

  it('should create', () => {
    testHostComponent.initChild();
    testHostFixture.detectChanges();
    expect(testHostComponent).toBeTruthy();
  });

  it('should call addToCart method with the product id when we click on Add to cart', () => {
    testHostComponent.initChild();
    testHostFixture.detectChanges();
    spyOn(testHostComponent.productCardComponent, 'addToCart');
    dh.clickButton('Add to cart');
    expect(testHostComponent.productCardComponent.addToCart).toHaveBeenCalledWith(testHostComponent.productCardComponent.product.id);
  });

  @Component({
    selector: `app-host-component`,
    template: `<app-product-card indexOfProduct product></app-product-card>`
  })
  class TestHostComponent {
    @ViewChild(ProductCardComponent)
    public productCardComponent: ProductCardComponent;

    initChild(): void {
      this.productCardComponent.indexOfProduct = 1;
      this.productCardComponent.product = {
        id: 1,
        category: 'trail',
        name: 'Running1',
        price: 99,
        quantity: 3,
        image: '/assets/img/products/p1.jpg',
        images: '',
        description: 'test'
      };
    }
  }
});
