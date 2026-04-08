import { MongoClient, Db, Collection } from 'mongodb';

// MongoDB connection URI - build from environment variables
const buildMongoURI = (): string => {
  const username = encodeURIComponent('muhammadofficialberlin_db_user');
  const password = encodeURIComponent('dpdhiEZ3GKqQqgTG');
  
  // Try to get cluster from env, fallback to localhost for development
  const cluster = process.env.MONGODB_CLUSTER || 'localhost:27017';
  const database = process.env.MONGODB_DATABASE || 'featured_products';
  
  // For Atlas: mongodb+srv://username:password@cluster.mongodb.net/database
  // For local: mongodb://username:password@localhost:27017/database
  if (cluster.includes('mongodb.net') || process.env.MONGODB_ATLAS === 'true') {
    return `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`;
  }
  
  return `mongodb://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`;
};

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToMongoDB(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const uri = buildMongoURI();
    
    if (!cachedClient) {
      cachedClient = new MongoClient(uri, {
        maxPoolSize: 10,
        minPoolSize: 2,
      });

      await cachedClient.connect();
      console.log('✓ Connected to MongoDB');
    }

    cachedDb = cachedClient.db('featured_products');
    return cachedDb;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('MongoDB connection failed');
  }
}

export async function getFeaturedProductsCollection(): Promise<Collection> {
  const db = await connectToMongoDB();
  const collection = db.collection('featured_products');
  
  // Ensure collection exists with proper index
  try {
    await collection.createIndex({ createdAt: 1 }, { background: true });
  } catch {
    // Index might already exist, that's fine
  }
  
  return collection;
}

export async function closeMongoDB(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log('✓ Disconnected from MongoDB');
  }
}
