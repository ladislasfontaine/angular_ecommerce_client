import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { environment } from 'src/environments/environment';
import { CartModelPublic, CartModelServer } from '../models/cart.model';
import { ProductModelServer } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

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
    private router: Router,
    private toast: ToastrService,
    private spinner: NgxSpinnerService
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
          this.calculateTotal();
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartData$.next({...this.cartDataServer});
        });
      });
    }
  }

  addProductToCart(id: number, quantity?: number) {
    this.producService.getSingleProduct(id).subscribe(prod => {
      // 0. if the product is out of stock
      if (prod.quantity < 1) {
        this.toast.warning(`${prod.name} not in stock`, 'Product Status', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-bottom-right'
        });
      }
      // 1. if the cart is empty
      else if (this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
        this.calculateTotal();
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataServer});
        this.toast.success(`${prod.name} added to the cart`, 'Product Added', {
           timeOut: 3000,
           progressBar: true,
           progressAnimation: 'increasing',
           positionClass: 'toast-bottom-right'
        });
      }
      // 2. if the cart as some items
      else {
        let index = this.cartDataServer.data.findIndex(p => p.product.id === prod.id); // -1 or a positive value
        //  a. if that item is already in the cart
        if (index !== -1) {
          if (quantity !== undefined && quantity <= prod.quantity) {
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
          } else {
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart + 1 : prod.quantity;
          }
          this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
          this.toast.info(`${prod.name} quantity updated in the cart`, 'Product Updated', {
            timeOut: 3000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-bottom-right'
         });
        }
        //  b. if that item is not in the cart
        else {
          this.cartDataServer.data.push({
            product: prod,
            numInCart: quantity || 1
          });
          this.cartDataClient.prodData.push({
            id: prod.id,
            incart: quantity || 1
          });
          this.toast.success(`${prod.name} added to the cart`, 'Product Added', {
            timeOut: 3000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-bottom-right'
          });
        }
        this.calculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataServer});
      }
    });
  }

  updateCartItem(index: number, increase: boolean) {
    let data = this.cartDataServer.data[index];

    if (increase) {
      data.numInCart = data.numInCart < data.product.quantity ? data.numInCart + 1 : data.product.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartData$.next({...this.cartDataServer});
    } else {
      if (data.numInCart <= 1) {
        this.deleteProductFromCart(index);
        this.cartData$.next({...this.cartDataServer});
      } else {
        data.numInCart--;
        this.cartDataClient.prodData[index].incart = data.numInCart;
        this.calculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataServer});
      }
    }
  }

  deleteProductFromCart(index: number) {
    if (confirm('Are you sure you want to remove the item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      if (this.cartDataClient.total === 0) {
        this.cartDataClient = {
          total: 0,
          prodData: [{
            id: 0,
            incart: 0
          }]
        };
      }
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      if (this.cartDataServer.total === 0) {
        this.cartDataServer = {
          total: 0,
          data: [{
            product: undefined,
            numInCart: 0
          }]
        };
      }
      this.cartData$.next({...this.cartDataServer});
    } else {
      return;
    }
  }

  private calculateTotal() {
    let total = 0;

    this.cartDataServer.data.forEach(item => {
      total += (item.product.price * item.numInCart);
    });
    this.cartDataServer.total = total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  checkoutFromCart(userId: number) {
    this.http.post(`${this.SERVER_URL}/orders/payment`, null).subscribe((res: {success: boolean}) => {
      if (res.success) {
        this.resetServerData();
        this.http.post(`${this.SERVER_URL}/orders/new`, {
          userId: userId,
          products: this.cartDataClient.prodData
        }).subscribe(async (data: OrderResponse) => {
          // wait 2 seconds to view thank you page correctly
          await new Promise(resolve => setTimeout(resolve, 2000));
          this.orderService.getSingleOrder(data.order_id).then(prods => {
            if (data.success) {
              const navigationExtras: NavigationExtras = {
                state: {
                  message: data.message,
                  products: prods,
                  orderId: data.order_id,
                  total: this.cartDataClient.total
                }
              };
              this.spinner.hide();
              this.router.navigate(['/thankyou'], navigationExtras).then(p => {
                this.cartDataClient = {total: 0, prodData: [{id: 0, incart: 0}]};
                this.cartTotal$.next(0);
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
              });
            }
          });
        });
      } else {
        this.spinner.hide();
        this.router.navigateByUrl('/checkout').then();
        this.toast.error('Sorry, failed to book the order.', 'Order Status', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-bottom-right'
        });
      }
    });
  }

  private resetServerData() {
    this.cartDataServer = {
      total: 0,
      data: [{
        product: undefined,
        numInCart: 0
      }]
    };
    this.cartData$.next({...this.cartDataServer});
  }

  calculateSubTotal(index: number): number {
    const p = this.cartDataServer.data[index];
    return (p.product.price * p.numInCart);
  }
}

interface OrderResponse {
  order_id: number;
  success: boolean;
  message: string;
  products: [{
    id: number,
    incart: number
  }];
}
