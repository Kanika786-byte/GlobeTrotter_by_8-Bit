const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  continent: {
    type: String,
    required: true,
    enum: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania']
  },
  
  // Location data
  coordinates: {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    }
  },
  
  // Content
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 500
  },
  
  // Images
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Categories and activities
  activityCategories: [{
    type: String,
    enum: ['Adventure', 'Culture', 'Food', 'Nature', 'Nightlife', 'Relaxation', 'Shopping', 'Sports', 'History', 'Art', 'Beach', 'Mountains', 'Urban']
  }],
  
  // Ratings and reviews
  avgRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  
  // Pricing information
  averagePrice: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  priceRange: {
    type: String,
    enum: ['budget', 'mid-range', 'luxury'],
    required: true
  },
  
  // Travel information
  bestTimeToVisit: [{
    month: {
      type: String,
      enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    },
    reason: String
  }],
  
  avgTemperature: {
    type: Number
  },
  
  // Safety and practical info
  safetyIndex: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  
  visaRequired: {
    type: Boolean,
    default: false
  },
  
  languages: [String],
  
  timezone: String,
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // SEO
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  
  // External IDs
  googlePlaceId: String,
  
  // Seasonal temperature data from Kaggle
  seasonalTemperatures: {
    winter: Number,
    summer: Number,
    monsoon: Number,
    postMonsoon: Number,
    bestTime: String
  },
  
  // Metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
destinationSchema.index({ name: 'text', description: 'text', city: 'text', country: 'text' });
destinationSchema.index({ coordinates: '2dsphere' });
destinationSchema.index({ country: 1, avgRating: -1 });
destinationSchema.index({ continent: 1, avgRating: -1 });
destinationSchema.index({ activityCategories: 1 });
destinationSchema.index({ avgRating: -1 });
destinationSchema.index({ averagePrice: 1 });
destinationSchema.index({ isFeatured: 1, avgRating: -1 });
destinationSchema.index({ isActive: 1 });
destinationSchema.index({ slug: 1 });

// Generate slug before saving
destinationSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Update average rating
destinationSchema.methods.updateRating = async function() {
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    { $match: { destination: this._id, isApproved: true } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  if (stats.length > 0) {
    this.avgRating = Math.round(stats[0].avgRating * 10) / 10;
    this.reviewCount = stats[0].count;
  } else {
    this.avgRating = 0;
    this.reviewCount = 0;
  }
  
  await this.save();
};

module.exports = mongoose.model('Destination', destinationSchema);