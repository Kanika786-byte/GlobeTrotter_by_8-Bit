const mongoose = require('mongoose');
require('dotenv').config();

const Destination = require('../models/Destination');

// Sample destinations data
const destinations = [
  {
    name: 'Goa',
    city: 'Panaji',
    country: 'India',
    continent: 'Asia',
    coordinates: {
      latitude: 15.2993,
      longitude: 74.1240
    },
    description: 'Goa is a state in western India with coastlines stretching along the Arabian Sea. Its long history as a Portuguese colony prior to 1961 is evident in its preserved 17th-century churches and the area\'s tropical spice plantations. Goa is also known for its beaches, ranging from popular stretches at Baga and Palolem to those in laid-back fishing villages such as Agonda.',
    shortDescription: 'Beautiful beaches and Portuguese heritage',
    activityCategories: ['Beach', 'Culture', 'Nightlife', 'Food', 'Adventure'],
    avgRating: 4.5,
    reviewCount: 2847,
    averagePrice: 3500,
    currency: 'INR',
    priceRange: 'mid-range',
    safetyIndex: 85,
    avgTemperature: 28,
    languages: ['English', 'Hindi', 'Konkani'],
    timezone: 'Asia/Kolkata',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    continent: 'Asia',
    coordinates: {
      latitude: 25.2048,
      longitude: 55.2708
    },
    description: 'Dubai is a city and emirate in the United Arab Emirates known for luxury shopping, ultramodern architecture and a lively nightlife scene. Burj Khalifa, an 830m-tall tower, dominates the skyscraper-filled skyline. At its foot lies Dubai Fountain, with jets and lights choreographed to music.',
    shortDescription: 'Luxury shopping and modern architecture',
    activityCategories: ['Urban', 'Shopping', 'Culture', 'Adventure', 'Luxury'],
    avgRating: 4.7,
    reviewCount: 5234,
    averagePrice: 15000,
    currency: 'AED',
    priceRange: 'luxury',
    safetyIndex: 95,
    avgTemperature: 32,
    languages: ['Arabic', 'English'],
    timezone: 'Asia/Dubai',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Bangkok',
    city: 'Bangkok',
    country: 'Thailand',
    continent: 'Asia',
    coordinates: {
      latitude: 13.7563,
      longitude: 100.5018
    },
    description: 'Bangkok, Thailand\'s capital, is a large city known for ornate shrines and vibrant street life. The boat-filled Chao Phraya River feeds its network of canals, flowing past the Rattanakosin royal district, home to opulent Grand Palace and its sacred Wat Phra Kaew Temple.',
    shortDescription: 'Vibrant street life and ornate temples',
    activityCategories: ['Culture', 'Food', 'Urban', 'Shopping', 'Nightlife'],
    avgRating: 4.6,
    reviewCount: 4156,
    averagePrice: 8000,
    currency: 'THB',
    priceRange: 'budget',
    safetyIndex: 78,
    avgTemperature: 30,
    languages: ['Thai', 'English'],
    timezone: 'Asia/Bangkok',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Singapore',
    city: 'Singapore',
    country: 'Singapore',
    continent: 'Asia',
    coordinates: {
      latitude: 1.3521,
      longitude: 103.8198
    },
    description: 'Singapore, an island city-state off southern Malaysia, is a global financial center with a tropical climate and multicultural population. Its colonial core centers on the Padang, a cricket field since the 1830s and now flanked by grand buildings such as City Hall, with its 18 Corinthian columns.',
    shortDescription: 'Modern city-state with multicultural charm',
    activityCategories: ['Urban', 'Culture', 'Food', 'Shopping', 'Nature'],
    avgRating: 4.5,
    reviewCount: 3892,
    averagePrice: 18000,
    currency: 'SGD',
    priceRange: 'luxury',
    safetyIndex: 98,
    avgTemperature: 27,
    languages: ['English', 'Mandarin', 'Malay', 'Tamil'],
    timezone: 'Asia/Singapore',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Kerala',
    city: 'Kochi',
    country: 'India',
    continent: 'Asia',
    coordinates: {
      latitude: 10.8505,
      longitude: 76.2711
    },
    description: 'Kerala, a state on India\'s tropical Malabar Coast, has nearly 600km of Arabian Sea shoreline. It\'s known for its palm-lined beaches and backwaters, a network of canals. Inland are the Western Ghats, mountains whose slopes support tea, coffee and spice plantations as well as wildlife preserves.',
    shortDescription: 'Backwaters and spice plantations',
    activityCategories: ['Nature', 'Culture', 'Relaxation', 'Adventure', 'Food'],
    avgRating: 4.4,
    reviewCount: 2156,
    averagePrice: 4500,
    currency: 'INR',
    priceRange: 'mid-range',
    safetyIndex: 88,
    avgTemperature: 26,
    languages: ['Malayalam', 'English', 'Hindi'],
    timezone: 'Asia/Kolkata',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Rajasthan',
    city: 'Jaipur',
    country: 'India',
    continent: 'Asia',
    coordinates: {
      latitude: 26.9124,
      longitude: 75.7873
    },
    description: 'Rajasthan is a northern Indian state bordering Pakistan. Its palaces and forts are reminders of the many kingdoms that historically vied for control of the region. In its capital, Jaipur (the "Pink City"), are the 18th-century City Palace and Hawa Mahal, a former cloister for royal women, fronted by a 5-story pink sandstone screen.',
    shortDescription: 'Royal palaces and desert landscapes',
    activityCategories: ['Culture', 'History', 'Adventure', 'Art', 'Shopping'],
    avgRating: 4.3,
    reviewCount: 3421,
    averagePrice: 3800,
    currency: 'INR',
    priceRange: 'mid-range',
    safetyIndex: 82,
    avgTemperature: 29,
    languages: ['Hindi', 'Rajasthani', 'English'],
    timezone: 'Asia/Kolkata',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Bali',
    city: 'Denpasar',
    country: 'Indonesia',
    continent: 'Asia',
    coordinates: {
      latitude: -8.3405,
      longitude: 115.0920
    },
    description: 'Bali is a province of Indonesia and the westernmost of the Lesser Sunda Islands. East of Java and west of Lombok, the province includes the island of Bali and a few smaller neighbouring islands, notably Nusa Penida, Nusa Lembongan, and Nusa Ceningan.',
    shortDescription: 'Tropical paradise with rich culture',
    activityCategories: ['Beach', 'Culture', 'Nature', 'Adventure', 'Relaxation'],
    avgRating: 4.6,
    reviewCount: 6789,
    averagePrice: 6500,
    currency: 'IDR',
    priceRange: 'mid-range',
    safetyIndex: 85,
    avgTemperature: 28,
    languages: ['Indonesian', 'Balinese', 'English'],
    timezone: 'Asia/Makassar',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Maldives',
    city: 'Malé',
    country: 'Maldives',
    continent: 'Asia',
    coordinates: {
      latitude: 3.2028,
      longitude: 73.2207
    },
    description: 'The Maldives is a tropical nation in the Indian Ocean composed of 26 ring-shaped atolls, which are made up of more than 1,000 coral islands. It\'s known for its beaches, blue lagoons and extensive reefs. The capital, Malé, has a busy fish market, restaurants and shops on the main road, Majeedhee Magu.',
    shortDescription: 'Pristine beaches and crystal clear waters',
    activityCategories: ['Beach', 'Relaxation', 'Adventure', 'Luxury', 'Nature'],
    avgRating: 4.8,
    reviewCount: 2341,
    averagePrice: 25000,
    currency: 'MVR',
    priceRange: 'luxury',
    safetyIndex: 92,
    avgTemperature: 29,
    languages: ['Dhivehi', 'English'],
    timezone: 'Indian/Maldives',
    isActive: true,
    isFeatured: true
  }
];

const seedDestinations = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/globe-trotter');
    console.log('Connected to MongoDB');

    // Clear existing destinations
    await Destination.deleteMany({});
    console.log('Cleared existing destinations');

    // Insert new destinations
    const insertedDestinations = await Destination.insertMany(destinations);
    console.log(`Inserted ${insertedDestinations.length} destinations`);

    console.log('Seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding
seedDestinations();