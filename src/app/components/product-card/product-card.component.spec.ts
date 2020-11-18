import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { Component } from '@angular/core';

describe('ProductCardComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

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
  });

  it('should create', () => {
    testHostComponent.setInputs(1, {
      id: 1,
      category: 'trail',
      name: 'Running1',
      price: 99,
      quantity: 3,
      image: '/assets/img/products/p1.jpg',
      images: '',
      description: 'test'
    });
    testHostFixture.detectChanges();
    expect(testHostComponent).toBeTruthy();
  });

  @Component({
    selector: `app-host-component`,
    template: `<app-product-card [indexOfProduct]="index" [product]="product"></app-product-card>`
  })
  class TestHostComponent {
    private index: number;
    private product: any;

    setInputs(indexOfProduct: number, product: any): void {
      this.index = indexOfProduct;
      this.product = product;
    }
  }
});
