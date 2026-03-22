# API Reference

## Base URL

```
http://localhost:5000/api
```

## Authentication

All API requests requiring authentication should include a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Responses

Error responses follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

## Endpoints

### Authentication

#### Register User

- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

#### Login User

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

#### Get Current User

- **URL**: `/auth/me`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d0fe4f5311236168a109ca",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "createdAt": "2021-06-21T12:00:00.000Z"
      }
    }
    ```

### Products

#### Get All Products

- **URL**: `/products`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "success": true,
      "count": 2,
      "data": [
        {
          "_id": "60d0fe4f5311236168a109cb",
          "name": "Product 1",
          "description": "Description for product 1",
          "price": 99.99,
          "category": "Electronics",
          "inStock": true,
          "createdAt": "2021-06-21T12:00:00.000Z",
          "user": "60d0fe4f5311236168a109ca"
        },
        {
          "_id": "60d0fe4f5311236168a109cc",
          "name": "Product 2",
          "description": "Description for product 2",
          "price": 49.99,
          "category": "Books",
          "inStock": true,
          "createdAt": "2021-06-21T12:00:00.000Z",
          "user": "60d0fe4f5311236168a109ca"
        }
      ]
    }
    ```

#### Get Single Product

- **URL**: `/products/:id`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d0fe4f5311236168a109cb",
        "name": "Product 1",
        "description": "Description for product 1",
        "price": 99.99,
        "category": "Electronics",
        "inStock": true,
        "createdAt": "2021-06-21T12:00:00.000Z",
        "user": "60d0fe4f5311236168a109ca"
      }
    }
    ```

#### Create Product

- **URL**: `/products`
- **Method**: `POST`
- **Auth required**: Yes (Admin only)
- **Body**:
  ```json
  {
    "name": "New Product",
    "description": "Description for new product",
    "price": 79.99,
    "category": "Electronics",
    "inStock": true
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d0fe4f5311236168a109cd",
        "name": "New Product",
        "description": "Description for new product",
        "price": 79.99,
        "category": "Electronics",
        "inStock": true,
        "createdAt": "2021-06-21T12:00:00.000Z",
        "user": "60d0fe4f5311236168a109ca"
      }
    }
    ```

### Users (Admin Only)

#### Get All Users

- **URL**: `/users`
- **Method**: `GET`
- **Auth required**: Yes (Admin only)
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "success": true,
      "count": 2,
      "data": [
        {
          "_id": "60d0fe4f5311236168a109ca",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "admin",
          "createdAt": "2021-06-21T12:00:00.000Z"
        },
        {
          "_id": "60d0fe4f5311236168a109ce",
          "name": "Jane Doe",
          "email": "jane@example.com",
          "role": "user",
          "createdAt": "2021-06-21T12:00:00.000Z"
        }
      ]
    }
    ```