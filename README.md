# E-Commerce Platform

An e-commerce platform for buying and selling items, built with a Node.js backend, a React frontend, and MongoDB for database management.

---

## Project Structure

- e-commerce-platform/
- │   ├── backend/                 # Backend files
- │   ├── src/                 # API routes, controllers, models, etc.
- │   ├── package.json         # Backend dependencies
- │   ├── .env                 # Backend environment variables
- │   └── uploads/             # Directory for uploaded files
- │
- ├── frontend/                # React frontend files
- │   ├── src/                 # React components and pages
- │   ├── public/              # Static assets
- │   ├── package.json         # Frontend dependencies
- │   ├── build/               # Production build
- │   └── tailwind.config.js   # Tailwind CSS configuration
- │
- ├── package.json             # Root package.json for managing scripts
- └── README.md                # Project documentation

---

## Environment Variables

Environment variables are required for the backend to function. Configure these in a `.env` file located in the `backend` directory.

1. Copy the `.env.example` file in the `backend` directory and rename it to `.env`.
2. Fill in the required values:
   - **`JWT_SECRET`**: A secure, randomly generated secret key.
       ```bash
       node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
       ```
   - **`MONGO_URI`**: Your MongoDB connection string (for production).
   - **`MONGO_URI_TEST`**: Your MongoDB connection string (for testing).

---

## Commands

The project is set up as a monorepo, with separate `backend` and `frontend` folders. All commands should be run from the root directory unless specified otherwise.

### Starting the Project

- **Start both frontend and backend:**
  ```bash
  npm run start
- **Backend: Runs on http://localhost:3000.**
- **Frontend: Runs on http://localhost:3001.**
- **Start backend only:**
  ```bash
  npm run start:backend
- **Start frontend only:**
  ```bash
  npm run start:frontend

### Development Mode

- **Run both frontend and backend in development:**
  ```bash
  npm run dev
- **Run backend in development mode (with nodemon):**
  ```bash
  npm run dev:backend
- **Build the production-ready frontend:**
  ```bash
  npm run build:frontend

## API Endpoints

### Base URL: `http://localhost:3000/api`

#### User Routes

- **Register a User**: `POST /api/users/register`
   - Body:
     {
     "username": "testuser",
     "email": "test@example.com",
     "password": "password123"
     }

- **Login**: `POST /api/users/login`
   - Body:
     {
     "email": "test@example.com",
     "password": "password123"
     }

#### Item Routes

- **Get All Items**: `GET /api/items`

- **Create an Item**: `POST /api/items`
   - Headers:
     {
     "Authorization": "Bearer <token>"
     }
   - Body:
     {
     "title": "Laptop",
     "description": "A used laptop in great condition",
     "price": 500,
     "category": "Electronics",
     "canBeSent": true
     }

---

## Project Features

### Backend

- **Authentication**: JSON Web Tokens (JWT) for secure login and protected routes.
- **CRUD**: Create, read, update, and delete operations for users and items.
- **Validation**: Joi for input validation.
- **Rate Limiting**: Protects against abuse with rate-limiter-flexible.
- **Image Uploads**: Supports file uploads using Multer.

### Frontend

- **React Router**: For client-side routing.
- **Tailwind CSS**: For a modern and responsive design.
- **Lucide React**: Icon set for UI elements.
- **TypeScript**: Type safety for the entire frontend.

---

## File Uploads

- **Directory**: Uploaded files are stored in the `backend/uploads/` folder.
- **Access URL**: Files are accessible at `http://localhost:3000/uploads/<filename>`.

---

## Testing

### Backend Testing

- Frameworks: Mocha, Chai, and Chai-HTTP.
- Run tests:
  ```bash
  npm run test:backend

### Frontend Testing

- Framework: React Testing Library.
- Run tests:
  ```bash
  npm run test:frontend
### Combined Test Command

- Run both backend and frontend tests:
  ```bash
  npm run test
  
---


