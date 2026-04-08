import { createClient } from '@supabase/supabase-js';
import { LastVideoProduct } from '@/hooks/use-last-video-products';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create client if credentials are available
// Otherwise will use fallback storage in API route
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'ℹ️ Supabase not configured. Featured products will use fallback in-memory storage.',
    'To enable persistent cross-device sync, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
}

// Featured Products Functions
export async function getFeaturedProductsFromSupabase(): Promise<string[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('featured_products')
      .select('product_id')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data?.map((item: any) => item.product_id) || [];
  } catch (error) {
    console.error('Error fetching featured products from Supabase:', error);
    return [];
  }
}

export async function addFeaturedProductToSupabase(productId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('featured_products')
      .insert([{ product_id: productId }])
      .select();

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding featured product to Supabase:', error);
    return false;
  }
}

export async function removeFeaturedProductFromSupabase(productId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('featured_products')
      .delete()
      .eq('product_id', productId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing featured product from Supabase:', error);
    return false;
  }
}

export async function syncFeaturedProductsToSupabase(productIds: string[]): Promise<boolean> {
  if (!supabase) return false;
  try {
    // Delete all existing
    const { error: deleteError } = await supabase
      .from('featured_products')
      .delete()
      .neq('product_id', '');

    if (deleteError) throw deleteError;

    // Insert new ones
    if (productIds.length > 0) {
      const { error: insertError } = await supabase
        .from('featured_products')
        .insert(productIds.map((id) => ({ product_id: id })))
        .select();

      if (insertError) throw insertError;
    }

    return true;
  } catch (error) {
    console.error('Error syncing featured products to Supabase:', error);
    return false;
  }
}

// Last Video Products Functions
export async function getLastVideoProductsFromSupabase(): Promise<LastVideoProduct[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('last_video_products')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching last video products from Supabase:', error);
    return [];
  }
}

export async function syncLastVideoProductsToSupabase(products: LastVideoProduct[]): Promise<boolean> {
  if (!supabase) return false;
  try {
    // Delete all existing
    const { error: deleteError } = await supabase
      .from('last_video_products')
      .delete()
      .neq('id', '');

    if (deleteError) throw deleteError;

    // Insert new ones
    if (products.length > 0) {
      const { error: insertError } = await supabase
        .from('last_video_products')
        .insert(products)
        .select();

      if (insertError) throw insertError;
    }

    return true;
  } catch (error) {
    console.error('Error syncing last video products to Supabase:', error);
    return false;
  }
}
