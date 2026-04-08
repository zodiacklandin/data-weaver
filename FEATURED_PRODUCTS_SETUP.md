# Featured Products - Persistent Storage Setup

## The Problem (Diagnosed)

Your featured products system was failing because:

1. **JSON File Storage is Ephemeral** - The file system resets on every:
   - Dev server restart
   - Deployment
   - Container recycle

2. **Multiple Server Instances** - Each request could hit a different server:
   - Desktop saves to Instance A → Mobile reads from Instance B (empty)
   - Data appears to disappear randomly

3. **No True Persistence** - Without a shared database, there's no single source of truth

## The Solution: Supabase PostgreSQL

Store featured products in a persistent database that all instances can access.

---

## Setup Instructions

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Wait for the project to be ready (takes ~2 minutes)

### Step 2: Get Your Credentials

1. Go to Project Settings → API
2. Copy:
   - `Project URL` → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Create the Database Table

Open Supabase SQL Editor and run:

```sql
-- Create featured_products table
CREATE TABLE public.featured_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.featured_products ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access (for development)
CREATE POLICY "Allow public read" ON public.featured_products
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Allow public update" ON public.featured_products
  FOR UPDATE TO anon
  USING (true);

CREATE POLICY "Allow public insert" ON public.featured_products
  FOR INSERT TO anon
  WITH CHECK (true);
```

### Step 4: Configure Environment Variables

1. Create `.env.local` in `/workspace/web/`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Replace with your actual values from Step 2

### Step 5: Restart Dev Server

```bash
# Kill current dev server
pkill -f "npm run dev"

# Restart
cd /workspace/web && npm run dev
```

---

## How It Works Now

### Desktop → Featured Products → Database ← Mobile

**Flow:**

1. Desktop saves featured products
   ```
   POST /api/featured-products
   → Supabase: UPDATE featured_products
   → Database persisted ✓
   ```

2. Mobile fetches featured products
   ```
   GET /api/featured-products
   → Supabase: SELECT FROM featured_products
   → Same data as desktop ✓
   ```

3. Both devices poll every 30 seconds (cross-device sync)
   ```
   GET /api/featured-products (every 30s)
   → Always hits same database
   → Same data guaranteed ✓
   ```

4. Data persists across:
   - Page refreshes ✓
   - Browser restarts ✓
   - Device changes ✓
   - Server restarts ✓
   - Deployments ✓

---

## Why This Works

| Aspect | Old (JSON File) | New (Supabase) |
|--------|-----------------|----------------|
| Storage Location | Local filesystem | Persistent database |
| Multiple Instances | Different files on each | Single database |
| Refresh Behavior | Data lost | Data persists |
| Cross-Device Sync | Inconsistent | Guaranteed same |
| Deployment | Data reset | Data preserved |
| Reliability | Unreliable | Production-ready |

---

## Verification

### Test 1: Data Persistence

1. Add featured products on desktop
2. Refresh the page
3. ✅ Products should still be there

### Test 2: Cross-Device Sync

1. Add products on desktop
2. Open mobile browser (same network or different)
3. ✅ Mobile should see same products
4. ✅ Products sync automatically (or within 30 seconds)

### Test 3: Database Verification

In Supabase SQL Editor:
```sql
SELECT * FROM featured_products;
```
You should see your featured product IDs in the `product_ids` column.

---

## Fallback Behavior

If Supabase credentials are NOT configured:
- System falls back to in-memory storage
- Data persists during dev session
- Data is lost on server restart
- ⚠️ Not recommended for production

To enable persistence, always configure Supabase credentials.

---

## Troubleshooting

### Issue: "Supabase not configured" message

**Fix:** Ensure `.env.local` has both environment variables set

```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Both should output values (not empty).

### Issue: Data still disappearing

**Fix:** Verify table exists in Supabase

1. Go to Supabase Dashboard → SQL Editor
2. Run: `SELECT * FROM featured_products;`
3. If error: Run the table creation SQL from Step 3

### Issue: Mobile can't access data

**Fix:** Ensure RLS policies allow public access

```sql
SELECT * FROM public.policies
WHERE tablename = 'featured_products';
```

You should see 3 policies (read, update, insert).

---

## Architecture Diagram

```
Desktop Browser          Mobile Browser
     ↓                         ↓
   Hook                      Hook
     ↓                         ↓
   API Route                API Route
     ↓                         ↓
    Supabase Client         Supabase Client
     ↓                         ↓
     └─────────┬───────────────┘
               ↓
        PostgreSQL Database
           (Supabase)
               ↓
        featured_products table
               ↓
        [Single Source of Truth]
```

---

## Next Steps

1. Create Supabase project
2. Run the SQL setup script
3. Add `.env.local` with credentials
4. Restart dev server
5. Test on desktop and mobile

Once configured, featured products will be truly persistent and sync across all devices! 🎉
