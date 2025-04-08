# bajarAnioDotCom 🛒

A full-featured MERN stack backend project built with authentication, user profile management, Google OAuth, reminders, and friend connections using MVC architecture. The backend part is Compted with proper testing. Next Frontend

## 🔧 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: 
  - Manual (Email/Password)
  - Google OAuth (Passport.js)
  - JWT (Token-based Auth with Cookies)
- **Security**: 
  - Rate Limiting (express-rate-limit)
  - Encrypted Passwords with Bcrypt
- **File Uploads**: 
  - Multer for image uploads
  - Cloudinary for image storage
- **Testing**: Postman collections (included in `testing/` folder)

---

## 📁 Project Structure (MVC Pattern)

```bash
bajarAnioDotCom/
├── controllers/               # Business logic controllers
│   ├── auth/                  # Authentication controllers
│   ├── friends/               # Friends-related controllers
│   ├── middleware/            # Custom middleware
│   ├── profile/               # User profile controllers
│   └── reminder/              # Reminder controllers
│   └── email/                 # email sender function
├── models/                    # MongoDB models and schemas
│   └── model/                 # Database model
│       ├── Reminder.js        # reminder schema for mongodb
│       ├── User.js            # user schema for mongodb
│   └── config/                # Database configuration
│       ├── cloudinary.js      # cloudinary connection setup
│       ├── db.js              # MongoDB connection setup
│       └── passport.js        # Passport.js configuration
├── routes/                    # API route definitions
│   ├── authRoutes.js          # Authentication routes
│   ├── friendsRoutes.js       # Friends management routes
│   ├── profileRoutes.js       # Profile management routes
│   └── reminderRoutes.js      # Reminder management routes
├── testing/                   # API test files
│   └── bajarAnio.postman_collection.json  # Postman collection
├── utility/                   # extra  files
│   └── emailTemplate          # Email Template for auth
├── uploads/                   # Temporary file storage (before Cloudinary)
├── server.js                  # Main application entry point
└── .env                       # Environment variables
```
---

## 🚀 Getting Started


### 1. Clone the Repository

```bash
git clonehttps://github.com/abidsarkar/bajarAnioDotCom.git
cd backend
```

### 2. Install Dependencies
```bash
npm install
```
### 3. Create a .env File
```bash
MONGO_URI = mongodb://localhost:27017/bajarAnio
PORT=5000
JWT_SECRET=your_secret_key
EMAIL_USER=your gmail account with google password access
EMAIL_PASS=pass from google password 
GOOGLE_CLIENT_ID= your google client id
GOOGLE_CLIENT_SECRET=your google client secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
frontendGoogleRedirectUrl=http://localhost:5173/dashboard
TOKEN_EXPIRY = 10d
NODE_ENV=production
BASE_URL= http://localhost:5173
#ratelimite
AuthRateLimit=15 * 60 * 1000
#cloudinary
CLOUDINARY_CLOUD_NAME=your cloudinary cloud name
CLOUDINARY_API_KEY=your cloudinary api key
CLOUDINARY_API_SECRET=your cloudinary api secret
```
### 4. Start the Server
```bash
npm run dev
# or
node server.js
```
Server will run on http://localhost:1000
## 📬 API Endpoints

| Feature                | Method | Endpoint                                         | Protected |
|------------------------|--------|--------------------------------------------------|-----------|
| Register               | POST   | `/api/auth/register`                            | No        |
| Email Verification     | POST   | `/api/auth/verify-email`                        | No        |
| Login                  | POST   | `/api/auth/login`                               | No        |
| Google Auth            | GET    | `/api/auth/google`                              | No        |
| Google Callback        | GET    | `/api/auth/google/callback`                     | No        |
| Logout                 | GET    | `/api/auth/logout`                              | Yes       |
| Password Reset Req     | POST   | `/api/auth/request-password-reset`              | No        |
| Verify OTP (Reset)     | POST   | `/api/auth/verify-reset-otp`                    | No        |
| Reset Password         | POST   | `/api/auth/reset-password`                      | No        |
| Change Password        | POST   | `/api/auth/change-password`                     | Yes       |
| Send Friend Request    | POST   | `/api/friends/send-friend-request`              | Yes       |
| Respond to Request     | PUT    | `/api/friends/respond`                          | Yes       |
| Remove Friend          | DELETE | `/api/friends/remove/:friendId`                 | Yes       |
| Profile Info           | GET    | `/api/profile/get-user-profile`                 | Yes       |
| Full Info              | GET    | `/api/profile/get-full-user-information`        | Yes       |
| Edit Username          | PUT    | `/api/profile/edit-userName`                    | Yes       |
| Update Profile Pic     | PUT    | `/api/profile/update-user-profile-picture`      | Yes       |
| Delete Account         | DELETE | `/api/profile/delete-account`                   | Yes       |
| Create Reminder        | POST   | `/api/reminder/create-reminder`                 | Yes       |
| Get All Reminders      | GET    | `/api/reminder/get-all-reminders`               | Yes       |
| Get One Reminder       | GET    | `/api/reminder/get-single-reminder/:id`         | Yes       |
| Update Reminder        | PATCH  | `/api/reminder/update-reminder/:id`             | Yes       |
| Delete Reminder        | DELETE | `/api/reminder/delete-reminder/:id`             | Yes       |

# 📮 Postman Testing
You’ll find a complete Postman collection with pre-defined request examples in:

```bash
Backend/testing/bajarAnioDotCom.postman_collection.json
```
Just import it into Postman and test every route easily.
# 📌 Features Highlight
- 🔐 Manual & Google Authentication

- 🧠 Rate Limiting for Register, Verification & Reset Routes

- 🌩️ Cloudinary Integration for Profile Images

- 📸 Multer for Image Uploading (1MB max size, accepts JPG/PNG/WebP)

- 📌 Reminders with CRUD

- 🧑‍🤝‍🧑 Friend Request Handling

- 📤 Clean MVC architecture
# 📣 Contributing
Open to issues, suggestions, and pull requests!
# 📜 License

---

Let me know if you want a `package.json` example or badges for GitHub stars, forks, or live API demos.
