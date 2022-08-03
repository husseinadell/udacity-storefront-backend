# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints

#### Users
- Index `'users/' [GET] (token required)`
- Show `'users/:id' [GET] (token required)`
- Create `'users/' [POST]`
- [ADDED] Update `'users/:id' [PUT] (token required)`
- [ADDED] Login `'users/login' [POST]`

#### Products
- Index `'products/' [GET]`
- Show `'products/:id' [GET]`
- Create `'products/' [POST] (token required)`
- [ADDED] Update `'products/:id' [PUT] (token required)`
- [ADDED] Delete `'products/:id' [DELETE] (token required)`
- [OPTIONAL] Products by category (args: product category) `'products/?categoryId=:id' [GET]` 

#### Orders
- [ADDED] Index (user orders) `'orders/' [GET] (token required)`
- Create `'orders/' [POST] (token required)`
- Current Order by user `'orders/recent' [GET] (token required)` // userID is extracted from token
- [ADDED] Index (All user orders) `'orders/:id' [GET] (token required)` // userID is extracted from token
- [OPTIONAL] Completed Orders by user `'/orders?status=complete' [GET] (token required)` // userID is extracted from token
- [ADDED] Update order's status, add products: `'orders/:id' [PUT] (token required)`

* Note: For detailed information on the endpoints, see the rest-client.http file. It uses vscode extension [rest-client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) to run the requests.

## Data Shapes

#### Product
```sql

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  price INTEGER,
  category VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP
);
```

#### User
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  password VARCHAR NOT NULL,
  email VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### Orders
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

-- many to many relationship between products and orders
CREATE TABLE order_products (
  id SERIAL PRIMARY KEY,
  orderId INTEGER NOT NULL,
  productId INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);
```

