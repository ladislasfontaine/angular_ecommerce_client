export interface ProductModelServer {
  id: number;
  category: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  images: string;
  description: string;
}

export interface ProductsServerResponse {
  count: number;
  products: ProductModelServer[];
}
