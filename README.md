# Udacity Storefront Backend Project
Second project of Udacity full stack developer nanodegree program.

## Technologies Used
- [Postgres](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [jasmine](https://jasmine.github.io/)
- [db-migrate](https://github.com/db-migrate/node-db-migrate)
- [JWT](https://jwt.io/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)


## Development Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Setup environment variables

Create a `.env` file in the root directory of the project.

add the following to the `.env` file:

```bash
NODE_ENV=dev
PORT=3000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=storefront_dev
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=storefront_user
POSTGRES_PASSWORD=storefront_password

BCRYPT_SALT_ROUNDS=10
BCRYPT_PASSWORD=supersecret // add your secret here
JWT_SECRET=supersecret // add your secret here
```

### 3. Start postgres server using docker compose

```bash
docker-compose up -d
```

### 4. Setup database

After the postgres server is running, exec to postgres container and run the following commands:

```bash
docker exec -it postgres-storefront-dev bash
psql -U storefront_user -d storefront_dev
CREATE DATABASE storefront_test;
GRANT ALL PRIVILEGES ON DATABASE storefront_dev TO storefront_user;
GRANT ALL PRIVILEGES ON DATABASE storefront_test TO storefront_user;
```

### 5. Database Migrations

run the following commands to migrate the database:

```bash
npm install -g db-migrate
db-migrate up
```
### 6. Run the server

run the following command to start the server:

```bash
yarn start
```

## Usage

Defined in the REQUIREMENTS.md file.
