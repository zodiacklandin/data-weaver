'use client';

import { ArrowRight, Play, Sparkles, Star, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] opacity-30" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Discover Premium Finds</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6">
              <span className="text-foreground">Curated</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-accent">
                Style Picks
              </span>
              <br />
              <span className="text-foreground">For You</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Explore our handpicked collection of premium products featured in our latest videos. Quality meets style at unbeatable prices.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                Shop Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <a
                href="https://www.youtube.com/@Rephoven"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-xl border border-border hover:bg-secondary/80 hover:border-primary/50 transition-all duration-300"
              >
                <Play className="w-5 h-5" />
                Watch Videos
              </a>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/50">
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-display font-bold text-foreground">500+</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-display font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-display font-bold text-foreground">4.9</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 justify-center lg:justify-start">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  Rating
                </p>
              </div>
            </div>
          </div>
          
          {/* Right content - Featured cards */}
          <div className="relative hidden lg:block">
            {/* Main feature card */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-60" />
              
              {/* Card */}
              <div className="relative bg-card border border-border rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-card-foreground">Trending Now</h3>
                    <p className="text-sm text-muted-foreground">Most popular this week</p>
                  </div>
                </div>
                
                {/* Product preview cards */}
                <div className="space-y-4">
                  {[
                    { name: 'Premium Streetwear', tag: 'New Arrival', color: 'from-primary to-primary/60' },
                    { name: 'Designer Accessories', tag: 'Best Seller', color: 'from-accent to-accent/60' },
                    { name: 'Limited Edition', tag: 'Exclusive', color: 'from-primary to-accent' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/50 hover:bg-secondary transition-all duration-300 cursor-pointer"
                    >
                      <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                        <Zap className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-card-foreground group-hover:text-primary transition-colors">{item.name}</p>
                        <span className="text-xs text-muted-foreground">{item.tag}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 px-4 py-2 bg-accent text-accent-foreground font-semibold rounded-full shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Hot Deals
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
