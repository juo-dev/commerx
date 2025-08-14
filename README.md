# Commerx App

Uma aplicação completa de e-commerce desenvolvida com Next.js no frontend e Node.js no backend, utilizando TypeScript em
ambos os lados.

## 🚀 Funcionalidades

### Frontend (Next.js)

- **Página Principal**: Lista de produtos com imagens, preços e informações básicas
- **Página de Produto**: Detalhes completos do produto com:
    - Foto em alta qualidade
    - Nome e descrição detalhada
    - Preço atual e preço original (quando em promoção)
    - Indicador de desconto percentual
    - Status de estoque
    - Controles de quantidade
    - Botão "Adicionar ao Carrinho"
- **Carrinho Lateral**: Painel flutuante que exibe:
    - Produtos adicionados com imagens
    - Quantidades e preços individuais
    - Subtotal e total
    - Funcionalidade de remover itens
    - Botão "Finalizar Compra"
- **Interface Responsiva**: Design adaptável para desktop e mobile

### Backend (Node.js)

- **API RESTful** com os seguintes endpoints:
    - `GET /api/products` - Lista todos os produtos
    - `GET /api/products/:id` - Detalhes de um produto específico
    - `POST /api/cart/add` - Adiciona produto ao carrinho
    - `GET /api/cart` - Recupera itens do carrinho
    - `DELETE /api/cart/remove` - Remove item do carrinho
    - `GET /api/health` - Health check da API

## 🛠️ Tecnologias Utilizadas

### Frontend

- **Next.js 15.4.6** - Framework React para produção
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de CSS utilitário
- **Axios** - Cliente HTTP para requisições à API
- **Lucide React** - Biblioteca de ícones
- **Context API** - Gerenciamento de estado global do carrinho

### Backend

- **Node.js** - Runtime JavaScript
- **Express.js 4.18.2** - Framework web
- **TypeScript** - Tipagem estática
- **CORS** - Middleware para Cross-Origin Resource Sharing
- **UUID** - Geração de identificadores únicos
- **Nodemon** - Desenvolvimento com hot reload

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (gerenciador de pacotes)

## 🚀 Como executar o projeto

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd ecommerce-app
```

### 2. Instale as dependências do backend

```bash
cd backend
npm install
```

### 3. Instale as dependências do frontend

```bash
cd ../frontend
npm install
```

### 4. Execute o backend

```bash
cd ../backend
npm run dev
```

O servidor backend estará rodando em `http://localhost:3001`

### 5. Execute o frontend (em outro terminal)

```bash
cd frontend
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
ecommerce-app/
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   └── products.ts          # Dados mock dos produtos
│   │   ├── models/
│   │   │   └── Product.ts           # Interfaces TypeScript
│   │   ├── routes/
│   │   │   ├── products.ts          # Rotas de produtos
│   │   │   └── cart.ts              # Rotas do carrinho
│   │   └── index.ts                 # Servidor principal
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── product/[id]/
│   │   │   │   └── page.tsx         # Página de detalhes do produto
│   │   │   ├── layout.tsx           # Layout principal
│   │   │   └── page.tsx             # Página inicial
│   │   ├── components/
│   │   │   ├── Header.tsx           # Cabeçalho com carrinho
│   │   │   └── CartSidebar.tsx      # Carrinho lateral
│   │   ├── contexts/
│   │   │   └── CartContext.tsx      # Context do carrinho
│   │   ├── services/
│   │   │   └── api.ts               # Serviços de API
│   │   └── types/
│   │       └── index.ts             # Tipos TypeScript
│   ├── next.config.ts
│   └── package.json
└── README.md
```

## 🔧 Scripts Disponíveis

### Backend

- `npm run dev` - Executa o servidor em modo desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm start` - Executa o servidor compilado

### Frontend

- `npm run dev` - Executa o Next.js em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm start` - Executa o build de produção
- `npm run lint` - Executa o linter

## 🌐 Endpoints da API

### Produtos

- **GET** `/api/products` - Lista todos os produtos
- **GET** `/api/products/:id` - Busca produto por ID

### Carrinho

- **POST** `/api/cart/add` - Adiciona produto ao carrinho
  ```json
  {
    "productId": "1",
    "quantity": 2,
    "cartId": "uuid-opcional"
  }
  ```
- **GET** `/api/cart?cartId=uuid` - Busca carrinho por ID
- **DELETE** `/api/cart/remove` - Remove item do carrinho
  ```json
  {
    "cartId": "uuid",
    "productId": "1"
  }
  ```

### Utilitários

- **GET** `/api/health` - Health check da API

## 💾 Dados Mock

O projeto utiliza dados mock armazenados em memória com 8 produtos de exemplo:

- Smartphone Galaxy Pro (com desconto)
- Notebook Gamer Ultra
- Fone Bluetooth Premium (com desconto)
- Smart TV 55" 4K (fora de estoque)
- Tablet Pro 12" (com desconto)
- Smartwatch Elite Series (com desconto)
- Câmera Digital 4K (fora de estoque)
- Console Gaming Pro X (com desconto)

## 🎨 Funcionalidades de UI/UX

- **Indicadores Visuais**:
    - Badges de promoção
    - Status de estoque
    - Contador de itens no carrinho
- **Interações Fluidas**:
    - Hover effects nos produtos
    - Transições suaves
    - Loading states
- **Feedback Visual**:
    - Estados de carregamento
    - Mensagens de erro
    - Confirmações de ações

## 🔒 Recursos de Segurança

- **CORS** configurado para desenvolvimento
- **Validação de dados** nos endpoints
- **Tratamento de erros**
- **TypeScript** para type safety

## 📱 Compatibilidade

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 🚀 Deploy

### Frontend

O frontend pode ser deployado em plataformas como:

- Vercel (recomendado para Next.js)
- Netlify
- AWS Amplify

### Backend

O backend pode ser deployado em:

- Heroku
- Railway
- AWS EC2

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Motivação

Aplicação desenvolvida como teste técnico demonstrando competências em desenvolvimento full-stack com
Next.js e Node.js.

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!

