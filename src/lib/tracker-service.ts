import crypto from 'crypto';

const API_KEY = 'vWGeBizBsAtq9414';
const SECRET_KEY = 'c9254a20a89c46ed80eed2db503c9607';
const API_URL = 'https://www.kd100.com/api/v1/tracking/realtime';

interface TrackingRequest {
  carrier_id: string;
  tracking_number: string;
  phone?: string;
  ship_from?: string;
  ship_to?: string;
  area_show?: number;
  order?: string;
}

interface TrackingItem {
  context: string;
  time: string;
  order_status_description: string;
  area_name: string | null;
  location: string | null;
}

interface TrackingResponse {
  code: number;
  message: string;
  data?: {
    carrier_id: string;
    tracking_number: string;
    order_status_code: number;
    items: TrackingItem[];
  };
}

export async function trackShipment(request: TrackingRequest): Promise<TrackingResponse> {
  try {
    const jsonStr = JSON.stringify(request);
    const signatureStr = jsonStr + API_KEY + SECRET_KEY;
    const signature = crypto.createHash('md5').update(signatureStr).digest('hex');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': API_KEY,
        'signature': signature,
      },
      body: jsonStr,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Tracking error:', error);
    return {
      code: 500,
      message: 'Error fetching tracking information',
    };
  }
}
