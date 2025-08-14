'use client'

import React from 'react'
import { Trash2, X } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import Image from 'next/image'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, isLoading } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId)
    } catch (error) {
      console.error('Erro ao remover item:', error)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b text-gray-700">
            <h2 className="text-lg font-semibold">Carrinho de Compras</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-full transition-colors">
              <X className="h-5 w-5 hover:text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : !cart || cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <p>Seu carrinho está vazio</p>
                <p className="text-sm mt-1">Adicione produtos para começar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map(item => (
                  <div
                    key={item.productId}
                    className="flex items-center space-x-3 p-3 border-gray-500 border rounded-lg"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover rounded" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">{formatPrice(item.product.price)}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-600">Qtd: {item.quantity}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <p className="text-gray-500 text-sm font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Remover item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart && cart.items.length > 0 && (
            <div className="border-t border-gray-500 p-4 space-y-4">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-base font-medium">Subtotal:</span>
                <span className="text-lg font-bold">{formatPrice(cart.subtotal)}</span>
              </div>

              <div className="flex justify-between items-center text-lg font-bold text-gray-500">
                <span>Total:</span>
                <span>{formatPrice(cart.total)}</span>
              </div>

              <button
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={() => alert('Implementar fluxo de pagamento')}
                disabled={isLoading}
              >
                Finalizar Compra
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CartSidebar
