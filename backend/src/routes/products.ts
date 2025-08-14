import { Router, Request, Response } from 'express';
import { products } from '../data/products';

const router = Router();

// GET /api/products/:id - retorna dados detalhados de um produto
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/products - retorna todos os produtos (endpoint adicional)
router.get('/', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;

