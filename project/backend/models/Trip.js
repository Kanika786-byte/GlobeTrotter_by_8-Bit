const mongoose = require('mongoose');

const tripStopSchema = new mongoose.Schema({
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  sequenceOrder: {
    type: Number,
    required: true
  },
  arrivalDate: Date,
  departureDate: Date,
  notes: String,
  budget: {
    type: Number,
    default: 0
  },
  activities: [{
    name: String,
    description: String,
    estimatedCost: Number,
    duration: String,
    isBooked: {
      type: Boolean,
      default: false
    }
  }]
});

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Trip dates
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  
  // Trip details
  travelerCount: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  
  // Budget
  totalBudget: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  actualSpent: {
    type: Number,
    default: 0
  },
  
  // Trip status
  status: {
    type: String,
    enum: ['draft', 'planned', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  
  // Privacy
  privacyLevel: {
    type: String,
    enum: ['private', 'friends', 'public'],
    default: 'private'
  },
  
  // Trip stops/destinations
  stops: [tripStopSchema],
  
  // Trip type
  tripType: {
    type: String,
    enum: ['solo', 'couple', 'family', 'friends', 'business'],
    default: 'solo'
  },
  
  // Travel preferences for this trip
  preferences: {
    accommodation: {
      type: String,
      enum: ['budget', 'mid-range', 'luxury'],
      default: 'mid-range'
    },
    transportation: {
      type: String,
      enum: ['budget', 'comfort', 'luxury'],
      default: 'comfort'
    },
    activities: {
      type: String,
      enum: ['relaxed', 'moderate', 'packed'],
      default: 'moderate'
    }
  },
  
  // Sharing and collaboration
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'co-planner'],
      default: 'viewer'
    },
    invitedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Trip images
  images: [{
    url: String,
    caption: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Trip notes and documents
  notes: [{
    title: String,
    content: String,
    category: {
      type: String,
      enum: ['general', 'accommodation', 'transportation', 'activities', 'dining', 'emergency'],
      default: 'general'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
tripSchema.index({ user: 1, createdAt: -1 });
tripSchema.index({ status: 1 });
tripSchema.index({ startDate: 1, endDate: 1 });
tripSchema.index({ 'stops.destination': 1 });
tripSchema.index({ privacyLevel: 1 });

// Validation
tripSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

// Calculate trip duration
tripSchema.virtual('duration').get(function() {
  const diffTime = Math.abs(this.endDate - this.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Get trip progress
tripSchema.virtual('progress').get(function() {
  const now = new Date();
  if (now < this.startDate) return 0;
  if (now > this.endDate) return 100;
  
  const totalDuration = this.endDate - this.startDate;
  const elapsed = now - this.startDate;
  return Math.round((elapsed / totalDuration) * 100);
});

module.exports = mongoose.model('Trip', tripSchema);