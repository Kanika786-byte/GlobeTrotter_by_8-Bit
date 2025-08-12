import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { TripsPage } from './pages/TripsPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { FlightsPage } from './pages/FlightsPage';
import { HotelsPage } from './pages/HotelsPage';
import { TrainsPage } from './pages/TrainsPage';
import { CabsPage } from './pages/CabsPage';
import { BookingsPage } from './pages/BookingsPage';
import { CommunityPage } from './pages/CommunityPage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { BookingPage } from './pages/BookingPage';
import { TripDetailPage } from './pages/TripDetailPage';
import { BookingDetailPage } from './pages/BookingDetailPage';
import { ItineraryBookingPage } from './pages/ItineraryBookingPage';
import { AuthCallback } from './components/auth/AuthCallback';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { ChatBot } from './components/chat';
import { PlanTripPage } from './pages/PlanTripPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/trips" element={<Layout><TripsPage /></Layout>} />
          <Route path="/plan-trip" element={<Layout><PlanTripPage /></Layout>} />
          <Route path="/my-trips" element={<Layout><MyTripsPage /></Layout>} />
          <Route path="/flights" element={<Layout><FlightsPage /></Layout>} />
          <Route path="/hotels" element={<Layout><HotelsPage /></Layout>} />
          <Route path="/trains" element={<Layout><TrainsPage /></Layout>} />
          <Route path="/cabs" element={<Layout><CabsPage /></Layout>} />
          <Route path="/community" element={<Layout><CommunityPage /></Layout>} />
          <Route path="/bookings" element={<Layout><BookingsPage /></Layout>} />
          <Route path="/destinations/:destinationId" element={<Layout><DestinationDetailPage /></Layout>} />
          <Route path="/book/:destinationId" element={<Layout><BookingPage /></Layout>} />
          <Route path="/book/itinerary" element={<Layout><ItineraryBookingPage /></Layout>} />
          <Route path="/book/services" element={<Layout><BookingPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/trips/:tripId" element={<Layout><TripDetailPage /></Layout>} />
          <Route path="/bookings/:bookingId" element={<Layout><BookingDetailPage /></Layout>} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
        
        <ChatBot />
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;