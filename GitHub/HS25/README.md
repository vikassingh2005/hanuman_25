# Full-Stack Application

A comprehensive full-stack application with MongoDB, Express, React, and Node.js.

## Features

- Complete MERN stack implementation
- RESTful API with proper error handling
- JWT Authentication and Authorization
- React frontend with Redux state management
- Material UI components
- MongoDB database integration

## Project Structure

```
fullstack-app/
├── backend/             # Node.js and Express backend
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Custom middleware
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   └── server.js    # Entry point
│   ├── .env.example     # Environment variables example
│   └── package.json     # Backend dependencies
│
└── frontend/            # React frontend
    ├── public/          # Static files
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── redux/       # Redux state management
    │   ├── services/    # API services
    │   └── App.js       # Main component
    └── package.json     # Frontend dependencies
```

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB URI and JWT secret.

5. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## API Reference

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register a new user | Public |
| POST | /api/auth/login | Login user | Public |
| GET | /api/auth/me | Get current user | Private |
| PUT | /api/auth/updatedetails | Update user details | Private |
| PUT | /api/auth/updatepassword | Update password | Private |

### Product Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/products | Get all products | Public |
| GET | /api/products/:id | Get single product | Public |
| POST | /api/products | Create new product | Private/Admin |
| PUT | /api/products/:id | Update product | Private/Admin |
| DELETE | /api/products/:id | Delete product | Private/Admin |

### User Endpoints (Admin Only)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/users | Get all users | Private/Admin |
| GET | /api/users/:id | Get single user | Private/Admin |
| POST | /api/users | Create user | Private/Admin |
| PUT | /api/users/:id | Update user | Private/Admin |
| DELETE | /api/users/:id | Delete user | Private/Admin |

## Deployment

See the [deployment guide](DEPLOYMENT.md) for instructions on deploying to production environments.

## License

MIT