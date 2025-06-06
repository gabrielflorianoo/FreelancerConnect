# 🔧 Plataforma de Serviços Locais - Freelancer Connect

Plataforma web que conecta clientes e prestadores de serviço da mesma região, com foco em agilidade, segurança e controle total de pagamentos e avaliações.

## 🎯 Objetivo

Permitir que usuários publiquem pedidos de serviço (TI, elétrica, reformas, etc.) e freelancers da área possam aceitar, negociar, concluir e receber avaliações e pagamentos.

---

## 🧪 Tecnologias

### Backend:

- Node.js + Express
- PostgreSQL + Prisma
- Autenticação com JWT + Bcrypt
- Redis (cache)
- Bull (filas de background)
- WebSockets (`socket.io`) para chat
- Stripe ou Pagar.me (pagamento)
- Helmet, CORS, rate limit, etc.

### Frontend:

- React + Vite
- TailwindCSS
- React Router
- Axios
- Zustand ou Context API
- Recharts para estatísticas
- Protected Routes via token

---

## 👤 Funcionalidades por tipo de usuário

### Cliente:

- Criar conta/login
- Criar pedidos de serviço com categoria e descrição
- Ver freelancers por área
- Enviar mensagens (chat)
- Avaliar freelancers após serviço
- Histórico de pedidos

### Freelancer:

- Criar perfil com serviços e portfólio
- Receber e responder pedidos
- Aceitar, recusar e concluir tarefas
- Receber avaliações
- Ver saldo disponível (caso com wallet)

### Admin:

- Ver estatísticas e métricas gerais
- Moderação de denúncias
- Banimento e controle de usuários
- Acompanhamento de transações

---

## 💰 Pagamentos

- Simulação ou integração real com Stripe/Pagar.me
- Pagamento com split entre cliente ↔ freelancer
- Sistema de carteira digital com saque agendado (simulado ou real)

---

## 🔌 Rotas da API

Prefixo base: `/api/v1`

---

### 🔐 Auth

| Método | Rota             | Descrição                        |
| ------ | ---------------- | -------------------------------- |
| POST   | `/auth/register` | Registro (cliente ou freelancer) |
| POST   | `/auth/login`    | Login                            |
| POST   | `/auth/logout`   | Logout (opcional)                |
| POST   | `/auth/refresh`  | Gera novo token JWT              |
| GET    | `/auth/me`       | Info do usuário autenticado      |

---

### 👤 Usuário (geral)

| Método | Rota                 | Descrição                           |
| ------ | -------------------- | ----------------------------------- |
| GET    | `/users/:id`         | Ver perfil público de outro usuário |
| PATCH  | `/users/me`          | Atualizar seu perfil                |
| PATCH  | `/users/me/password` | Atualizar senha                     |
| DELETE | `/users/me`          | Deletar sua conta                   |

---

### 🛠️ Freelancer

| Método | Rota                      | Descrição                           |
| ------ | ------------------------- | ----------------------------------- |
| GET    | `/freelancers`            | Listar freelancers com filtros      |
| GET    | `/freelancers/:id`        | Ver perfil de freelancer específico |
| PATCH  | `/freelancers/me/profile` | Atualizar dados de serviço          |
| GET    | `/freelancers/me/jobs`    | Ver pedidos recebidos               |

---

### 📋 Pedidos de Serviço (Jobs)

| Método | Rota                 | Descrição                         |
| ------ | -------------------- | --------------------------------- |
| POST   | `/jobs`              | Cliente cria um novo pedido       |
| GET    | `/jobs`              | Listar pedidos disponíveis        |
| GET    | `/jobs/:id`          | Ver detalhes de um pedido         |
| PATCH  | `/jobs/:id/accept`   | Freelancer aceita pedido          |
| PATCH  | `/jobs/:id/complete` | Marcar como concluído             |
| PATCH  | `/jobs/:id/cancel`   | Cancelar pedido                   |
| GET    | `/jobs/my/created`   | Pedidos criados por mim (cliente) |
| GET    | `/jobs/my/accepted`  | Pedidos que aceitei (freelancer)  |

---

### 💬 Chat

> (via WebSocket ou fallback REST)
> | Método | Rota | Descrição |
> |--------|------|-----------|
> | GET | `/chat/:jobId/messages` | Carregar histórico de mensagens |
> | POST | `/chat/:jobId/messages`| Enviar nova mensagem |

---

### ⭐ Avaliações

| Método | Rota                       | Descrição                       |
| ------ | -------------------------- | ------------------------------- |
| POST   | `/reviews/:jobId`          | Avaliar freelancer após serviço |
| GET    | `/freelancers/:id/reviews` | Ver avaliações de um freelancer |

---

### 💰 Pagamentos

| Método | Rota                 | Descrição                   |
| ------ | -------------------- | --------------------------- |
| POST   | `/payments/checkout` | Iniciar pagamento           |
| GET    | `/payments/history`  | Ver histórico de pagamentos |
| GET    | `/wallet/balance`    | Ver saldo disponível        |
| POST   | `/wallet/withdraw`   | Solicitar saque (simulado)  |

---

### 🛠️ Admin (restrito)

| Método | Rota                   | Descrição                   |
| ------ | ---------------------- | --------------------------- |
| GET    | `/admin/users`         | Listar todos usuários       |
| PATCH  | `/admin/users/:id/ban` | Banir usuário               |
| DELETE | `/admin/jobs/:id`      | Remover pedido              |
| GET    | `/admin/stats`         | Ver estatísticas e métricas |

---

### 📈 Extras

| Método | Rota          | Descrição                          |
| ------ | ------------- | ---------------------------------- |
| GET    | `/health`     | Verificação de saúde da API        |
| GET    | `/categories` | Listar categorias de serviço       |
| GET    | `/locations`  | Listar cidades/bairros disponíveis |

---

## 📌 Status do projeto

> 🔄 Em desenvolvimento – base backend e autenticação concluída. Em breve: chat, pagamentos e dashboard.

---

## 📃 Licença

MIT
