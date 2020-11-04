import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  orderId: number;
  products: ProductResponseModel[];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.params.id;
    console.log('ORDER ID: ' + this.orderId);
    this.orderService.getSingleOrder(this.orderId).then(prods => {
      this.products = prods;
      console.log(this.products);
    });
  }
}

interface ProductResponseModel {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantityOrdered: number;
  username: string;
}
