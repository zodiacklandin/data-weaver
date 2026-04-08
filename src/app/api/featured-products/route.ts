import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedProductsCollection } from '@/lib/mongodb-client';
import { ObjectId } from 'mongodb';

// Fallback storage for when MongoDB is unavailable
const fallbackStorage: { ids: string[] } = { ids: [] };

// Get featured products from MongoDB or fallback
async function getFeaturedProducts(): Promise<string[]> {
  try {
    const collection = await getFeaturedProductsCollection();
    
    // Find the featured products document (there should be only one)
    const doc = await collection.findOne({});
    
    if (!doc) {
      // First time - no document exists yet
      return [];
    }
    
    return doc.productIds || [];
  } catch (error) {
    console.error('Error fetching from MongoDB:', error);
    console.log('Falling back to in-memory storage');
    return fallbackStorage.ids;
  }
}

// Save featured products to MongoDB or fallback
async function saveFeaturedProducts(productIds: string[]): Promise<boolean> {
  try {
    const collection = await getFeaturedProductsCollection();
    
    // Get existing document (if any)
    const existing = await collection.findOne({});
    
    if (existing?._id) {
      // Update existing document
      const result = await collection.updateOne(
        { _id: existing._id },
        {
          $set: {
            productIds: productIds,
            updatedAt: new Date(),
          },
        }
      );
      
      return result.modifiedCount > 0 || result.upsertedCount > 0;
    } else {
      // Insert new document
      const result = await collection.insertOne({
        productIds: productIds,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      return !!result.insertedId;
    }
  } catch (error) {
    console.error('Error saving to MongoDB:', error);
    console.log('Falling back to in-memory storage');
    fallbackStorage.ids = productIds;
    return true;
  }
}

// GET - Retrieve featured products
export async function GET() {
  try {
    const featuredProductIds = await getFeaturedProducts();
    
    return NextResponse.json({
      featuredProductIds,
      source: 'mongodb',
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured products', source: 'error' },
      { status: 500 }
    );
  }
}

// POST - Update featured products
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { featuredProductIds } = body;

    // Validate input
    if (!Array.isArray(featuredProductIds)) {
      return NextResponse.json(
        { error: 'featuredProductIds must be an array' },
        { status: 400 }
      );
    }

    // Save to MongoDB
    const success = await saveFeaturedProducts(featuredProductIds);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save featured products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      featuredProductIds,
      source: 'mongodb',
      message: 'Featured products updated successfully',
    });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Failed to update featured products' },
      { status: 500 }
    );
  }
}
