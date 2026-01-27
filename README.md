# ATS Authentication System

A complete authentication system with backend APIs and frontend UI for the ATS (Applicant Tracking System).

## Project Structure

```
ATS/
├── ATS-server/          # Backend Express server
│   ├── models/          # MongoDB models
│   ├── controllers/     # API controllers
│   ├── routes/          # API routes
│   └── server.js        # Main server file
└── get-jobs/            # Frontend React app
    └── src/
        ├── api/         # API services
        ├── context/     # React contexts
        └── pages/       # Page components
```

## Backend Setup

### Technologies Used
- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing

### Environment Variables
Create a `.env` file in `ATS-server/`:
```
PORT=5001
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key-change-this-in-production
```

### Installation & Running
```bash
cd ATS-server
npm install
npm start
```

The server will start on **http://localhost:5001**

### API Endpoints

#### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### 2. Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

## Frontend Setup

### Technologies Used
- **React 18** - UI library
- **React Router DOM** - Routing
- **TanStack Query (React Query)** - Data fetching
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Color Palette
- **#04060D** - Black (Primary background)
- **#D3D4D7** - Gray (Cards, text)
- **#143AA2** - Blue (Primary actions)
- **#3E8DE3** - Sky (Secondary elements)

### Environment Variables
Create a `.env` file in `get-jobs/`:
```
VITE_API_URL=http://localhost:5001
```

### Installation & Running
```bash
cd get-jobs
npm install
npm run dev
```

The app will start on **http://localhost:5174** (or another available port)

### Pages

1. **Login** (`/login`) - User login page
2. **Register** (`/register`) - User registration page
3. **Home** (`/`) - Protected dashboard (requires authentication)

### Features

- ✅ User registration with validation
- ✅ User login with JWT authentication
- ✅ Protected routes (redirects to login if not authenticated)
- ✅ Token stored in localStorage
- ✅ Automatic token injection in API requests
- ✅ Clean UI with specified color scheme
- ✅ Form validation (password length, matching passwords, etc.)
- ✅ Loading states during API calls
- ✅ Error handling and display

### Authentication Flow

1. User registers/logs in
2. Backend returns JWT token and user data
3. Frontend stores token in localStorage
4. AuthContext manages authentication state
5. Protected routes check authentication status
6. API requests automatically include token in headers

## Testing the System

### Backend Tests (using curl)

**Test Register:**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

**Test Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Frontend Tests

1. Open http://localhost:5174
2. You should be redirected to `/login`
3. Click "Register here" link
4. Fill in the registration form
5. After successful registration, you'll be redirected to the home page
6. Logout and try logging in again

## Project Status

✅ Backend authentication APIs implemented and tested
✅ Frontend login/register pages created
✅ TanStack Query integration complete
✅ Authentication context and protected routes working
✅ Color scheme applied consistently
✅ MongoDB connection configured
✅ Token-based authentication working

## Next Steps

- Add password reset functionality
- Add email verification
- Add user profile management
- Add refresh token mechanism
- Add rate limiting for security
- Add more comprehensive error handling
- Add unit and integration tests
