import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();

  // 1. If explicit URI provided in environment, attempt connection first
  if (uri) {
    try {
      console.log(`[Database] Attempting connection to MongoDB URI: ${uri}`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`[Database] Connected to external MongoDB host: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Database] External MongoDB connection failed (${err.message}). Falling back...`);
    }
  }

  // 2. Try default localhost MongoDB if not explicitly provided or if it failed
  try {
    const defaultLocalUri = 'mongodb://127.0.0.1:27017/phishguard';
    console.log(`[Database] Probing default local MongoDB instance at ${defaultLocalUri}...`);
    const conn = await mongoose.connect(defaultLocalUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] Connected to local MongoDB Community Server on port 27017.`);
    return conn;
  } catch (err) {
    console.log(`[Database] Local MongoDB Community Server is not running on port 27017.`);
  }

  // 3. Fallback to real embedded MongoDB (MongoMemoryServer)
  try {
    console.log('[Database] Initializing embedded real MongoDB instance (MongoMemoryServer)...');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[Database] Connected to embedded MongoDB engine at: ${memoryUri}`);
    console.log('[Database] Note: For persistent disk storage across restarts, install MongoDB Community Server and run the service.');
    return conn;
  } catch (error) {
    console.error('[Database] Critical: Failed to start any MongoDB instance:', error.message);
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
      mongoMemoryServer = null;
    }
  } catch (error) {
    console.error('[Database] Disconnect error:', error);
  }
};

