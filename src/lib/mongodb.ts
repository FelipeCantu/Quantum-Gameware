// src/lib/mongodb.ts - FIXED VERSION FOR VERCEL
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare global variable for caching
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseConnection | undefined;
}

// Initialize cached connection
const cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  // If we have a cached connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If we don't have a promise, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      retryReads: true,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 30000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ Connected to MongoDB successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        cached.promise = null;
        
        if (error.name === 'MongoNetworkError') {
          throw new Error('Database network error. Please check your connection string and network access.');
        } else if (error.name === 'MongoServerSelectionError') {
          throw new Error('Could not connect to MongoDB server. Please check your database configuration.');
        } else if (error.message?.includes('authentication')) {
          throw new Error('Database authentication failed. Please check your credentials.');
        } else {
          throw new Error(`Database connection failed: ${error.message}`);
        }
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

// Alternative function name for backward compatibility
export const connectToDatabase = connectDB;

// Function to disconnect from MongoDB
export async function disconnectDB(): Promise<void> {
  try {
    if (cached.conn) {
      await mongoose.disconnect();
      cached.conn = null;
      cached.promise = null;
      console.log('✅ Disconnected from MongoDB');
    }
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
  }
}

// Function to check connection status
export function getConnectionStatus(): string {
  const state = mongoose.connection.readyState;
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[state] || 'unknown';
}

// Health check function for monitoring
export async function healthCheck(): Promise<{ status: string; database?: string; host?: string }> {
  try {
    if (cached.conn && mongoose.connection.readyState === 1) {
      return {
        status: 'healthy',
        database: mongoose.connection.db?.databaseName,
        host: mongoose.connection.host || undefined
      };
    } else {
      return { status: 'disconnected' };
    }
  } catch (error) {
    return { status: 'error' };
  }
}