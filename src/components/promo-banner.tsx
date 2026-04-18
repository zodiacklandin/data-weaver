'use client';

import { useState } from 'react';
import { ArrowRight, Gift, X } from 'lucide-react';

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-primary via-primary to-accent overflow-hidden">
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] animate-shimmer bg-[length:200%_100%]" />
      
      <a
        href="https://litbuy.com/register?inviteCode=PBYWV0N12"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center gap-3 sm:gap-6 px-4 py-2.5 sm:py-3"
      >
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-primary-foreground" />
          <span className="text-xs sm:text-sm font-semibold text-primary-foreground tracking-wide">
            EXCLUSIVE OFFER
          </span>
        </div>
        
        <div className="hidden sm:block w-px h-4 bg-primary-foreground/30" />
        
        <span className="text-xs sm:text-sm font-medium text-primary-foreground/90">
          Sign up on LitBuy & Get <span className="font-bold text-primary-foreground">$500 Bonus + 40% Off</span> Shipping
        </span>
        
        <ArrowRight className="w-4 h-4 text-primary-foreground animate-pulse" />
      </a>
      
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsVisible(false);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
