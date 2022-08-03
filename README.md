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
NODE_ENV=development
PORT=3000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=storefront_dev
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=storefront_user
POSTGRES_PASSWORD=storefront_password

BCRYPT_SALT_ROUNDS=10
JWT_SECRET=supersecret // add your secret here
TOKEN_SECRET=supersecret // add your secret here
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
npm run start
```

## Usage

TBD



-- to be deleted -- 

### 1. Plan to Meet Requirements

In this repo there is a `REQUIREMENTS.md` document which outlines what this API needs to supply for the frontend, as well as the agreed upon data shapes to be passed between front and backend. This is much like a document you might come across in real life when building or extending an API. 

Your first task is to read the requirements and update the document with the following:
- Determine the RESTful route for each endpoint listed. Add the RESTful route and HTTP verb to the document so that the frontend developer can begin to build their fetch requests.    
**Example**: A SHOW route: 'blogs/:id' [GET] 

- Design the Postgres database tables based off the data shape requirements. Add to the requirements document the database tables and columns being sure to mark foreign keys.   
**Example**: You can format this however you like but these types of information should be provided
Table: Books (id:varchar, title:varchar, author:varchar, published_year:varchar, publisher_id:string[foreign key to publishers table], pages:number)

**NOTE** It is important to remember that there might not be a one to one ratio between data shapes and database tables. Data shapes only outline the structure of objects being passed between frontend and API, the database may need multiple tables to store a single shape. 

### 2.  DB Creation and Migrations

Now that you have the structure of the databse outlined, it is time to create the database and migrations. Add the npm packages dotenv and db-migrate that we used in the course and setup your Postgres database. If you get stuck, you can always revisit the database lesson for a reminder. 

You must also ensure that any sensitive information is hashed with bcrypt. If any passwords are found in plain text in your application it will not pass.

### 3. Models

Create the models for each database table. The methods in each model should map to the endpoints in `REQUIREMENTS.md`. Remember that these models should all have test suites and mocks.

### 4. Express Handlers

Set up the Express handlers to route incoming requests to the correct model method. Make sure that the endpoints you create match up with the enpoints listed in `REQUIREMENTS.md`. Endpoints must have tests and be CORS enabled. 

### 5. JWTs

Add JWT functionality as shown in the course. Make sure that JWTs are required for the routes listed in `REQUIUREMENTS.md`.

### 6. QA and `README.md`

Before submitting, make sure that your project is complete with a `README.md`. Your `README.md` must include instructions for setting up and running your project including how you setup, run, and connect to your database. 

Before submitting your project, spin it up and test each endpoint. If each one responds with data that matches the data shapes from the `REQUIREMENTS.md`, it is ready for submission!
