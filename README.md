# Real-Time Support Desk - Backend

A real-time support desk backend built using Node.js, Express, MongoDB, and Socket.io.

## Features
- **JWT Authentication & Password Hashing**
- **Role-Based Access Control (RBAC):** User, Support Agent, Admin
- **Support Tickets Management:** CRUD operations, filtering, and status updates
- **Real-Time Communication:** WebSockets for instant chat and typing indicators

## Tech Stack
- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **Socket.io**
- **JWT & bcryptjs**

## Environment Variables
Create a `.env` file in the root directory and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key