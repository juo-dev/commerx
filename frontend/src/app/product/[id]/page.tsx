'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '@/types';
import { productService } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import CartSidebar from '@/components/CartSidebar';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const productId = params.id as string;

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      
      try {
        setIsLoading(true);
        const productData = await productService.getProduct(productId);
        setProduct(productData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erro ao carregar produto');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = async () => {
    if (!product || !product.inStock) return;

    try {
      setIsAddingToCart(true);
      await addToCart(product, quantity);
      setIsCartOpen(true);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const calculateDiscount = () => {
    if (!product?.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Produto não encontrado'}</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Voltar à Loja
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={() => setIsCartOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à loja
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Imagem do produto */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.originalPrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  -{calculateDiscount()}%
                </div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-xl font-medium">Fora de Estoque</span>
                </div>
              )}
            </div>

            {/* Detalhes do produto */}
            <div className="flex flex-col">
              <div className="mb-4">
                <span className="text-sm text-gray-500 uppercase tracking-wide">
                  {product.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">
                  {product.name}
                </h1>
              </div>

              {/* Preços */}
              <div className="mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <p className="text-green-600 text-sm mt-1">
                    Você economiza {formatPrice(product.originalPrice - product.price)}
                  </p>
                )}
              </div>

              {/* Descrição */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Status do estoque */}
              <div className="mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? '✓ Em estoque' : '✗ Fora de estoque'}
                </span>
              </div>

              {/* Controles de quantidade e botão de adicionar */}
              {product.inStock && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">Quantidade:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 text-center min-w-[3rem]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingToCart ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        <span>Adicionar ao Carrinho</span>
                      </>
                    )}
                  </button>

                  <div className="text-center text-sm text-gray-500">
                    Total: {formatPrice(product.price * quantity)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
}

