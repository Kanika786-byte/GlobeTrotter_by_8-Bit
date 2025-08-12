const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  bookingType: {
    type: String,
    enum: ['flight', 'hotel', 'activity', 'transport', 'package'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  
  // Financial details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentProvider: String,
  paymentReference: String,
  
  // Booking details (flexible JSON)
  bookingDetails: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  // Service dates
  bookingDate: {
    type: Date,
    default: Date.now
  },
  serviceDate: {
    type: Date,
    required: true
  },
  
  // External references
  externalBookingId: String,
  confirmationCode: String,
  
  // Metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingType: 1 });
bookingSchema.index({ serviceDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);