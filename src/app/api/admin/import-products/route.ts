import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { products } = await request.json();

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Products must be an array' },
        { status: 400 }
      );
    }

    // Validate each product
    const validProducts = products.filter((p: any) => {
      return p.name && p.price !== undefined && p.category && p.image;
    });

    if (validProducts.length === 0) {
      return NextResponse.json(
        { error: 'No valid products found' },
        { status: 400 }
      );
    }

    // Return success - in production, save to database
    return NextResponse.json(
      {
        success: true,
        message: `Successfully imported ${validProducts.length} products`,
        count: validProducts.length,
        products: validProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to import products' },
      { status: 500 }
    );
  }
}
