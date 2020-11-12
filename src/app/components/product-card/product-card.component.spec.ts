import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { Component } from '@angular/core';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

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
    testHostFixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(testHostComponent).toBeTruthy();
  // });

  @Component({
    selector: `app-host-component`,
    template: `<app-product-card [indexOfProduct]="1" [product]="product"></app-product-card>`
  })
  class TestHostComponent {
    product: any = {
      image: '/assets/img/products/p1.jpg'
    };
  }
});
