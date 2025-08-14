import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products';
import cartRouter from './routes/cart';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middlewares
app.use(cors({
  origin: '*', // Permitir todas as origens para desenvolvimento
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas da API
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado'
  });
});

// Middleware de tratamento de erros
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

export default app;

