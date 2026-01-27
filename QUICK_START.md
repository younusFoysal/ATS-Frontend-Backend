# Quick Start Guide

## 🚀 Start the Application

### Step 1: Start Backend Server
Open a terminal and run:
```bash
cd "/Volumes/Cloude/WebStrom Projects/ATS/ATS-server"
node server.js
```

You should see:
```
ATS server is running on port 5001
MongoDB connected successfully
```

### Step 2: Start Frontend Server
Open another terminal and run:
```bash
cd "/Volumes/Cloude/WebStrom Projects/ATS/get-jobs"
npm run dev
```

You should see:
```
VITE ready in [time]ms

➜  Local:   http://localhost:5174/
```

### Step 3: Access the Application
Open your browser and go to: **http://localhost:5174**

## 📱 Using the Application

### First Time User - Register

1. When you first open the app, you'll be redirected to `/login`
2. Click on **"Register here"** link at the bottom
3. Fill in the registration form:
   - **Name**: Your full name
   - **Email**: Your email address
   - **Password**: At least 6 characters
   - **Confirm Password**: Must match your password
4. Click **"Register"** button
5. Upon successful registration, you'll be automatically logged in and redirected to the home page

### Returning User - Login

1. Go to http://localhost:5174/login
2. Enter your **email** and **password**
3. Click **"Login"** button
4. Upon successful login, you'll be redirected to the home page

### Logged In - Home Page

Once logged in, you'll see:
- Welcome message with your name
- Your email address
- Dashboard cards showing different sections
- A **Logout** button in the top-right corner

### Logout

Click the **"Logout"** button in the navigation bar. You'll be logged out and redirected to the login page.

## 🎨 Color Scheme Reference

The application uses these colors throughout:

- **#04060D** (Black) - Main background color
- **#D3D4D7** (Gray) - Card backgrounds and light text
- **#143AA2** (Blue) - Primary buttons and accents
- **#3E8DE3** (Sky) - Secondary elements

## 🔒 Security Features

- ✅ Passwords are hashed before storing in database
- ✅ JWT tokens for secure authentication
- ✅ Protected routes (can't access home without login)
- ✅ Auto-redirect if not authenticated
- ✅ Token stored securely in localStorage
- ✅ Automatic token injection in API requests

## 🧪 Test Users

You can create test users by registering through the UI, or use these curl commands:

**Create a test user:**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

**Login with test user:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 📁 File Structure

```
ATS/
├── ATS-server/                 # Backend
│   ├── controllers/
│   │   └── authController.js   # Login & Register logic
│   ├── models/
│   │   └── User.js             # User schema
│   ├── routes/
│   │   └── api.js              # API endpoints
│   ├── .env                    # Environment variables
│   ├── server.js               # Main server file
│   └── package.json
│
├── get-jobs/                   # Frontend
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js        # Axios config
│   │   │   └── authAPI.js      # Auth API calls
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Register.jsx    # Register page
│   │   │   └── Home.jsx        # Dashboard page
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── .env                    # Frontend environment variables
│   └── package.json
│
├── README.md                   # Full documentation
├── IMPLEMENTATION_SUMMARY.md   # Implementation details
└── QUICK_START.md             # This file
```

## 🐛 Troubleshooting

### Backend won't start
- **Port 5001 in use?** Check with `lsof -i:5001` and kill the process
- **MongoDB connection error?** Check your MONGODB_URI in `.env`
- **Missing dependencies?** Run `npm install` in ATS-server directory

### Frontend won't start
- **Port 5174 in use?** Vite will automatically use another port
- **Missing dependencies?** Run `npm install` in get-jobs directory
- **Can't connect to backend?** Make sure backend is running on port 5001

### Can't login/register
- **Check backend is running** - Visit http://localhost:5001/
- **Check browser console** - Look for CORS or network errors
- **Check network tab** - See what API responses you're getting

## ✅ Verification Checklist

- [ ] Backend server is running on port 5001
- [ ] Frontend is running on port 5174
- [ ] MongoDB is connected
- [ ] Can access login page
- [ ] Can register new user
- [ ] Can login with registered user
- [ ] Redirected to home page after login
- [ ] Can see user information on home page
- [ ] Can logout successfully
- [ ] Redirected to login after logout

## 🎯 What's Next?

Now that authentication is working, you can:
1. Add more protected pages/routes
2. Create user profile management
3. Add password reset functionality
4. Implement role-based access control
5. Add email verification
6. Create admin panel
7. Add more features to the dashboard

---

**Need help?** Check README.md for detailed documentation or IMPLEMENTATION_SUMMARY.md for technical details.
