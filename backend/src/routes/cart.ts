import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Cart, CartItem } from '../models/Product';
import { products } from '../data/products';

const router = Router();

// Simulação de armazenamento em memória (em produção seria um banco de dados)
let carts: { [key: string]: Cart } = {};

// POST /api/cart/add - adiciona produto ao carrinho
router.post('/add', (req: Request, res: Response) => {
  try {
    const { productId, quantity = 1, cartId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'ID do produto é obrigatório'
      });
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    if (!product.inStock) {
      return res.status(400).json({
        success: false,
        message: 'Produto fora de estoque'
      });
    }
    
    // Usar cartId existente ou criar novo
    const currentCartId = cartId || uuidv4();
    
    if (!carts[currentCartId]) {
      carts[currentCartId] = {
        id: currentCartId,
        items: [],
        total: 0,
        subtotal: 0
      };
    }
    
    const cart = carts[currentCartId];
    
    // Verificar se o produto já está no carrinho
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Atualizar quantidade do item existente
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Adicionar novo item ao carrinho
      const newItem: CartItem = {
        productId,
        quantity,
        product
      };
      cart.items.push(newItem);
    }
    
    // Recalcular totais
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    cart.total = cart.subtotal; // Sem taxas por enquanto
    
    res.json({
      success: true,
      data: cart,
      message: 'Produto adicionado ao carrinho com sucesso'
    });
  } catch (error) {
    console.error('Erro ao adicionar produto ao carrinho:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/cart - retorna itens do carrinho
router.get('/', (req: Request, res: Response) => {
  try {
    const { cartId } = req.query;
    
    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: 'ID do carrinho é obrigatório'
      });
    }
    
    const cart = carts[cartId as string];
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Carrinho não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/cart/remove - remove item do carrinho
router.delete('/remove', (req: Request, res: Response) => {
  try {
    const { cartId, productId } = req.body;
    
    if (!cartId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'ID do carrinho e do produto são obrigatórios'
      });
    }
    
    const cart = carts[cartId];
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Carrinho não encontrado'
      });
    }
    
    // Remover item do carrinho
    cart.items = cart.items.filter(item => item.productId !== productId);
    
    // Recalcular totais
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    cart.total = cart.subtotal;
    
    res.json({
      success: true,
      data: cart,
      message: 'Item removido do carrinho com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;

