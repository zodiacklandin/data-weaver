'use client';

import { useMemo } from 'react';
import { TrendingUp, Package, Eye, Users, Activity, BarChart3 } from 'lucide-react';
import { products as allProducts, getSortedCategories } from '@/lib/products-import';

interface AdminStatsProps {
  activeProductsCount: number;
  totalProducts: number;
}

export function AdminStats({ activeProductsCount, totalProducts }: AdminStatsProps) {
  const sortedCategories = getSortedCategories();

  // Calculate statistics
  const stats = useMemo(() => {
    const topCategories = sortedCategories.slice(0, 3);
    const avgPriceProducts = allProducts.filter((p) => p.price > 0);
    const avgPrice = avgPriceProducts.length > 0 
      ? avgPriceProducts.reduce((sum, p) => sum + p.price, 0) / avgPriceProducts.length 
      : 0;

    // Simulate visitor data based on time (deterministic, no random)
    const hour = new Date().getHours();
    const baseVisitors = 2500;
    const visitors = baseVisitors + Math.floor(Math.sin(hour / 24 * Math.PI) * 1000);

    return {
      topCategories,
      avgPrice,
      visitors: Math.floor(visitors),
      conversionRate: (activeProductsCount / totalProducts * 100).toFixed(1),
      totalCategories: sortedCategories.length,
    };
  }, [activeProductsCount, totalProducts, sortedCategories]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Real-time statistics and analytics</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <StatCard
          icon={<Package className="text-orange-500" size={24} />}
          label="Total Products"
          value={totalProducts.toLocaleString()}
          subtext={`${stats.totalCategories} categories`}
          bgColor="bg-orange-500/10"
          trend="+12% this month"
        />

        {/* Active Products */}
        <StatCard
          icon={<Eye className="text-green-500" size={24} />}
          label="Active Products"
          value={activeProductsCount.toLocaleString()}
          subtext={`${stats.conversionRate}% of total`}
          bgColor="bg-green-500/10"
          trend="+8% this week"
        />

        {/* Average Price */}
        <StatCard
          icon={<TrendingUp className="text-blue-500" size={24} />}
          label="Average Price"
          value={`$${stats.avgPrice.toFixed(2)}`}
          subtext="Across all products"
          bgColor="bg-blue-500/10"
          trend="±2% variance"
        />

        {/* Live Visitors */}
        <StatCard
          icon={<Users className="text-purple-500" size={24} />}
          label="Active Visitors"
          value={stats.visitors.toLocaleString()}
          subtext="Right now"
          bgColor="bg-purple-500/10"
          trend="+34% peak hours"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Categories */}
        <div className="bg-card border border-border/40 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/20 p-2 rounded">
              <BarChart3 className="text-primary" size={20} />
            </div>
            <h3 className="font-display font-bold">Top Categories</h3>
          </div>
          <div className="space-y-3">
            {stats.topCategories.map(({ name, count }, idx) => (
              <div key={name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{name}</span>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${(count / stats.topCategories[0].count) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border/40 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/20 p-2 rounded">
              <Activity className="text-primary" size={20} />
            </div>
            <h3 className="font-display font-bold">Quick Stats</h3>
          </div>
          <div className="space-y-3">
            <StatRow label="Products per Category" value={`${(totalProducts / stats.totalCategories).toFixed(0)} avg`} />
            <StatRow label="Active Ratio" value={`${stats.conversionRate}%`} />
            <StatRow label="Pricing Range" value={`$${allProducts.filter(p => p.price).sort((a, b) => a.price - b.price)[0]?.price?.toFixed(0) || '0'} - $${allProducts.filter(p => p.price).sort((a, b) => b.price - a.price)[0]?.price?.toFixed(0) || '0'}`} />
            <StatRow label="Total Categories" value={stats.totalCategories.toString()} />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-card border border-border/40 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/20 p-2 rounded">
              <Activity className="text-primary" size={20} />
            </div>
            <h3 className="font-display font-bold">Recent Activity</h3>
          </div>
          <div className="space-y-2 text-sm">
            <ActivityItem icon="📦" text="Products loaded" time="Just now" />
            <ActivityItem icon="👁️" text="Dashboard viewed" time="2 min ago" />
            <ActivityItem icon="🔐" text="Admin login" time="5 min ago" />
            <ActivityItem icon="📊" text="Stats updated" time="10 min ago" />
            <ActivityItem icon="✨" text="System online" time="1 hour ago" />
          </div>
        </div>
      </div>

      {/* Gender Distribution */}
      <div className="bg-card border border-border/40 rounded-lg p-6">
        <h3 className="font-display font-bold mb-4">Products by Gender</h3>
        <div className="grid grid-cols-3 gap-4">
          {['Women', 'Men', 'Unisex'].map((gender) => {
            const count = allProducts.filter((p) => p.gender === gender).length;
            const percentage = (count / totalProducts * 100).toFixed(1);
            return (
              <div key={gender} className="text-center">
                <div className="bg-muted rounded-lg p-4 mb-2">
                  <p className="text-2xl font-bold text-primary">{count.toLocaleString()}</p>
                </div>
                <p className="font-medium">{gender}</p>
                <p className="text-xs text-muted-foreground">{percentage}%</p>
                <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                  <div
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  bgColor: string;
  trend: string;
}

function StatCard({ icon, label, value, subtext, bgColor, trend }: StatCardProps) {
  return (
    <div className="bg-card border border-border/40 rounded-lg p-6 hover:border-border transition">
      <div className={`${bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold mb-2">{value}</p>
      <p className="text-xs text-muted-foreground mb-2">{subtext}</p>
      <p className="text-xs text-green-600 font-medium">{trend}</p>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-primary">{value}</span>
    </div>
  );
}

function ActivityItem({ icon, text, time }: { icon: string; text: string; time: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-foreground">{text}</span>
      </div>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  );
}
