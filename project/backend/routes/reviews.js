const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Destination = require('../models/Destination');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews/destination/:destinationId
// @desc    Get reviews for a destination
// @access  Public
router.get('/destination/:destinationId', [
  param('destinationId').isMongoId(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('sort').optional().isIn(['newest', 'oldest', 'rating_high', 'rating_low', 'helpful'])
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { page = 1, limit = 20, sort = 'newest' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'rating_high':
        sortObj = { rating: -1, createdAt: -1 };
        break;
      case 'rating_low':
        sortObj = { rating: 1, createdAt: -1 };
        break;
      case 'helpful':
        sortObj = { helpfulVotes: -1, createdAt: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const [reviews, total] = await Promise.all([
      Review.find({
        destination: req.params.destinationId,
        isApproved: true
      })
      .populate('user', 'firstName lastName profileImageUrl')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit)),
      Review.countDocuments({
        destination: req.params.destinationId,
        isApproved: true
      })
    ]);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get destination reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private
router.post('/', [
  authenticateToken,
  body('destination').isMongoId(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('title').optional().trim().isLength({ max: 255 }),
  body('content').trim().isLength({ min: 10, max: 2000 }),
  body('trip').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if destination exists
    const destination = await Destination.findById(req.body.destination);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Check if user already reviewed this destination
    const existingReview = await Review.findOne({
      user: req.user.userId,
      destination: req.body.destination
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this destination'
      });
    }

    const reviewData = {
      ...req.body,
      user: req.user.userId
    };

    const review = new Review(reviewData);
    await review.save();

    // Populate user data for response
    await review.populate('user', 'firstName lastName profileImageUrl');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/reviews/user
// @desc    Get user's reviews
// @access  Private
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ user: req.user.userId })
        .populate('destination', 'name city country images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments({ user: req.user.userId })
    ]);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', [
  authenticateToken,
  param('id').isMongoId(),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('title').optional().trim().isLength({ max: 255 }),
  body('content').optional().trim().isLength({ min: 10, max: 2000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership
    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update review
    Object.assign(review, req.body);
    await review.save();

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', [
  authenticateToken,
  param('id').isMongoId()
], async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership
    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Update destination rating
    const destination = await Destination.findById(review.destination);
    if (destination) {
      await destination.updateRating();
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.post('/:id/helpful', [
  authenticateToken,
  param('id').isMongoId()
], async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Increment helpful votes
    review.helpfulVotes += 1;
    await review.save();

    res.json({
      success: true,
      message: 'Review marked as helpful',
      data: { helpfulVotes: review.helpfulVotes }
    });

  } catch (error) {
    console.error('Mark review helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;