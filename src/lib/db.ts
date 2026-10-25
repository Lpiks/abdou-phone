import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
  isOffline: boolean;
  lastFailureTime: number;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  isOffline: false,
  lastFailureTime: 0,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

const OFFLINE_COOLDOWN_MS = 30_000;

export async function connectDB(): Promise<typeof mongoose | null> {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  const rawUri = process.env.MONGODB_URI?.trim();
  if (!rawUri || rawUri.includes('<username>') || rawUri.includes('<password>')) {
    return null;
  }

  const now = Date.now();
  if (cached.isOffline && now - cached.lastFailureTime < OFFLINE_COOLDOWN_MS) {
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    };

    cached.promise = mongoose
      .connect(rawUri, opts)
      .then((m) => {
        cached.isOffline = false;
        return m;
      })
      .catch((err) => {
        cached.isOffline = true;
        cached.lastFailureTime = Date.now();
        cached.promise = null;
        console.warn('[Abdou Phone DB] MongoDB offline, operating in resilient memory/hybrid mode:', err.message);
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch {
    cached.conn = null;
  }

  return cached.conn;
}
