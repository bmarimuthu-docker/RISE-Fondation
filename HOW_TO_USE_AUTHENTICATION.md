# How to Update Your Website with Authentication

## ✅ What's Been Done

Your website now has:
- ✅ **Login page** (`/login`)
- ✅ **Sign Up page** (`/signup`)
- ✅ **Email verification page** (`/verify-email`)
- ✅ **Forgot password page** (`/forgot-password`)
- ✅ **Reset password page** (`/reset-password`)
- ✅ **Dashboard page** (protected, requires login)
- ✅ **Navbar** updated with Login/Sign Up buttons
- ✅ **Protected routes** (redirects to login if not authenticated)

## 🚀 Setup Steps

### Step 1: Ensure Backend Routes Are Registered

In `backend/app.js` or `backend/server.js`, make sure you have:

```javascript
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
```

### Step 2: Configure Backend Environment Variables

Create/update `backend/.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rise_foundation
DB_USER=postgres
DB_PASSWORD=your_password

# Authentication
JWT_SECRET=your-random-secret-key-at-least-32-characters

# Gmail (for email verification & password reset)
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Step 3: Setup Database

```bash
# Create database
createdb rise_foundation

# Run migrations
psql -U postgres -d rise_foundation -f backend/migrations/001_create_users_table.sql
```

### Step 4: Install Dependencies

```bash
cd backend
npm install nodemailer
```

### Step 5: Start Both Frontend & Backend

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 6: Test It Out

1. Open browser to `http://localhost:5173`
2. Click **"Sign Up"** button
3. Fill in: First Name, Last Name, Email, Password
4. Check email for verification link
5. Click verification link
6. Login with verified email
7. Should see Dashboard

## 📝 User Flow

```
1. User clicks "Sign Up"
   ↓
2. Fills form (First, Last, Email, Password)
   ↓
3. Account created, verification email sent
   ↓
4. User clicks email verification link
   ↓
5. Email verified, redirected to login
   ↓
6. User logs in with email/password
   ↓
7. JWT token stored in localStorage
   ↓
8. Access to Dashboard & protected pages
```

## 🔐 Authentication Features

| Feature | Details |
|---------|---------|
| **Signup** | Email/password with verification |
| **Email Verification** | 24-hour verification token |
| **Login** | Email & password authentication |
| **Password Reset** | Email-based password reset (1-hour token) |
| **Sessions** | JWT tokens stored in localStorage |
| **Protected Routes** | Admin panel requires admin role |

## 🌐 Available Routes

**Public Routes:**
- `/` - Home page
- `/signup` - Sign up form
- `/login` - Login form
- `/verify-email` - Email verification
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form
- `/lessons` - Course catalog

**Protected Routes:**
- `/dashboard` - User dashboard (requires login)
- `/admin` - Admin panel (requires admin role)

## 📱 Frontend Pages Already Created

```
frontend/src/pages/
├── SignUp.jsx              ✅ Sign up with email verification
├── Login.jsx               ✅ Login with email/password
├── VerifyEmail.jsx         ✅ Email verification
├── ForgotPassword.jsx      ✅ Password reset request
├── ResetPassword.jsx       ✅ Password reset form
├── Home.jsx                ✅ Home page (already exists)
├── Dashboard.jsx           ✅ User dashboard (already exists)
└── ... (other pages)
```

## 🛠️ API Endpoints Reference

```
POST   /api/auth/signup              Create account
POST   /api/auth/verify-email        Verify email
POST   /api/auth/login               Login
POST   /api/auth/forgot-password     Request password reset
POST   /api/auth/reset-password      Reset password
GET    /api/auth/me                  Get current user
```

## ✨ What Changed in Frontend

**App.jsx:**
- Added VerifyEmail, ForgotPassword, ResetPassword routes
- Added auto-login on page refresh (checks localStorage)
- Added protected routes (redirect to login if not authenticated)
- Added loading spinner while checking auth

**Navbar.jsx:**
- Updated to show user's firstName (from new auth system)
- Login/Sign Up buttons for non-authenticated users
- Logout button for authenticated users

**All Pages:**
- Ready to display authenticated user info
- Can access user data from Login/Signup components

## 🎯 Common Customizations

### Change Sign Up URL
In Navbar or links, change `/signup` to anything else (update App.jsx routes too).

### Change Password Requirements
In `SignUp.jsx` and `ForgotPassword.jsx`, change minimum length or add more requirements.

### Change Email Sender Name
In `backend/routes/auth.js`, update the `from` field in email options:
```javascript
from: `"RISE Foundation" <${process.env.GMAIL_USER}>`
```

### Add More User Fields
Update database schema and auth routes to include additional fields (phone, profile picture, etc.).

## ⚠️ Important Notes

1. **Gmail Setup:** Use app password, not your Gmail password
2. **JWT Secret:** Keep it secret and long (32+ characters)
3. **Database:** Backup before running migrations
4. **CORS:** Ensure backend has CORS enabled for your frontend URL
5. **HTTPS:** Use HTTPS in production (not just HTTP)

## 🧪 Testing the Auth System

### 1. Test Signup
- [ ] Fill all fields
- [ ] Submit form
- [ ] Check email for verification
- [ ] Click verification link
- [ ] Get success message

### 2. Test Login
- [ ] Go to login page
- [ ] Enter email & password
- [ ] Get redirected to dashboard
- [ ] See user info displayed

### 3. Test Protected Routes
- [ ] Try access `/dashboard` without login
- [ ] Should redirect to `/login`
- [ ] Login and try again
- [ ] Should show dashboard

### 4. Test Password Reset
- [ ] Click "Forgot Password?"
- [ ] Enter email
- [ ] Check email for reset link
- [ ] Click link and reset password
- [ ] Login with new password

## 📚 Documentation

For more details, see:
- `AUTH_QUICK_REFERENCE.md` - Quick setup guide
- `AUTHENTICATION_COMPLETE.md` - Complete API documentation
- `AUTH_SETUP_CHECKLIST.md` - Full testing checklist

## 🚀 Next Steps

1. ✅ Frontend pages created and integrated
2. ✅ Routes configured in App.jsx
3. ⏳ Setup backend environment variables
4. ⏳ Create database and run migrations
5. ⏳ Start backend server
6. ⏳ Test signup/login flow
7. ⏳ Deploy to production

## Need Help?

If something doesn't work:

1. **Check backend is running:** `http://localhost:5000/api/auth/me` (should show error about no token)
2. **Check browser console:** F12 → Console tab for errors
3. **Check backend logs:** Look for error messages when you try signup/login
4. **Check email:** Make sure Gmail credentials are correct
5. **Check database:** Make sure database exists and tables are created

Everything is ready to go! Just configure environment variables and start the servers.
