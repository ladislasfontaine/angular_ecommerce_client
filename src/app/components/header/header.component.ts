import { Component, OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartData: CartModelServer;
  cartTotal: number;
  authState: boolean;

  constructor(
    private cartService: CartService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => {
      this.cartTotal = total;
    });
    this.cartService.cartData$.subscribe(data => {
      this.cartData = data;
    });
    this.userService.authState$.subscribe(authState => {
      this.authState = authState;
    });
  }

  numberOfProductsInCart(): number {
    let res = 0;
    this.cartData.data.forEach(p => {
      res += p.numInCart;
    });
    return res;
  }

  deleteCartItem(id: number) {
    this.cartService.deleteProductFromCart(id);
  }
}
