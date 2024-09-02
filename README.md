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

# or copy the following environmental variables and paste on your `.env` file"

DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
JWT_EXPIRATION=
PORT =

or you can just copy these variables

Open the .env file and update the values with your own configuration.

Running the Application Locally
Run the application:

```bash

npm run start:dev
# or
yarn start:dev
```

Access the API:

The application will be running on http://localhost:your-port

View API Documentation:

Swagger API documentation can be accessed at http://localhost:your-port/api-docs.

Start your NestJS server.
Navigate to http://localhost:your-port/api-docs in your browser.
You should see the Swagger UI with the documentation for your API, including details on all available endpoints and their request/response schemas.
