# Globe Trotter Python Backend

A complete FastAPI backend for Globe Trotter travel application with Google OAuth, OpenAI integration, and Google Maps API.

## 🚀 Features

- **FastAPI Framework** - Modern, fast web framework for building APIs
- **Google OAuth 2.0** - Secure authentication with Google accounts
- **OpenAI Integration** - AI-powered travel assistant and recommendations
- **Google Maps API** - Location services, place search, and directions
- **PostgreSQL/SQLite** - Flexible database support
- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - Built-in request throttling
- **Async/Await** - High-performance asynchronous operations

## 📋 Prerequisites

- Python 3.8+
- PostgreSQL (optional, SQLite works for development)
- Google Cloud Console account (for OAuth and Maps API)
- OpenAI API account

## 🛠️ Installation

1. **Create virtual environment:**
   ```bash
   cd python-backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment setup:**
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file with your API keys**

## 🔑 API Keys Setup

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:8000/api/auth/google/callback`
5. Copy credentials to `.env`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

### 2. Google Maps API Setup

1. In Google Cloud Console, enable these APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API
2. Create API key:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Restrict the key to the enabled APIs
3. Add to `.env`:
   ```env
   GOOGLE_MAPS_API_KEY=your-maps-api-key
   ```

### 3. OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create account and get API key
3. Add to `.env`:
   ```env
   OPENAI_API_KEY=your-openai-api-key
   ```

## 🗄️ Database Setup

**For SQLite (Development):**
```bash
# Database will be created automatically
python -m app.main
```

**For PostgreSQL (Production):**
```bash
# Install PostgreSQL and create database
createdb globe_trotter

# Update .env with PostgreSQL URL
DATABASE_URL=postgresql://username:password@localhost:5432/globe_trotter
```

**Seed sample data:**
```bash
python scripts/seed_data.py
```

## 🚀 Running the Server

**Development:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Production:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Server will be available at: `http://localhost:8000`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

## 🔗 API Endpoints

### Authentication
- `GET /api/auth/google` - Start Google OAuth flow
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user info

### Destinations
- `GET /api/destinations/` - Get destinations with filtering
- `GET /api/destinations/featured` - Get featured destinations
- `GET /api/destinations/{id}` - Get single destination
- `POST /api/destinations/` - Create destination (admin)

### Trips
- `GET /api/trips/` - Get user trips
- `POST /api/trips/` - Create new trip
- `GET /api/trips/{id}` - Get single trip
- `PUT /api/trips/{id}` - Update trip
- `DELETE /api/trips/{id}` - Delete trip

### Bookings
- `GET /api/bookings/` - Get user bookings
- `POST /api/bookings/` - Create booking
- `PUT /api/bookings/{id}/cancel` - Cancel booking

### AI Assistant
- `POST /api/ai/chat` - Chat with AI travel assistant
- `POST /api/ai/suggest-itinerary` - Get AI itinerary suggestions
- `POST /api/ai/analyze-preferences` - Analyze travel preferences

### Maps
- `POST /api/maps/search-places` - Search places
- `GET /api/maps/place-details/{place_id}` - Get place details
- `POST /api/maps/directions` - Get directions
- `POST /api/maps/geocode` - Convert address to coordinates
- `POST /api/maps/reverse-geocode` - Convert coordinates to address

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/stats` - Get user statistics

## 🔒 Authentication Flow

1. **Frontend redirects to:** `/api/auth/google`
2. **User authenticates with Google**
3. **Google redirects to:** `/api/auth/google/callback`
4. **Backend creates JWT token and redirects to frontend**
5. **Frontend stores token and makes authenticated requests**

## 🤖 AI Features

### Travel Assistant
- Natural language travel queries
- Destination recommendations
- Travel advice and tips
- Context-aware responses

### Itinerary Generation
- AI-powered day-by-day itineraries
- Budget-conscious suggestions
- Interest-based recommendations
- Local insights and tips

### Preference Analysis
- Travel pattern analysis
- Personalized recommendations
- Future trip suggestions
- Travel style identification

## 🗺️ Maps Integration

### Place Search
- Text-based place search
- Location-biased results
- Place photos and details
- Ratings and reviews

### Directions
- Multi-modal directions
- Waypoint support
- Alternative routes
- Step-by-step instructions

### Geocoding
- Address to coordinates
- Coordinates to address
- Place ID resolution
- Location validation

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - Request throttling
- **CORS Protection** - Cross-origin security
- **Input Validation** - Pydantic models
- **SQL Injection Protection** - SQLAlchemy ORM

## 📊 Database Schema

### Users
- Google OAuth integration
- Profile information
- Travel preferences
- Account status

### Destinations
- Geographic data
- Ratings and reviews
- Activity categories
- Pricing information

### Trips
- Multi-destination support
- Budget tracking
- AI suggestions
- Privacy controls

### Bookings
- Service bookings
- Payment tracking
- Status management
- Booking details

## 🚀 Deployment

### Environment Variables
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
SECRET_KEY=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_MAPS_API_KEY=your-maps-api-key
OPENAI_API_KEY=your-openai-api-key
```

### Docker Deployment
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🔧 Development

### Project Structure
```
python-backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app
│   ├── database.py          # Database setup
│   ├── models.py            # Pydantic models
│   ├── auth.py              # Authentication
│   ├── middleware/          # Custom middleware
│   └── routers/             # API routes
├── scripts/                 # Utility scripts
├── requirements.txt         # Dependencies
└── .env.example            # Environment template
```

### Adding New Features
1. Create Pydantic models in `models.py`
2. Add database tables in `database.py`
3. Create router in `routers/`
4. Include router in `main.py`
5. Update documentation

## 🆘 Troubleshooting

### Common Issues

1. **Google OAuth Error:**
   - Check client ID and secret
   - Verify redirect URI matches exactly
   - Ensure Google+ API is enabled

2. **Maps API Error:**
   - Verify API key is correct
   - Check API quotas and billing
   - Ensure required APIs are enabled

3. **OpenAI API Error:**
   - Check API key validity
   - Verify account has credits
   - Check rate limits

4. **Database Connection:**
   - Verify DATABASE_URL format
   - Check database server is running
   - Ensure database exists

## 📝 Notes

- **Development:** Uses SQLite by default
- **Production:** Recommended to use PostgreSQL
- **Authentication:** Google OAuth is primary method
- **AI:** Uses GPT-3.5-turbo for cost efficiency
- **Maps:** Includes photo references and place details
- **Rate Limiting:** 100 requests per minute per IP

This backend provides a complete foundation for the Globe Trotter travel application with modern Python technologies and comprehensive API integrations.