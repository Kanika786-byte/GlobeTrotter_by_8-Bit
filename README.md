# GlobeTrotter_by_8-Bit
Globe Trotter - AI-Powered Travel Planning Platform
A comprehensive travel booking and itinerary planning platform with AI-powered recommendations, real-time weather data, and complete booking services.

Demo Video Link : https://app.screencastify.com/watch/9bCdhQneNs6N7eo9WtpF

Website URL : https://inspiring-fudge-c62f0b.netlify.app/

🚀 Features
AI-Powered Trip Planning - Personalized itineraries based on preferences and budget
Complete Booking Services - Flights, Hotels, Trains, Cabs all in one platform
Real-Time Weather Data - Seasonal temperature data from Kaggle for Indian destinations
Community Features - Share travel stories and find travel buddies
Multi-Currency Support - 40+ currencies with real-time conversion
Responsive Design - Works perfectly on all devices
🛠️ Tech Stack
Frontend
React 18 with TypeScript
Tailwind CSS for styling
React Router for navigation
Zustand for state management
React Hook Form for form handling
Framer Motion for animations
Backend Options
Node.js/Express with MongoDB (Primary)
Python/FastAPI with PostgreSQL (Alternative)
Supabase for database and authentication
AI & Data
OpenAI GPT for travel recommendations
Google Maps API for location services
Kaggle Datasets for real travel data
Sentiment Analysis for review processing
📊 Data Integration
Kaggle Temperature Dataset
We integrate real seasonal temperature data for Indian travel destinations:

# Import temperature data
npm run import-temperature
This adds:

Seasonal temperatures (Winter, Summer, Monsoon, Post-Monsoon)
Best time to visit recommendations
Climate-based travel suggestions
🚀 Quick Start
1. Clone and Install
git clone <repository-url>
cd globe-trotter
npm install
2. Environment Setup
cp .env.example .env
# Add your API keys to .env
3. Database Setup (Choose One)
Option A: Supabase (Recommended)
Click "Connect to Supabase" button in the app
Follow the setup guide in SUPABASE_SETUP.md
Option B: Local MongoDB
# Start MongoDB
mongod

# Seed sample data
cd backend
npm install
npm run seed
npm run dev
Option C: Python Backend
cd python-backend
pip install -r requirements.txt
python run.py
4. Import Real Data
# Import Kaggle temperature dataset
node scripts/import-temperature-data.js
5. Start Development
npm run dev
🔑 API Keys Required
Essential
Supabase URL & Key - Database and authentication
Google OAuth - Social login (optional)
Optional (for full features)
OpenAI API Key - AI travel assistant
Google Maps API Key - Location services
Stripe Keys - Payment processing
📱 Features Overview
🤖 AI Trip Planning
Input destination, days, budget, interests
Get 4 different itinerary styles:
Budget Explorer
Comfort Traveler
Luxury Experience
Adventure Seeker
Real tourist locations with images
Specific activity recommendations
✈️ Complete Booking Services
Flights - Domestic & International
Hotels - Budget to Luxury options
Trains - All classes available
Cabs - Local & Outstation
🌡️ Weather Intelligence
Seasonal temperature data for Indian destinations
Best time to visit recommendations
Climate-based activity suggestions
👥 Community Features
Share travel stories with photos
Find travel buddies by preferences
Read authentic traveler reviews
Get local insights and tips
💰 Smart Budgeting
Multi-currency support (40+ currencies)
Budget optimization across services
Real-time price comparisons
Cost-effective vs luxury options
🗂️ Project Structure
globe-trotter/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Zustand state management
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript definitions
├── backend/               # Node.js/Express backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── scripts/           # Database scripts
├── python-backend/        # Python/FastAPI backend
│   ├── app/               # FastAPI application
│   ├── routers/           # API routers
│   └── scripts/           # Utility scripts
├── scripts/               # Data import scripts
└── supabase/             # Supabase migrations
🔧 Development
Adding New Destinations
// Use the destination seeder
cd backend
node scripts/seed.js
Importing External Data
// Import Kaggle datasets
node scripts/import-temperature-data.js
Running Tests
npm test
🚀 Deployment
Frontend (Netlify)
npm run build
# Deploy dist/ folder to Netlify
Backend (Heroku/Railway)
# Set environment variables
# Deploy backend/ folder
Database (MongoDB Atlas/Supabase)
Use cloud database for production
Set up proper indexes and security
📊 Data Sources
Kaggle Datasets - Real travel and weather data
Google Maps API - Location and place data
OpenAI - AI-powered recommendations
User Generated - Reviews and travel stories
🛡️ Security Features
JWT Authentication - Secure user sessions
Row Level Security - Database access control
Input Validation - Prevent injection attacks
Rate Limiting - API abuse prevention
HTTPS Encryption - Secure data transmission
🤝 Contributing
Fork the repository
Create a feature branch
Make your changes
Add tests if applicable
Submit a pull request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🆘 Support
Documentation - Check the /docs folder
Issues - Report bugs on GitHub
Community - Join our Discord server
Email - support@globetrotter.com
🎯 Roadmap
 Mobile app (React Native)
 Offline mode support
 Advanced AI recommendations
 Group trip planning
 Travel insurance integration
 Loyalty program
 Multi-language support
Globe Trotter - Making travel planning intelligent, simple, and delightful! 🌍✈️
