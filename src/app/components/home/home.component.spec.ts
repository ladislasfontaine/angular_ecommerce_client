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

  it('should navigate to "/" before any button click', () => {
    const location = TestBed.inject(Location);
    expect(location.path()).toBe('');
  });
});

@Component({ template: '' })
class DummyComponent {}

class ProductServiceStub {
  getAllProducts(numberOfResults = 10): Observable<any[]> {
    return of([]);
  }
}
