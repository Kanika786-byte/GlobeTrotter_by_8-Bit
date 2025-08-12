const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Trip = require('../models/Trip');
const Destination = require('../models/Destination');
const { authenticateToken, checkOwnership } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/trips
// @desc    Get user's trips
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { user: req.user.userId };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [trips, total] = await Promise.all([
      Trip.find(query)
        .populate('stops.destination', 'name city country coordinates images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Trip.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: trips,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/trips
// @desc    Create new trip
// @access  Private
router.post('/', [
  authenticateToken,
  body('title').trim().isLength({ min: 1, max: 255 }),
  body('description').optional().trim(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  body('travelerCount').isInt({ min: 1 }),
  body('totalBudget').isFloat({ min: 0 }),
  body('currency').optional().isLength({ min: 3, max: 3 }),
  body('privacyLevel').optional().isIn(['private', 'friends', 'public'])
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

    const tripData = {
      ...req.body,
      user: req.user.userId
    };

    // Validate dates
    if (new Date(tripData.endDate) <= new Date(tripData.startDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const trip = new Trip(tripData);
    await trip.save();

    // Update user stats
    await req.userDoc.updateOne({
      $inc: { 'stats.totalTrips': 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: trip
    });

  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/trips/:id
// @desc    Get single trip
// @access  Private
router.get('/:id', [
  authenticateToken,
  param('id').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trip ID'
      });
    }

    const trip = await Trip.findById(req.params.id)
      .populate('stops.destination', 'name city country coordinates images avgRating reviewCount')
      .populate('sharedWith.user', 'firstName lastName email profileImageUrl');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check if user has access to this trip
    const hasAccess = trip.user.toString() === req.user.userId ||
                     trip.sharedWith.some(share => share.user._id.toString() === req.user.userId) ||
                     trip.privacyLevel === 'public';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: trip
    });

  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/trips/:id
// @desc    Update trip
// @access  Private
router.put('/:id', [
  authenticateToken,
  param('id').isMongoId(),
  body('title').optional().trim().isLength({ min: 1, max: 255 }),
  body('description').optional().trim(),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('travelerCount').optional().isInt({ min: 1 }),
  body('totalBudget').optional().isFloat({ min: 0 }),
  body('status').optional().isIn(['draft', 'planned', 'active', 'completed', 'cancelled']),
  body('privacyLevel').optional().isIn(['private', 'friends', 'public'])
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

    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check ownership
    if (trip.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Validate dates if provided
    const startDate = req.body.startDate || trip.startDate;
    const endDate = req.body.endDate || trip.endDate;
    
    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Update trip
    Object.assign(trip, req.body);
    await trip.save();

    res.json({
      success: true,
      message: 'Trip updated successfully',
      data: trip
    });

  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/trips/:id
// @desc    Delete trip
// @access  Private
router.delete('/:id', [
  authenticateToken,
  param('id').isMongoId()
], async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check ownership
    if (trip.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Trip.findByIdAndDelete(req.params.id);

    // Update user stats
    await req.userDoc.updateOne({
      $inc: { 'stats.totalTrips': -1 }
    });

    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });

  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/trips/:id/stops
// @desc    Add stop to trip
// @access  Private
router.post('/:id/stops', [
  authenticateToken,
  param('id').isMongoId(),
  body('destination').isMongoId(),
  body('sequenceOrder').isInt({ min: 1 }),
  body('arrivalDate').optional().isISO8601(),
  body('departureDate').optional().isISO8601(),
  body('notes').optional().trim(),
  body('budget').optional().isFloat({ min: 0 })
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

    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check ownership
    if (trip.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Verify destination exists
    const destination = await Destination.findById(req.body.destination);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Add stop
    trip.stops.push(req.body);
    await trip.save();

    // Populate the new stop
    await trip.populate('stops.destination', 'name city country coordinates images');

    res.status(201).json({
      success: true,
      message: 'Stop added to trip',
      data: trip
    });

  } catch (error) {
    console.error('Add trip stop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;