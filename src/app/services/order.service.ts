import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private products: ProductResponseModel[] = [];
  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) { }

  getSingleOrder(orderId: number): Promise<ProductResponseModel[]> {
    return this.http.get<ProductResponseModel[]>(this.SERVER_URL + '/orders' + orderId).toPromise();
  }
}

interface ProductResponseModel {
  id: number;
  title: string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}
