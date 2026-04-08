'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { PromoBanner } from '@/components/promo-banner';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { FeaturedProductsGrid } from '@/components/featured-products-grid';
import { LastVideoProductsGrid } from '@/components/last-video-products-grid';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <nav className="hidden md:flex items-center space-x-1 mt-1">
              <Link href="/" className="px-3 py-2 rounded text-sm font-medium hover:bg-muted">
                Home
              </Link>
              <Link href="/products" className="px-3 py-2 rounded text-sm font-medium hover:bg-muted">
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

      {/* Banner Section */}
      <section className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-background flex items-center justify-center">
        <img
          src="/banner.png"
          alt="Best Litbuy"
          className="w-full h-full object-contain"
        />
      </section>

      {/* Featured Products Grid */}
      <FeaturedProductsGrid />

      {/* Products from Last Video Grid */}
      <LastVideoProductsGrid />

      {/* CTA to Products Page */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground mb-4 text-lg">Want to see all our products?</p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition"
          >
            Browse All Products
          </Link>
        </div>
      </section>


    </div>
  );
}
