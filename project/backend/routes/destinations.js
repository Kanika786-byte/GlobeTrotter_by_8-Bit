const express = require('express');
const { query, validationResult } = require('express-validator');
const Destination = require('../models/Destination');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/destinations
// @desc    Get destinations with filtering and search
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim(),
  query('country').optional().trim(),
  query('continent').optional().trim(),
  query('minRating').optional().isFloat({ min: 0, max: 5 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('categories').optional(),
  query('sortBy').optional().isIn(['name', 'rating', 'price', 'popularity']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
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

    const {
      page = 1,
      limit = 20,
      search,
      country,
      continent,
      minRating,
      maxPrice,
      categories,
      sortBy = 'rating',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (country) query.country = new RegExp(country, 'i');
    if (continent) query.continent = continent;
    if (minRating) query.avgRating = { $gte: parseFloat(minRating) };
    if (maxPrice) query.averagePrice = { $lte: parseFloat(maxPrice) };
    
    if (categories) {
      const categoryArray = categories.split(',').map(cat => cat.trim());
      query.activityCategories = { $in: categoryArray };
    }

    // Build sort object
    const sortObj = {};
    switch (sortBy) {
      case 'name':
        sortObj.name = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'price':
        sortObj.averagePrice = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'popularity':
        sortObj.reviewCount = sortOrder === 'desc' ? -1 : 1;
        break;
      default:
        sortObj.avgRating = sortOrder === 'desc' ? -1 : 1;
    }

    // Add secondary sort by rating if not primary
    if (sortBy !== 'rating') {
      sortObj.avgRating = -1;
    }

    // Execute query
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [destinations, total] = await Promise.all([
      Destination.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-metadata'),
      Destination.countDocuments(query)
    ]);

    // Add image URLs (using Pexels as placeholder)
    const destinationsWithImages = destinations.map(dest => {
      const destObj = dest.toObject();
      if (!destObj.images || destObj.images.length === 0) {
        destObj.imageUrl = `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=800`;
      } else {
        destObj.imageUrl = destObj.images.find(img => img.isPrimary)?.url || destObj.images[0]?.url;
      }
      return destObj;
    });

    res.json({
      success: true,
      data: destinationsWithImages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/destinations/featured
// @desc    Get featured destinations
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const destinations = await Destination.find({
      isActive: true,
      isFeatured: true
    })
    .sort({ avgRating: -1 })
    .limit(8)
    .select('-metadata');

    // Add image URLs
    const destinationsWithImages = destinations.map(dest => {
      const destObj = dest.toObject();
      if (!destObj.images || destObj.images.length === 0) {
        destObj.imageUrl = `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=800`;
      } else {
        destObj.imageUrl = destObj.images.find(img => img.isPrimary)?.url || destObj.images[0]?.url;
      }
      return destObj;
    });

    res.json({
      success: true,
      data: destinationsWithImages
    });

  } catch (error) {
    console.error('Get featured destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/destinations/:id
// @desc    Get single destination
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const destination = await Destination.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    const destObj = destination.toObject();
    
    // Add image URL
    if (!destObj.images || destObj.images.length === 0) {
      destObj.imageUrl = `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=800`;
    } else {
      destObj.imageUrl = destObj.images.find(img => img.isPrimary)?.url || destObj.images[0]?.url;
    }

    res.json({
      success: true,
      data: destObj
    });

  } catch (error) {
    console.error('Get destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/destinations/search/nearby
// @desc    Search destinations near coordinates
// @access  Public
router.get('/search/nearby', [
  query('lat').isFloat({ min: -90, max: 90 }),
  query('lng').isFloat({ min: -180, max: 180 }),
  query('radius').optional().isInt({ min: 1, max: 1000 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
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

    const { lat, lng, radius = 100, limit = 20 } = req.query;

    const destinations = await Destination.find({
      isActive: true,
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000 // Convert km to meters
        }
      }
    })
    .limit(parseInt(limit))
    .select('-metadata');

    // Add image URLs
    const destinationsWithImages = destinations.map(dest => {
      const destObj = dest.toObject();
      if (!destObj.images || destObj.images.length === 0) {
        destObj.imageUrl = `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=800`;
      } else {
        destObj.imageUrl = destObj.images.find(img => img.isPrimary)?.url || destObj.images[0]?.url;
      }
      return destObj;
    });

    res.json({
      success: true,
      data: destinationsWithImages
    });

  } catch (error) {
    console.error('Nearby search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;