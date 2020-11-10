import { Component, OnInit, Input } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() indexOfProduct: number;
  @Input() product: any;

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSelectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }

  addToCart(id: number) {
    this.cartService.addProductToCart(id);
  }

}
