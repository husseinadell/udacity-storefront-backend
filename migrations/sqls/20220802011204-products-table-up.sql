CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    price INTEGER,
    category VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP
);