import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductModelServer, ProductsServerResponse } from 'src/app/models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products: ProductModelServer[] = [];
  component: any;

  constructor(
    private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(
      (prods: ProductsServerResponse) => {
        this.products = prods.products;
      }
    );
  }
}
