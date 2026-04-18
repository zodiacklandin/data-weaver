'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { PromoBanner } from '@/components/promo-banner';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { HeroSection } from '@/components/hero-section';
import { FeaturesSection } from '@/components/features-section';
import { FeaturedProductsGrid } from '@/components/featured-products-grid';
import { LastVideoProductsGrid } from '@/components/last-video-products-grid';
import { Footer } from '@/components/footer';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                Products
              </Link>
              <a 
                href="https://www.youtube.com/@Rephoven"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                Videos
              </a>
            </nav>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeSwitcher />
              <Link
                href="/products"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/30"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop Now
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <ThemeSwitcher />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 hover:bg-secondary rounded-xl transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-1 border-t border-border/50 animate-in slide-in-from-top-2 duration-200">
              <Link 
                href="/" 
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-secondary text-foreground font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link 
                href="/products" 
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-secondary text-foreground font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <a 
                href="https://www.youtube.com/@Rephoven"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-secondary text-foreground font-medium transition-colors"
              >
                Videos
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </a>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products Grid */}
      <FeaturedProductsGrid />

      {/* Features Section */}
      <FeaturesSection />

      {/* Products from Last Video Grid */}
      <LastVideoProductsGrid />

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-6 text-balance">
            Ready to Discover Your Next Favorite Product?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our full collection of hand-picked, quality-verified products at amazing prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Browse All Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://www.youtube.com/@Rephoven"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card text-card-foreground font-semibold rounded-xl border border-border hover:border-primary/50 hover:bg-card/80 transition-all duration-300"
            >
              Watch Our Reviews
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
