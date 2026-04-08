import { NextRequest, NextResponse } from 'next/server';

const LITBUY_API_URL = 'https://gateway.litbuy.com/unified-service/logistics-hub/projection/global-two';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackingNumber } = body;

    if (!trackingNumber) {
      return NextResponse.json(
        {
          code: 400,
          message: 'Tracking number is required',
        },
        { status: 400 }
      );
    }

    // Call Litbuy shipping estimate API
    const response = await fetch(LITBUY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        trackingNumber: trackingNumber.trim(),
      }),
    });

    const data = await response.json();

    // Transform the response to match our UI expectations
    if (data.code === 200 || data.success) {
      const shippingData = data.data || data;
      
      return NextResponse.json({
        code: 200,
        message: 'Success',
        data: {
          tracking_number: trackingNumber,
          carrier_id: 'Litbuy',
          order_status_code: data.code,
          status: shippingData.status || 'In Transit',
          estimatedDelivery: shippingData.estimatedDelivery || 'Pending',
          currentLocation: shippingData.currentLocation || 'In Transit',
          items: shippingData.items || [],
          raw_data: shippingData,
        },
      });
    } else {
      return NextResponse.json({
        code: 404,
        message: data.message || 'Tracking information not found',
      });
    }
  } catch (error) {
    console.error('Litbuy Tracking API error:', error);
    return NextResponse.json(
      {
        code: 500,
        message: 'Error fetching tracking information. Please try again later.',
      },
      { status: 500 }
    );
  }
}
