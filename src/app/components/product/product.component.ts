import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { ActivatedRoute } from '@angular/router';

declare let $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit {

  id: number;
  product;
  thumbImages: any[] = [];

  @ViewChild('quantity') quantityInput;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.productService.getSingleProduct(this.id).subscribe(prod => {
      this.product = prod;
      console.log(this.product);
      if (prod.images !== null) {
        this.thumbImages = prod.images.split(';');
      }
    });
  }

  ngAfterViewInit(): void {
    // Product Main img Slick
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [{
          breakpoint: 991,
          settings: {
            vertical: false,
            arrows: false,
            dots: true,
          }
        },
      ]
    });

    // Product img zoom
    const zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }
  }

  increase() {
    let value = parseInt(this.quantityInput.nativeElement.value);
    if (this.product.quantity > 0 && value < this.product.quantity) {
      value++;
    }
    this.quantityInput.nativeElement.value = value.toString();
  }

  decrease() {
    let value = parseInt(this.quantityInput.nativeElement.value);
    if (value > 1) {
      value--;
    } else {
      value = 1;
    }
    this.quantityInput.nativeElement.value = value.toString();
  }

  addToCart(id: number) {
    this.cartService.addProductToCart(id, parseInt(this.quantityInput.nativeElement.value));
  }
}
