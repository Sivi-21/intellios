// import mongoose from 'mongoose';
// import env from './env.js';
// import logger from '../utils/logger.js';

// let isConnected = false;

// export async function connectDatabase() {
//   if (isConnected) return mongoose.connection;

//   try {
//     mongoose.set('strictQuery', true);
//     await mongoose.connect(env.MONGODB_URI, {
//       serverSelectionTimeoutMS: 5000,
//     });
//     isConnected = true;
//     logger.info('MongoDB connected', { database: mongoose.connection.name });
//     return mongoose.connection;
//   } catch (err) {
//     logger.warn('MongoDB unavailable — running in ephemeral mode', {
//       error: err.message,
//     });
//     return null;
//   }
// }

// export function isDatabaseReady() {
//   return isConnected && mongoose.connection.readyState === 1;
// }

// export async function disconnectDatabase() {
//   if (!isConnected) return;
//   await mongoose.disconnect();
//   isConnected = false;
// }


import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export async function connectDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      logger.warn('MongoDB URI not found. Running without database.');
      return;
    }

    console.log(process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);

    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.warn('MongoDB connection failed. Running in offline mode.', {
      error: error.message,
    });
  }
}

export function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}