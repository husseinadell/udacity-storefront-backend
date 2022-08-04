CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    password VARCHAR NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);