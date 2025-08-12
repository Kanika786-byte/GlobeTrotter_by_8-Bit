const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  
  // Review content
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: 255
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  
  // Moderation
  isApproved: {
    type: Boolean,
    default: true // Auto-approve for now
  },
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  moderationReason: String,
  
  // Analytics
  sentimentScore: Number,
  helpfulVotes: {
    type: Number,
    default: 0
  },
  
  // Images
  images: [{
    url: String,
    caption: String
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
reviewSchema.index({ destination: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ isApproved: 1, moderationStatus: 1 });

// Update destination rating after review save
reviewSchema.post('save', async function() {
  const destination = await mongoose.model('Destination').findById(this.destination);
  if (destination) {
    await destination.updateRating();
  }
});

module.exports = mongoose.model('Review', reviewSchema);