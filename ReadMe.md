# Travel Listing Platform - Backend API

A RESTful API backend for a travel listing platform that enables users to share and discover unique travel experiences. Built with Express.js, this API provides authentication, CRUD operations for travel listings, and cloud-based image management.

## Project Overview

This backend service powers a travel listing platform with secure user authentication, listing management, and image uploads. The API features JWT-based authentication, MongoDB integration for data persistence, and Cloudinary for optimized image storage.

## Project Structure

```
backend/
├── middleware/
│   └── auth.js                 # JWT authentication middleware
├── models/
│   ├── List_Model.js          # Mongoose schema for travel listings
│   └── User_Model.js          # Mongoose schema for users
├── routes/
│   ├── Auth_Routes.js         # Authentication endpoints (register, login)
│   ├── Exp_Routes.js          # Listing CRUD operations
│   └── Upload_Routes.js       # Image upload to Cloudinary
├── .env                       # Environment variables (not in git)
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies and scripts
├── server.js                  # Main application entry point
└── ReadMe.md                  # This file
```

## Tech Stack

- **Node.js** - JavaScript runtime environment
- **Express.js 5.x** - Web application framework
- **MongoDB/Mongoose** - NoSQL database and ODM
- **JWT (jsonwebtoken)** - Secure authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Cloud-based image storage and optimization
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **dotenv** - Environment configuration

## Prerequisites

- **Node.js** 14.x or higher
- **npm** or **yarn** package manager
- **MongoDB Atlas** account or local MongoDB instance
- **Cloudinary** account for image storage

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 4. Run the development server

```bash
# Using npm
npm start

# Or with nodemon for auto-restart (add script to package.json)
npx nodemon server.js
```

The server will start on `http://localhost:5000` (or the PORT specified in `.env`)

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User

```http
POST /api/auth/register
Authorization: <API_KEY>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login User

```http
POST /api/auth/login
Authorization: <API_KEY>
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Listing Routes (`/api/listings`)

#### Get All Listings (Public)

```http
GET /api/listings?page=1&limit=9&search=beach
```

#### Get User's Listings (Protected)

```http
GET /api/listings/my?page=1&limit=9&search=
Authorization: Bearer <JWT_TOKEN>
```

#### Get Single Listing (Public)

```http
GET /api/listings/:id
```

#### Create Listing (Protected)

```http
POST /api/listings
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Beautiful Beach House",
  "location": "Maldives",
  "imageUrl": "https://cloudinary.com/...",
  "description": "Amazing ocean view...",
  "price": 150
}
```

#### Update Listing (Protected)

```http
PUT /api/listings/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Updated Title",
  "location": "Updated Location",
  ...
}
```

#### Delete Listing (Protected)

```http
DELETE /api/listings/:id
Authorization: Bearer <JWT_TOKEN>
```

### Upload Routes (`/api/upload`)

#### Upload Image (Protected)

```http
POST /api/upload
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

## Features

- ✅ **User Authentication**
  - Registration with bcrypt password hashing
  - Login with JWT token generation
  - API key protection on auth endpoints
- ✅ **JWT Middleware**
  - Protected route authentication
  - Token verification and expiration handling
- ✅ **Travel Listing Management**
  - Create, read, update, delete (CRUD) operations
  - Server-side pagination
  - Search functionality across title, location, and description
  - Author population with user details
- ✅ **Image Upload**
  - Base64 image upload to Cloudinary
  - Automatic image optimization (1200x800, quality: auto)
  - Formatted URL response
- ✅ **Database Models**
  - User model with authentication fields
  - Listing model with author reference
  - Mongoose schema validation

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication failed)
- `403` - Forbidden (authorization failed)
- `404` - Not Found
- `500` - Internal Server Error

## Question: If this platform had 10,000 travel listings, what changes would you make to improve performance and user experience?

With 10,000 travel listings, several strategic changes would be essential for performance and user experience:

**Pagination and Infinite Scroll**: Currently, all listings are loaded at once. To improve performance, I would implement page-wise fetching with server-side pagination so only a small set of listings loads at a time. I would also add infinite scroll so more listings load automatically as users scroll, creating a smoother browsing experience.

**Database Indexing**: Adding indexes on commonly queried fields such as location, author, createdAt, and price would significantly speed up database queries. Compound indexes could also help optimize common filter combinations.

**Caching**: I would add Redis to cache frequently requested listings and homepage data, reducing database load and improving response times. Edge caching through platforms like Cloudflare could further improve global performance.
