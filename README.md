# ShopStack

ShopStack is an eCommerce app built with a React frontend, NodeJS backend, and Prisma with SQLite. 
The current implementation focuses on a complete guest PDP -> cart -> checkout -> order confirmation flow.

## Stack

- Frontend: React, Vite, React Router, Tailwind CSS
- Backend: Node.js, Express, Zod validation
- Data: SQLite with Prisma ORM
- Cart model: guest cart persisted in `localStorage` and managed between front end and backend through the `X-Cart-Id` header.

## Implemented features

### F1. Product Catalog API & Display

- `GET /api/products`
- `GET /api/products/:id`
- Product listing page
- Product detail page

### F2. Shopping Cart

- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:productId`
- `DELETE /api/cart/items/:productId`
- Add-to-cart interaction from the product detail page
- Cart page with quantity updates, remove item, subtotal, and total
- Guest cart tracking using `X-Cart-Id`

### F3. Basic Checkout Flow

- `POST /api/orders`
- Checkout form with separate shipping fields
- Inventory validation and decrement during order placement
- Order confirmation page

## Architecture overview

The backend is organized into routes, controllers, services, repositories, middleware, and validation. 
Controllers stay thin and delegate business logic to services. 
Prisma handles persistence, including transactional order placement and inventory updates.

The frontend is organized around route-level pages, reusable components, and a small API service layer. 
The cart is server-backed so pricing, inventory, and checkout rules remain authoritative on the backend.

## Setup

### 1. Install dependencies

From the repo root:

```bash
npm install
npm install --workspace server
npm install --workspace client
```

### 2. Create local environment files

```bash
cp server/.env.example server/.env.local
cp client/.env.example client/.env.local
cp server/.env.local server/.env
```

`server/.env` is used by Prisma CLI commands.

### 3. Generate Prisma client, create the database, and seed it

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Run the app

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Prioritization rationale

The project was implemented incrementally.

1. F1 established the product catalog and product detail experience.
2. F2 added a complete guest cart backed by the server.
3. F3 completed the purchase path with checkout, order creation, and inventory updates.

This approach prioritizes one full user journey over breadth.

## Trade-offs and shortcuts

- Authentication is deferred to keep the guest flow complete and focused.
- Shipping data is captured and stored directly on the order model.
- Search, filtering, validation, and error handling are included where they materially improve the core flow.
- Tests, admin tools, real-time inventory, and other advanced features are intentionally left for later increments.

## To build next

- Authentication and order history
- Automated tests for backend services and API endpoints
- Improved checkout UX and confirmation details
- Promotions and discount logic
- Rate limiting, caching, and performance tuning
- Admin inventory management
