'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ChevronDown, Filter, ShoppingBag, Star, ArrowRight, ExternalLink, Grid3X3, List } from 'lucide-react';
import { PromoBanner } from '@/components/promo-banner';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Footer } from '@/components/footer';
import { products, type Product, getSortedCategories } from '@/lib/products-import';

const PRODUCTS_PER_PAGE = 24;

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<'Women' | 'Men' | 'Unisex' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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

  const activeFiltersCount = (selectedCategory ? 1 : 0) + (selectedGender ? 1 : 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Promo Banner */}
      <PromoBanner />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <h1 className="text-2xl md:text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent group-hover:from-accent group-hover:to-primary transition-all duration-500">
                Rephoven
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                href="/" 
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-all"
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="px-4 py-2 rounded-lg text-sm font-medium text-primary bg-primary/10 transition-all"
              >
                Products
              </Link>
              <a 
                href="https://www.youtube.com/@Rephoven"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-all"
              >
                Videos
              </a>
            </nav>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeSwitcher />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <ThemeSwitcher />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 hover:bg-secondary rounded-xl transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-1 border-t border-border/50">
              <Link href="/" className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-secondary">
                Home
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link href="/products" className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary/10 text-primary">
                Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Page Header */}
      <div className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Shop</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
              All Products
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse our collection of {products.length} curated products
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Search and Filter Bar */}
        <div className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-xl py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary border border-border rounded-xl font-medium hover:border-primary transition-all"
            >
              <Filter className="w-5 h-5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
          
          {/* Active Filters */}
          {(selectedCategory || selectedGender) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition-colors"
                >
                  {selectedCategory}
                  <X className="w-4 h-4" />
                </button>
              )}
              {selectedGender && (
                <button
                  onClick={() => setSelectedGender(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition-colors"
                >
                  {selectedGender}
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedGender(null);
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-40 space-y-8">
              {/* Categories */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg text-card-foreground mb-4 flex items-center gap-2">
                  <Grid3X3 className="w-5 h-5 text-primary" />
                  Categories
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                      !selectedCategory
                        ? 'bg-primary text-primary-foreground'
                        : 'text-card-foreground hover:bg-secondary'
                    }`}
                  >
                    All Categories
                  </button>
                  {sortedCategories.map(({ name, count: catCount }) => (
                    <button
                      key={name}
                      onClick={() => setSelectedCategory(name)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl transition-all text-sm font-medium flex justify-between items-center ${
                        selectedCategory === name
                          ? 'bg-primary text-primary-foreground'
                          : 'text-card-foreground hover:bg-secondary'
                      }`}
                    >
                      <span>{name}</span>
                      <span className={`text-xs ${selectedCategory === name ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {catCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg text-card-foreground mb-4">Gender</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedGender(null)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                      !selectedGender
                        ? 'bg-primary text-primary-foreground'
                        : 'text-card-foreground hover:bg-secondary'
                    }`}
                  >
                    All
                  </button>
                  {(['Women', 'Men', 'Unisex'] as const).map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setSelectedGender(gender)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                        selectedGender === gender
                          ? 'bg-primary text-primary-foreground'
                          : 'text-card-foreground hover:bg-secondary'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filters Panel */}
          {mobileFiltersOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-xl">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="text-lg font-display font-bold">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 hover:bg-secondary rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-display font-bold text-lg mb-3">Categories</h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition text-sm ${
                          !selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                        }`}
                      >
                        All Categories
                      </button>
                      {sortedCategories.map(({ name, count: catCount }) => (
                        <button
                          key={name}
                          onClick={() => setSelectedCategory(name)}
                          className={`w-full text-left px-4 py-3 rounded-xl transition text-sm flex justify-between ${
                            selectedCategory === name ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                          }`}
                        >
                          <span>{name}</span>
                          <span className="opacity-60">{catCount}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Gender */}
                  <div>
                    <h3 className="font-display font-bold text-lg mb-3">Gender</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Women', 'Men', 'Unisex'] as const).map((gender) => (
                        <button
                          key={gender}
                          onClick={() => setSelectedGender(selectedGender === gender ? null : gender)}
                          className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                            selectedGender === gender
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary'
                          }`}
                        >
                          {gender}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-border">
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl"
                  >
                    Show {filteredProducts.length} Results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Products Area */}
          <main className="flex-1">
            {/* Results count */}
            <p className="text-sm text-muted-foreground mb-6">
              Showing {displayedProducts.length} of {filteredProducts.length} products
            </p>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {displayedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
                >
                  {/* Image container */}
                  <div className="relative aspect-square overflow-hidden bg-secondary">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}

                    {/* Category badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-card/90 backdrop-blur-sm text-card-foreground text-xs font-semibold rounded-full border border-border/50">
                      {product.category}
                    </div>
                    
                    {/* Quick view overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                      <a
                        href={product.buyLink || 'https://litbuy.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                      >
                        View Details
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Product info */}
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                      {product.brand}
                    </p>
                    <h3 className="font-display font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-bold text-primary">
                        ${Math.round(product.price)}
                      </span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="text-sm font-medium">4.9</span>
                      </div>
                    </div>

                    {/* Buy button */}
                    <a
                      href={product.buyLink || 'https://litbuy.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full py-3 bg-secondary text-secondary-foreground border border-border rounded-xl font-semibold text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 text-center flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Buy Now
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
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                >
                  Load More Products
                  <span className="px-2 py-0.5 bg-primary-foreground/20 rounded-md text-sm">
                    {filteredProducts.length - displayedCount} left
                  </span>
                </button>
              </div>
            )}

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-secondary flex items-center justify-center">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setSelectedGender(null);
                  }}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
