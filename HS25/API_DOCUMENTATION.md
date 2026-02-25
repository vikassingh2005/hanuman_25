# API Documentation

## Authentication Endpoints

### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "60d0fe4f5311236168a109ca",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }
  ```

### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "60d0fe4f5311236168a109ca",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }
  ```

## Profile Endpoints

### Get User Profile
- **URL**: `/api/profile`
- **Method**: `GET`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Update User Profile
- **URL**: `/api/profile`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
  ```json
  {
    "name": "John Updated",
    "email": "john.updated@example.com"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "John Updated",
      "email": "john.updated@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Upload Avatar
- **URL**: `/api/profile/avatar`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
  ```json
  {
    "image": "base64EncodedImageString"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "avatar": "https://example.com/new-avatar.jpg"
    }
  }
  ```

### Change Password
- **URL**: `/api/profile/password`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
  ```json
  {
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Password updated successfully"
  }
  ```

### Forgot Password
- **URL**: `/api/profile/forgot-password`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Password reset email sent"
  }
  ```

### Reset Password
- **URL**: `/api/profile/reset-password/:resetToken`
- **Method**: `PUT`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "password": "newPassword123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Password reset successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

## Analytics Endpoints

### Track Client Event
- **URL**: `/api/analytics`
- **Method**: `POST`
- **Auth Required**: Optional
- **Headers**: `Authorization: Bearer {token}` (if authenticated)
- **Body**:
  ```json
  {
    "eventType": "PAGE_VIEW",
    "eventData": {
      "page": "/dashboard",
      "referrer": "/login"
    }
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Event tracked successfully"
  }
  ```

## Error Responses

All endpoints may return the following error responses:

### Bad Request
- **Status Code**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "success": false,
    "error": "Validation error message"
  }
  ```

### Unauthorized
- **Status Code**: `401 Unauthorized`
- **Response Body**:
  ```json
  {
    "success": false,
    "error": "Not authorized to access this resource"
  }
  ```

### Not Found
- **Status Code**: `404 Not Found`
- **Response Body**:
  ```json
  {
    "success": false,
    "error": "Resource not found"
  }
  ```

### Server Error
- **Status Code**: `500 Internal Server Error`
- **Response Body**:
  ```json
  {
    "success": false,
    "error": "Server error"
  }
  ```