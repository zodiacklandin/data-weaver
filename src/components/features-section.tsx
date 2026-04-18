'use client';

import { CheckCircle2, Gift, Shield, Truck, Video, Zap } from 'lucide-react';

const features = [
  {
    icon: Video,
    title: 'Video Reviewed',
    description: 'Every product featured in our detailed video reviews',
    color: 'from-primary to-primary/60',
  },
  {
    icon: Shield,
    title: 'Quality Verified',
    description: 'We personally verify quality before recommending',
    color: 'from-accent to-accent/60',
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    description: 'Quick delivery with tracking on all orders',
    color: 'from-primary to-accent',
  },
  {
    icon: Gift,
    title: 'Exclusive Deals',
    description: 'Special discounts available only through our links',
    color: 'from-accent to-primary',
  },
];

const benefits = [
  'Hand-picked products from trusted sellers',
  'Detailed video reviews before you buy',
  'Exclusive discount codes and deals',
  'Regular updates with new finds',
  'Community-driven recommendations',
  'Quality guarantee on all featured items',
];

export function FeaturesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-4 text-balance">
            The Best Way to Discover Amazing Products
          </h2>
          <p className="text-lg text-muted-foreground">
            We do the research so you don&apos;t have to. Every product is carefully selected and reviewed.
          </p>
        </div>
        
        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg`}>
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              
              {/* Content */}
              <h3 className="font-display font-bold text-lg text-card-foreground mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
          ))}
        </div>
        
        {/* Benefits grid */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-2xl opacity-50" />
          
          <div className="relative bg-card border border-border rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-card-foreground mb-4">
                  Everything You Need to Shop Smart
                </h3>
                <p className="text-muted-foreground mb-6">
                  Join thousands of satisfied customers who trust our recommendations for quality products at the best prices.
                </p>
                <a
                  href="/products"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                >
                  Explore Products
                  <span className="text-lg">→</span>
                </a>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
                  >
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-card-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
