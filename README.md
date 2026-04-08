# VEKTOR - Premium E-Commerce Clothing Store

A modern, fully-featured e-commerce platform built with Next.js 16, React 19, and Tailwind CSS 4. Featuring 2,990+ products, comprehensive admin panel, and responsive design.

## 🎨 Design Features

- **Premium Dark Theme**: Black (#000000) with Orange (#FF8C00) accents
- **Typography**: Space Grotesk (display) + Outfit (body)
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Gender Filtering**: Products categorized as Women, Men, or Unisex
- **Dynamic Categories**: 18 product categories with auto-counting
- **Search Functionality**: Real-time search across product name, brand, and category

## ✨ Features Implemented

### 🏪 Homepage (`/`)
- Navigation bar with Home, Products, and Sign Up on Litbuy button
- Search bar with real-time product filtering
- **Gender Filter** (Women, Men, Unisex)
- **Category Filter** (18 categories from T-SHIRTS to LULULEMON)
- **Product Grid** (3-column desktop, 2-column tablet, 1-column mobile)
- Product cards with: brand, name, price, category tag, and full-width Buy button
- Mobile-responsive category/gender collapse accordion
- Dark/Light theme toggle
- **2,990+ Products** loaded from JSON

### 🛠️ Admin Panel (`/admin`)
**Comprehensive product management system with:**

- **Product Management**
  - Add new products with form validation
  - Edit product details (name, brand, price, category, gender, image URL)
  - Delete individual products
  - Bulk delete operations

- **Active Product System**
  - Mark products as "active" (display at top of homepage)
  - Auto-save functionality with localStorage persistence
  - Newly added products marked as active by default

- **Filtering & Search**
  - Search products by name or brand
  - Filter by category
  - Filter by gender (Women/Men/Unisex)
  - Select all/deselect all functionality

- **Bulk Operations**
  - Select multiple products
  - Bulk category assignment
  - Bulk delete with confirmation
  - Quick category assignment buttons

- **Data Export**
  - Export all products as JSON file
  - Timestamped export files

- **Responsive Table**
  - Desktop-optimized table view
  - Product count statistics
  - Active/inactive product toggle with visual indicators

## 🔧 Technical Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI Library**: React 19 with TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS 4 with oklch() color space
- **UI Components**: Radix UI primitives, shadcn/ui
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Form**: React Hook Form
- **State Management**: React Hooks (useState, useContext, useCallback)
- **Storage**: localStorage for admin persistence
- **Fonts**: next/font/google (Space Grotesk, Outfit)

## 📂 Project Structure

```
/workspace/web/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Homepage with product grid
│   │   ├── admin/
│   │   │   └── page.tsx             # Admin panel
│   │   ├── layout.tsx               # Root layout with fonts
│   │   ├── theme.css                # Dark/light theme colors
│   │   ├── globals.css              # Tailwind base styles
│   │   ├── providers/               # Theme provider
│   │   └── api/
│   │       └── admin/
│   │           └── import-products/ # API routes (legacy)
│   ├── components/
│   │   ├── theme-switcher.tsx       # Dark/light toggle
│   │   └── ui/                      # shadcn components
│   ├── hooks/
│   │   ├── use-admin-products.ts    # Admin products hook
│   │   ├── use-debounce.ts
│   │   ├── use-local-storage.ts
│   │   └── ... (other hooks)
│   ├── lib/
│   │   ├── products-import.ts       # Product data transformation
│   │   ├── raw-products.json        # 2,990 products data
│   │   └── utils.ts
│   └── config/
│       └── site.ts                  # Site configuration
├── .babelrc                         # Babel configuration
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies

```

## 🎯 Key Features

### Admin Panel Features
1. **Product CRUD Operations**
   - Add products with automatic ID generation
   - Edit all product fields
   - Delete individual or bulk products
   - Auto-save with localStorage

2. **Active Product Display**
   - Recently added products appear at top of homepage
   - Eye icon toggle for active/inactive status
   - Persistent across sessions

3. **Bulk Operations**
   - Multi-select with select-all checkbox
   - Bulk category assignment
   - Bulk delete with confirmation dialog
   - Product count display

4. **Search & Filter**
   - Real-time search across product names and brands
   - Category filter dropdown
   - Gender filter (Women/Men/Unisex)
   - Combined filter support

5. **Data Export**
   - JSON export with timestamp
   - Download button for backup

### Homepage Features
1. **Product Discovery**
   - 2,990+ products from 18 categories
   - Full-text search (name, brand, category)
   - Gender-based filtering
   - Category browsing

2. **Responsive Design**
   - Desktop: Sidebar filters + 3-column product grid
   - Tablet: 2-column grid, collapsible filters
   - Mobile: Full-width grid, accordion filters

3. **Product Cards**
   - Product image with lazy loading fallback
   - Brand name (orange accent)
   - Product name with 2-line clamp
   - Price display (orange accent)
   - Category tag
   - Full-width "Buy" button (links to Litbuy)

4. **Navigation**
   - Sticky header with logo
   - Desktop and mobile navigation
   - Sign Up on Litbuy button (top right)
   - Theme toggle (dark/light mode)
   - Hamburger menu for mobile

## 🌈 Color Scheme

**Dark Mode (Default):**
- Background: oklch(0.12, 0.001, 0) - Very dark
- Primary: oklch(0.65, 0.15, 29.2) - Warm Orange
- Secondary: oklch(0.35, 0.03, 80) - Deep Brown
- Accent: oklch(0.65, 0.15, 160) - Sage Green
- Muted: oklch(0.23, 0.001, 0) - Dark Gray

**Light Mode:**
- Background: oklch(0.98, 0.001, 0) - Off-white
- Primary: oklch(0.65, 0.15, 29.2) - Warm Orange
- Text: oklch(0.35, 0.03, 80) - Dark text

## 📊 Product Data

**Total Products**: 2,990
**Categories**: 18

| Category | Count |
|----------|-------|
| T-SHIRTS | 390 |
| SHOES | 358 |
| HOODIES | 289 |
| DRESSES | 263 |
| ACCESSOIRES | 262 |
| JACKETS | 231 |
| ALO | 231 |
| SHIRTS | 174 |
| PANTS | 153 |
| TOPS | 153 |
| SHORTS | 124 |
| BAGS | 117 |
| SWEATERS | 110 |
| ELECTRONICS | 71 |
| PARFUME | 37 |
| ZARA | 13 |
| SKIRTS | 11 |
| LULULEMON | 3 |

## 🚀 Getting Started

### Installation

```bash
cd /workspace/web
npm install
```

### Development

```bash
npm run dev
```

Server starts at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📱 Usage

### Browsing Products
1. **Search**: Use search bar to find products by name or brand
2. **Filter by Gender**: Click gender selector (Women/Men/Unisex)
3. **Filter by Category**: Select category from sidebar (desktop) or accordion (mobile)
4. **Buy**: Click "Buy" button on product card to redirect to Litbuy

### Admin Panel (`/admin`)

1. **Add Products**
   - Click "Add Product" button
   - Fill in product details (brand, name, price, category, gender, image URL)
   - Click "Add Product" - auto-saves to localStorage
   - Product appears at top of homepage

2. **Edit Products**
   - Click "Edit" on any product row
   - Modify fields in expanded edit mode
   - Click "Save" to persist changes

3. **Delete Products**
   - Click trash icon to delete single product
   - Or select multiple and click "Delete All" in bulk actions

4. **Export Data**
   - Click "Export" button to download all products as JSON

## 🔐 Data Persistence

- Admin changes are saved to localStorage
- Products persist across browser sessions
- Export functionality allows data backup
- No backend database required for local testing

## 🎨 Customization

### Colors
Edit `src/app/theme.css` to modify color scheme:
```css
:root {
  --primary: oklch(0.65 0.15 29.2); /* Orange */
  --background: oklch(0.12 0.001 0); /* Dark */
}

[data-theme="light"] {
  --background: oklch(0.98 0.001 0); /* Off-white */
}
```

### Typography
Edit `src/app/layout.tsx` to change fonts from Google Fonts

### Product Categories
Modify `CATEGORIES` array in `src/lib/products-import.ts`

## 🔗 External Links

- **Litbuy Sign Up**: https://litbuy.com/register?inviteCode=PBYWV0N12
- **Product Links**: Direct to Litbuy product pages (configured in admin)

## 📝 Notes

- QC buttons have been removed per requirements
- Navigation simplified to Home, Products, and Sign Up
- Admin panel for full product management
- Responsive design works seamlessly on all devices
- Theme persists across sessions using next-themes

## 📞 Support

For issues or feature requests, review the admin panel to manage products directly.

---

**Built with** Next.js 16 • React 19 • Tailwind CSS 4 • TypeScript 5
**Last Updated**: February 16, 2026
