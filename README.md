# E-Commerce API

## Project Overview

This project is a simple e-commerce API built with NestJS, PostgreSQL, and TypeORM. It allows unauthenticated users to view approved products, authenticated users to manage their own products, and admins to manage users and products.

## Objectives

- **User Management**: Users can register, log in, and manage their products. Admins can view, ban, and unban users.
- **Product Management**: Authenticated users can manage their products, while admins can approve or disapprove products. Only approved products are visible to unauthenticated users.

## Setup and Installation

### Prerequisites

- Node.js (version 18.x or higher)
- PostgreSQL
- `npm` or `yarn`

### Cloning the Repository

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

Installing Dependencies
Install the project dependencies using npm or yarn:

```bash
npm install
# or
yarn install
```

Setting Up Environment Variables
Copy the .env.example file to a new file named .env:

```bash
cp .env.example .env

```

Open the .env file and update the values with your own configuration.

Running the Application Locally
Run the application:

```bash

npm run start:dev
# or
yarn start:dev
```

Access the API:

The application will be running on http://localhost:3000.

View API Documentation:

Swagger API documentation can be accessed at http://localhost:3000/api-docs.

API Endpoints

- User Management

1. POST /auth/register: Register a new user.
2. POST /auth/login: Authenticate a user and obtain a JWT token.
3. GET /users: List all users (admin only).
4. PATCH /users/
5. /ban: Ban a user (admin only).
6. PATCH /users/
7. /unban: Unban a user (admin only).

- Product Management
  POST /products: Create a new product (authenticated users).
  GET /products: List all approved products.
  GET /products/
  : Get a product by ID.
  PATCH /products/
  : Update a product (authenticated users).
  DELETE /products/
  : Delete a product (authenticated users).
  PATCH /products/
  /approve: Approve a product (admin only).
  PATCH /products/
  /disapprove: Disapprove a product (admin only).

- Testing
  To run the tests, use the following command:

  ```bash
  npm run test
  ```

# or

yarn test

```

```
