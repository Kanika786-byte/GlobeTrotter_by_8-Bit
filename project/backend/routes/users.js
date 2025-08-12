const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  authenticateToken,
  body('firstName').optional().trim().isLength({ min: 1, max: 100 }),
  body('lastName').optional().trim().isLength({ min: 1, max: 100 }),
  body('profileImageUrl').optional().isURL(),
  body('travelPreferences').optional().isObject(),
  body('privacySettings').optional().isObject()
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

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user fields
    const allowedUpdates = [
      'firstName', 
      'lastName', 
      'profileImageUrl', 
      'travelPreferences', 
      'privacySettings'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get additional stats from related collections
    const [tripStats, bookingStats, reviewStats] = await Promise.all([
      Trip.aggregate([
        { $match: { user: user._id } },
        {
          $group: {
            _id: null,
            totalTrips: { $sum: 1 },
            completedTrips: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            totalBudget: { $sum: '$totalBudget' }
          }
        }
      ]),
      Booking.aggregate([
        { $match: { user: user._id, paymentStatus: 'completed' } },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            totalSpent: { $sum: '$amount' }
          }
        }
      ]),
      Review.aggregate([
        { $match: { user: user._id } },
        {
          $group: {
            _id: null,
            totalReviews: { $sum: 1 },
            avgRating: { $avg: '$rating' }
          }
        }
      ])
    ]);

    const stats = {
      ...user.stats.toObject(),
      totalTrips: tripStats[0]?.totalTrips || 0,
      completedTrips: tripStats[0]?.completedTrips || 0,
      totalBudget: tripStats[0]?.totalBudget || 0,
      totalBookings: bookingStats[0]?.totalBookings || 0,
      totalSpent: bookingStats[0]?.totalSpent || 0,
      totalReviews: reviewStats[0]?.totalReviews || 0,
      avgReviewRating: reviewStats[0]?.avgRating || 0,
      memberSince: user.createdAt,
      yearsActive: Math.max(0, (new Date() - user.createdAt) / (1000 * 60 * 60 * 24 * 365))
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - mark as inactive instead of hard delete
    user.isActive = false;
    user.email = `deleted_${Date.now()}_${user.email}`;
    await user.save();

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;