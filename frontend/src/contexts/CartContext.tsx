'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cart, CartItem, Product } from '@/types';
import { cartService } from '@/services/api';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_CART' };

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  getCartItemCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload, isLoading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_CART':
      return { ...state, cart: null, error: null };
    default:
      return state;
  }
};

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Recuperar cartId do localStorage
  const getCartId = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cartId');
    }
    return null;
  };

  // Salvar cartId no localStorage
  const saveCartId = (cartId: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartId', cartId);
    }
  };

  // Carregar carrinho existente ao inicializar
  useEffect(() => {
    const loadCart = async () => {
      const cartId = getCartId();
      if (cartId) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const cart = await cartService.getCart(cartId);
          dispatch({ type: 'SET_CART', payload: cart });
        } catch (error) {
          // Se o carrinho não existir, limpar o localStorage
          localStorage.removeItem('cartId');
          dispatch({ type: 'SET_ERROR', payload: null });
        }
      }
    };

    loadCart();
  }, []);

  const addToCart = async (product: Product, quantity: number = 1): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cartId = getCartId();
      const updatedCart = await cartService.addToCart(product.id, quantity, cartId || undefined);
      
      // Salvar o ID do carrinho se for novo
      if (!cartId) {
        saveCartId(updatedCart.id);
      }
      
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar produto ao carrinho';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const removeFromCart = async (productId: string): Promise<void> => {
    const cartId = getCartId();
    if (!cartId) {
      dispatch({ type: 'SET_ERROR', payload: 'Carrinho não encontrado' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await cartService.removeFromCart(cartId, productId);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover produto do carrinho';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const getCartItemCount = (): number => {
    if (!state.cart) return 0;
    return state.cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = (): number => {
    return state.cart?.total || 0;
  };

  const contextValue: CartContextType = {
    ...state,
    addToCart,
    removeFromCart,
    getCartItemCount,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

