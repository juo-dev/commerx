import axios from 'axios';
import { Product, Cart, ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  // Buscar produto por ID
  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Erro ao buscar produto');
    }
    return response.data.data;
  },

  // Buscar todos os produtos
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>('/products');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Erro ao buscar produtos');
    }
    return response.data.data;
  },
};

export const cartService = {
  // Adicionar produto ao carrinho
  addToCart: async (productId: string, quantity: number = 1, cartId?: string): Promise<Cart> => {
    const response = await api.post<ApiResponse<Cart>>('/cart/add', {
      productId,
      quantity,
      cartId,
    });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Erro ao adicionar produto ao carrinho');
    }
    return response.data.data;
  },

  // Buscar carrinho
  getCart: async (cartId: string): Promise<Cart> => {
    const response = await api.get<ApiResponse<Cart>>(`/cart?cartId=${cartId}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Erro ao buscar carrinho');
    }
    return response.data.data;
  },

  // Remover item do carrinho
  removeFromCart: async (cartId: string, productId: string): Promise<Cart> => {
    const response = await api.delete<ApiResponse<Cart>>('/cart/remove', {
      data: { cartId, productId },
    });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Erro ao remover item do carrinho');
    }
    return response.data.data;
  },
};

export default api;

