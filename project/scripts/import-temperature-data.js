const kagglehub = require('kagglehub');
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();

// Import models
const Destination = require('../backend/models/Destination');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/globe-trotter');
    console.log('📊 Connected to MongoDB');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const downloadAndProcessTemperatureData = async () => {
  try {
    console.log('📥 Downloading temperature dataset from Kaggle...');
    
    // Download the dataset
    const path = await kagglehub.datasetDownload("sandippalit009/seasonal-temperature-of-indian-travel-destinations");
    console.log("📁 Dataset downloaded to:", path);
    
    // Find CSV files in the downloaded directory
    const files = fs.readdirSync(path);
    const csvFile = files.find(file => file.endsWith('.csv'));
    
    if (!csvFile) {
      throw new Error('No CSV file found in the dataset');
    }
    
    const csvPath = `${path}/${csvFile}`;
    console.log('📄 Processing CSV file:', csvPath);
    
    const temperatureData = [];
    
    // Read and parse CSV
    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          // Process each row of temperature data
          temperatureData.push({
            destination: row.Destination || row.destination || row.city,
            state: row.State || row.state,
            winter_temp: parseFloat(row['Winter Temperature'] || row.winter_temp || row.winter),
            summer_temp: parseFloat(row['Summer Temperature'] || row.summer_temp || row.summer),
            monsoon_temp: parseFloat(row['Monsoon Temperature'] || row.monsoon_temp || row.monsoon),
            post_monsoon_temp: parseFloat(row['Post Monsoon Temperature'] || row.post_monsoon_temp || row.post_monsoon),
            best_time: row['Best Time to Visit'] || row.best_time || 'Year Round'
          });
        })
        .on('end', () => {
          console.log(`✅ Processed ${temperatureData.length} temperature records`);
          resolve(temperatureData);
        })
        .on('error', reject);
    });
  } catch (error) {
    console.error('❌ Error downloading dataset:', error);
    throw error;
  }
};

const updateDestinationsWithTemperatureData = async (temperatureData) => {
  console.log('🔄 Updating destinations with temperature data...');
  
  let updatedCount = 0;
  let newDestinationsCount = 0;
  
  for (const tempData of temperatureData) {
    try {
      // Try to find existing destination by name or city
      let destination = await Destination.findOne({
        $or: [
          { name: new RegExp(tempData.destination, 'i') },
          { city: new RegExp(tempData.destination, 'i') }
        ]
      });
      
      if (destination) {
        // Update existing destination with temperature data
        destination.avgTemperature = (tempData.winter_temp + tempData.summer_temp + tempData.monsoon_temp + tempData.post_monsoon_temp) / 4;
        destination.metadata = destination.metadata || new Map();
        destination.metadata.set('seasonalTemperatures', {
          winter: tempData.winter_temp,
          summer: tempData.summer_temp,
          monsoon: tempData.monsoon_temp,
          postMonsoon: tempData.post_monsoon_temp,
          bestTime: tempData.best_time
        });
        
        await destination.save();
        updatedCount++;
        console.log(`✅ Updated ${destination.name} with temperature data`);
      } else {
        // Create new destination if it doesn't exist
        const newDestination = new Destination({
          name: tempData.destination,
          city: tempData.destination,
          country: 'India',
          continent: 'Asia',
          coordinates: {
            latitude: 20.5937, // Default to center of India
            longitude: 78.9629
          },
          description: `${tempData.destination} is a beautiful destination in ${tempData.state}, India, known for its unique climate and attractions.`,
          shortDescription: `Explore ${tempData.destination} in ${tempData.state}`,
          avgRating: 4.0,
          reviewCount: 0,
          averagePrice: 3000, // Default price
          currency: 'INR',
          priceRange: 'mid-range',
          safetyIndex: 80,
          avgTemperature: (tempData.winter_temp + tempData.summer_temp + tempData.monsoon_temp + tempData.post_monsoon_temp) / 4,
          activityCategories: ['Culture', 'Nature'],
          isActive: true,
          isFeatured: false,
          metadata: new Map([
            ['seasonalTemperatures', {
              winter: tempData.winter_temp,
              summer: tempData.summer_temp,
              monsoon: tempData.monsoon_temp,
              postMonsoon: tempData.post_monsoon_temp,
              bestTime: tempData.best_time
            }],
            ['dataSource', 'Kaggle - Seasonal Temperature Dataset']
          ])
        });
        
        await newDestination.save();
        newDestinationsCount++;
        console.log(`🆕 Created new destination: ${tempData.destination}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${tempData.destination}:`, error.message);
    }
  }
  
  console.log(`\n📊 Import Summary:`);
  console.log(`   Updated existing destinations: ${updatedCount}`);
  console.log(`   Created new destinations: ${newDestinationsCount}`);
  console.log(`   Total processed: ${temperatureData.length}`);
};

const main = async () => {
  try {
    await connectDB();
    
    const temperatureData = await downloadAndProcessTemperatureData();
    await updateDestinationsWithTemperatureData(temperatureData);
    
    console.log('\n🎉 Temperature data import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Import failed:', error);
    process.exit(1);
  }
};

// Run the import
main();