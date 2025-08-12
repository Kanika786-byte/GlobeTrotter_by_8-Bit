# Globe Trotter Backend API

A complete Node.js/Express backend for the Globe Trotter travel application with Google OAuth authentication.

## 🚀 Features

- **Google OAuth Authentication** - Secure login with Google accounts
- **JWT Token Management** - Stateless authentication with HTTP-only cookies
- **MongoDB Database** - Flexible document storage with Mongoose ODM
- **RESTful API** - Complete CRUD operations for all resources
- **Input Validation** - Comprehensive request validation with express-validator
- **Rate Limiting** - Protection against abuse and spam
- **Security** - Helmet.js, CORS, and other security best practices
- **File Upload Support** - Ready for image uploads with Cloudinary integration
- **Email Integration** - Nodemailer setup for notifications
- **Comprehensive Models** - User, Destination, Trip, Booking, Review models

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google OAuth credentials
- (Optional) Cloudinary account for image uploads

## 🛠️ Installation

1. **Clone and setup**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```

3. **Configure your `.env` file:**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/globe-trotter
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Google OAuth (Required)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   
   SESSION_SECRET=your-session-secret
   FRONTEND_URL=http://localhost:5173
   ```

## 🔑 Google OAuth Setup

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**

2. **Create a new project or select existing**

3. **Enable Google+ API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it

4. **Create OAuth credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5000/auth/google/callback`
     - `https://yourdomain.com/auth/google/callback` (for production)

5. **Copy your credentials to `.env`:**
   - Client ID → `GOOGLE_CLIENT_ID`
   - Client Secret → `GOOGLE_CLIENT_SECRET`

## 🗄️ Database Setup

1. **Install MongoDB locally** or use MongoDB Atlas (cloud)

2. **Seed sample data:**
   ```bash
   npm run seed
   ```

3. **The seeder will create sample destinations including:**
   - Goa, Dubai, Bangkok, Singapore
   - Kerala, Rajasthan, Bali, Maldives

## 🚀 Running the Server

1. **Development mode:**
   ```bash
   npm run dev
   ```

2. **Production mode:**
   ```bash
   npm start
   ```

3. **Server will start on:** `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `GET /api/auth/google` - Start Google OAuth flow
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/register` - Register with email/password
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/check` - Check authentication status

### Destinations
- `GET /api/destinations` - Get destinations (with search/filter)
- `GET /api/destinations/featured` - Get featured destinations
- `GET /api/destinations/:id` - Get single destination
- `GET /api/destinations/search/nearby` - Search nearby destinations

### Trips
- `GET /api/trips` - Get user's trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get single trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip
- `POST /api/trips/:id/stops` - Add stop to trip

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id` - Update booking
- `POST /api/bookings/:id/cancel` - Cancel booking

### Reviews
- `GET /api/reviews/destination/:id` - Get destination reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/user` - Get user's reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/helpful` - Mark review as helpful

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics
- `DELETE /api/users/account` - Delete user account

## 🔒 Authentication Flow

1. **Google OAuth:**
   - User clicks "Sign in with Google"
   - Redirected to `/api/auth/google`
   - Google handles authentication
   - Callback to `/api/auth/google/callback`
   - JWT token set as HTTP-only cookie
   - User redirected to frontend

2. **Email/Password:**
   - User submits credentials to `/api/auth/login`
   - Server validates and creates JWT token
   - Token set as HTTP-only cookie

3. **Protected Routes:**
   - JWT token extracted from cookie or Authorization header
   - Token validated on each request
   - User data attached to `req.user`

## 🛡️ Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request throttling
- **Input Validation** - Request sanitization
- **JWT Tokens** - Stateless authentication
- **HTTP-only Cookies** - XSS protection
- **Password Hashing** - bcrypt with salt rounds
- **MongoDB Injection Protection** - Mongoose sanitization

## 📊 Database Models

### User Model
- Google OAuth integration
- Travel preferences
- Privacy settings
- Statistics tracking

### Destination Model
- Geographic coordinates
- Activity categories
- Pricing information
- Rating system
- Image management

### Trip Model
- Multi-destination support
- Budget tracking
- Collaboration features
- Privacy controls

### Booking Model
- Multiple service types
- Payment tracking
- Status management
- External integration ready

### Review Model
- Rating system
- Moderation support
- Helpful votes
- Image attachments

## 🔧 Development

1. **Code Structure:**
   ```
   backend/
   ├── config/          # Database and passport config
   ├── middleware/      # Authentication and validation
   ├── models/          # Mongoose models
   ├── routes/          # API route handlers
   ├── scripts/         # Database seeding
   └── server.js        # Main application file
   ```

2. **Adding New Features:**
   - Create model in `models/`
   - Add routes in `routes/`
   - Update middleware if needed
   - Add validation rules

3. **Database Migrations:**
   - Modify models as needed
   - Create migration scripts in `scripts/`
   - Update seeder data

## 🚀 Deployment

1. **Environment Variables:**
   - Set `NODE_ENV=production`
   - Use production MongoDB URI
   - Set secure session secrets
   - Configure production OAuth URLs

2. **Security Checklist:**
   - Enable HTTPS
   - Set secure cookie flags
   - Configure CORS for production domain
   - Set up proper rate limiting
   - Enable MongoDB authentication

3. **Monitoring:**
   - Add logging middleware
   - Set up error tracking
   - Monitor database performance
   - Track API usage

## 🤝 Integration with Frontend

The backend is designed to work seamlessly with the React frontend:

1. **Authentication:**
   - Frontend redirects to `/api/auth/google`
   - Backend handles OAuth and redirects back
   - JWT tokens managed automatically

2. **API Calls:**
   - All endpoints return consistent JSON responses
   - Error handling with proper HTTP status codes
   - Pagination support for list endpoints

3. **CORS Configuration:**
   - Configured for frontend URL
   - Credentials support enabled
   - Proper headers allowed

## 📝 Notes

- **Development**: Server runs on port 5000
- **Database**: MongoDB required (local or cloud)
- **Authentication**: Google OAuth is primary method
- **Security**: Production-ready security measures included
- **Scalability**: Designed for horizontal scaling
- **Monitoring**: Ready for production monitoring tools

## 🆘 Troubleshooting

1. **MongoDB Connection Issues:**
   - Check MongoDB is running
   - Verify connection string
   - Check network connectivity

2. **Google OAuth Issues:**
   - Verify client ID and secret
   - Check redirect URLs match exactly
   - Ensure Google+ API is enabled

3. **CORS Issues:**
   - Check frontend URL in CORS config
   - Verify credentials are included in requests
   - Check preflight request handling

4. **JWT Issues:**
   - Verify JWT secret is set
   - Check token expiration
   - Ensure cookies are being sent