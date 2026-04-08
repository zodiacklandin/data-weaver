'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { PromoBanner } from '@/components/promo-banner';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { products, type Product, getSortedCategories } from '@/lib/products-import';

const PRODUCTS_PER_PAGE = 50;

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<'Women' | 'Men' | 'Unisex' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [mobileGenderOpen, setMobileGenderOpen] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(PRODUCTS_PER_PAGE);
  const sortedCategories = getSortedCategories();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesGender = !selectedGender || product.gender === selectedGender;
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesGender && matchesSearch;
    });
  }, [selectedCategory, selectedGender, searchQuery]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayedCount);
  }, [filteredProducts, displayedCount]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Promo Banner */}
      <PromoBanner />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary font-display">Rephoven</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/" className="px-3 py-2 rounded text-sm font-medium hover:bg-muted">
                Home
              </Link>
              <Link href="/products" className="px-3 py-2 rounded text-sm font-medium hover:bg-muted bg-muted">
                Products
              </Link>
            </nav>

            {/* Right side */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeSwitcher />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <ThemeSwitcher />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-muted rounded"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-border/40">
              <Link href="/" className="block px-3 py-2 rounded hover:bg-muted text-sm">
                Home
              </Link>
              <Link href="/products" className="block px-3 py-2 rounded hover:bg-muted text-sm">
                Products
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <h1 className="text-4xl font-display font-bold mb-8">All Products</h1>

        {/* Sticky Search Bar */}
        <div className="sticky top-16 z-40 mb-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            {/* Categories */}
            <div className="mb-8">
              <h3 className="font-display font-bold text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded transition ${
                    !selectedCategory
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  All Categories
                </button>
                {sortedCategories.map(({ name, count: catCount }) => (
                  <button
                    key={name}
                    onClick={() => setSelectedCategory(name)}
                    className={`w-full text-left px-3 py-2 rounded transition flex justify-between items-center ${
                      selectedCategory === name
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span>{name}</span>
                    <span className="text-xs opacity-75">({catCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div className="mb-8">
              <h3 className="font-display font-bold text-lg mb-4">Gender</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedGender(null)}
                  className={`w-full text-left px-3 py-2 rounded transition ${
                    !selectedGender
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  All Genders
                </button>
                {['Women', 'Men', 'Unisex'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setSelectedGender(gender as 'Women' | 'Men' | 'Unisex')}
                    className={`w-full text-left px-3 py-2 rounded transition ${
                      selectedGender === gender
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {gender === 'Women' ? '👩' : gender === 'Men' ? '👨' : '👥'} {gender}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Products Area */}
          <main className="flex-1">
            {/* Mobile Filters */}
            <div className="lg:hidden mb-6 space-y-2">
              {/* Mobile Categories */}
              <div>
                <button
                  onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-muted rounded"
                >
                  <span className="font-medium">Categories</span>
                  <ChevronDown size={16} className={mobileCategoriesOpen ? 'rotate-180' : ''} />
                </button>
                {mobileCategoriesOpen && (
                  <div className="mt-2 space-y-1 p-2 bg-muted/50 rounded">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setMobileCategoriesOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded ${
                        !selectedCategory ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      }`}
                    >
                      All
                    </button>
                    {sortedCategories.slice(0, 5).map(({ name }) => (
                      <button
                        key={name}
                        onClick={() => {
                          setSelectedCategory(name);
                          setMobileCategoriesOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm ${
                          selectedCategory === name ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Gender */}
              <div>
                <button
                  onClick={() => setMobileGenderOpen(!mobileGenderOpen)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-muted rounded"
                >
                  <span className="font-medium">Gender</span>
                  <ChevronDown size={16} className={mobileGenderOpen ? 'rotate-180' : ''} />
                </button>
                {mobileGenderOpen && (
                  <div className="mt-2 space-y-1 p-2 bg-muted/50 rounded">
                    <button
                      onClick={() => {
                        setSelectedGender(null);
                        setMobileGenderOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded ${
                        !selectedGender ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      }`}
                    >
                      All
                    </button>
                    {['Women', 'Men', 'Unisex'].map((g) => (
                      <button
                        key={g}
                        onClick={() => {
                          setSelectedGender(g as 'Women' | 'Men' | 'Unisex');
                          setMobileGenderOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm ${
                          selectedGender === g ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                        }`}
                      >
                        {g === 'Women' ? '👩' : g === 'Men' ? '👨' : '👥'} {g}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group rounded-lg overflow-hidden bg-muted/50 border border-border/40 hover:border-primary/50 transition"
                >
                  {/* Product Image */}
                  <div className="relative w-full aspect-square bg-muted overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded">
                      {product.category}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      {product.brand}
                    </p>
                    <h3 className="font-display font-semibold text-sm mb-3 line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-primary">
                        ${Math.round(product.price)}
                      </span>
                    </div>

                    {/* Buy Button */}
                    <a
                      href={product.buyLink || 'https://litbuy.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-primary text-primary-foreground rounded font-medium text-sm hover:bg-primary/90 transition text-center block"
                    >
                      Buy
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {displayedCount < filteredProducts.length && (
              <div className="text-center">
                <button
                  onClick={() => setDisplayedCount(displayedCount + PRODUCTS_PER_PAGE)}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
                >
                  Load More ({filteredProducts.length - displayedCount} remaining)
                </button>
              </div>
            )}

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products found</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setSelectedGender(null);
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
