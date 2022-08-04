CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY ("orderId") REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY ("productId") REFERENCES products(id) ON DELETE CASCADE
);