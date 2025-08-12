const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const Booking = require('../models/Booking');

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    
    const query = { user: req.user.userId };
    if (status) query.status = status;
    if (type) query.bookingType = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('trip', 'title startDate endDate')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Booking.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', [
  authenticateToken,
  body('bookingType').isIn(['flight', 'hotel', 'activity', 'transport', 'package']),
  body('amount').isFloat({ min: 0 }),
  body('currency').optional().isLength({ min: 3, max: 3 }),
  body('serviceDate').isISO8601(),
  body('bookingDetails').isObject(),
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

    const bookingData = {
      ...req.body,
      user: req.user.userId,
      confirmationCode: generateConfirmationCode()
    };

    const booking = new Booking(bookingData);
    await booking.save();

    // Update user stats
    await req.userDoc.updateOne({
      $inc: { 
        'stats.totalBookings': 1,
        'stats.totalSpent': req.body.amount
      }
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', [
  authenticateToken,
  param('id').isMongoId()
], async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('trip', 'title startDate endDate');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership
    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking
// @access  Private
router.put('/:id', [
  authenticateToken,
  param('id').isMongoId(),
  body('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed']),
  body('paymentStatus').optional().isIn(['pending', 'completed', 'failed', 'refunded'])
], async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership
    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update booking
    Object.assign(booking, req.body);
    await booking.save();

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });

  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.post('/:id/cancel', [
  authenticateToken,
  param('id').isMongoId(),
  body('reason').optional().trim()
], async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership
    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled'
      });
    }

    // Cancel booking
    booking.status = 'cancelled';
    if (req.body.reason) {
      booking.metadata = booking.metadata || new Map();
      booking.metadata.set('cancellationReason', req.body.reason);
    }
    
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to generate confirmation code
function generateConfirmationCode() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

module.exports = router;