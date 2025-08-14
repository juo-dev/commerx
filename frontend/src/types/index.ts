export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

