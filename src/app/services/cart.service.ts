import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { environment } from 'src/environments/environment';
import { CartModelPublic, CartModelServer } from '../models/cart.model';
import { ProductModelServer } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private SERVER_URL = environment.SERVER_URL;

  // data variable to store the cart information on the client local storage
  private cartDataClient: CartModelPublic = {
    total: 0,
    prodData: [{
      id: 0,
      incart: 0
    }]
  };

  // data variable to store cart information on the server
  private cartDataServer: CartModelServer = {
    total: 0,
    data: [{
      product: undefined,
      numInCart: 0
    }]
  };

  /* OBSERVABLES FOR THE COMPONENTS TO SUBSCRIBE */
  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);

  constructor(
    private http: HttpClient,
    private producService: ProductService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    // get information from local storage if any
    let info = JSON.parse(localStorage.getItem('cart'));
    // check if info is empty or not
    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      // local storage has information
      this.cartDataClient = info;
      // loop through each entry and put it in cartDataServer
      this.cartDataClient.prodData.forEach(p => {
        this.producService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) => {
          if (this.cartDataServer.data[0].numInCart === 0) {
            // cartDataServer is empty then replace first empty element
            this.cartDataServer.data[0].numInCart = p.incart;
            this.cartDataServer.data[0].product = actualProductInfo;
          } else {
            this.cartDataServer.data.push({
              numInCart: p.incart,
              product: actualProductInfo
            });
          }
          // TODO create calculate total function and replace it here
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartData$.next({...this.cartDataServer});
        });
      });
    }
  }


}
