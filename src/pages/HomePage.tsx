import { useMemo, useState, useEffect } from 'react';
import { PackageOpen, TrendingUp, Shield, Truck, Globe, Zap, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

const BANNERS = [
  { title: 'Discover Global Trade', subtitle: 'Verified suppliers from 190+ countries', gradient: 'bg-primary' },
  { title: 'End of Season Sale', subtitle: 'Save up to 70% on electronics & fashion', gradient: 'bg-destructive' },
  { title: 'Fast Global Shipping', subtitle: 'Delivery in 5-14 business days worldwide', gradient: 'bg-success' },
];

const STATS = [
  { icon: Globe, value: '190+', label: 'Countries' },
  { icon: Shield, value: '50K+', label: 'Verified Sellers' },
  { icon: Truck, value: '1M+', label: 'Shipments' },
  { icon: Zap, value: '99%', label: 'Satisfaction' },
];

const CATEGORY_CARDS = [
  { id: 'electronics', label: 'Electronics', count: '12K+' },
  { id: 'fashion', label: 'Fashion', count: '8K+' },
  { id: 'home', label: 'Home & Decor', count: '6K+' },
  { id: 'beauty', label: 'Beauty', count: '5K+' },
  { id: 'industrial', label: 'Industrial', count: '3K+' },
];

export default function HomePage() {
  const store = useStore();
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    let result = store.products;
    if (store.selectedCategory !== 'all') {
      result = result.filter(p => p.category === store.selectedCategory);
    }
    if (store.searchQuery.length >= 2) {
      const q = store.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name_en.toLowerCase().includes(q) ||
        p.description_en.toLowerCase().includes(q)
      );
    }
    return result;
  }, [store.products, store.selectedCategory, store.searchQuery]);

  const hotDeals = store.products.filter(p => p.old_price);
  const isFiltering = store.selectedCategory !== 'all' || store.searchQuery.length >= 2;

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Banner */}
      {!isFiltering && (
        <>
          <div className="relative overflow-hidden rounded-2xl">
            {BANNERS.map((b, i) => (
              <div
                key={i}
                className={`${b.gradient} text-primary-foreground p-8 sm:p-10 ${i === bannerIdx ? 'block' : 'hidden'}`}
              >
                <div className="max-w-lg relative z-10">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-balance">{b.title}</h2>
                  <p className="text-primary-foreground/80 mb-5 text-sm sm:text-base">{b.subtitle}</p>
                  <button className="bg-card text-card-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                    Shop Now <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {BANNERS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBannerIdx(i)}
                  className={`h-2 rounded-full transition-all ${i === bannerIdx ? 'w-8 bg-primary-foreground' : 'w-2 bg-primary-foreground/40'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-card-foreground">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Category cards */}
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4">Browse Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {CATEGORY_CARDS.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => store.setSelectedCategory(cat.id)}
                  className="bg-card rounded-xl p-4 border border-border text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <p className="text-sm font-semibold text-card-foreground">{cat.label}</p>
                  <p className="text-xs text-primary font-medium mt-1">{cat.count} products</p>
                </button>
              ))}
            </div>
          </section>

          {/* Hot Deals */}
          {hotDeals.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Hot Deals</h2>
                <span className="text-xs font-semibold text-destructive-foreground bg-destructive px-2.5 py-1 rounded-lg">Up to 50% OFF</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {hotDeals.slice(0, 3).map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
        </>
      )}

      {/* Search results header */}
      {store.searchQuery.length >= 2 && (
        <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
          <TrendingUp size={18} className="text-primary" />
          <div>
            <h2 className="font-semibold text-card-foreground">Results for &ldquo;{store.searchQuery}&rdquo;</h2>
            <p className="text-xs text-muted-foreground">{filtered.length} products found</p>
          </div>
        </div>
      )}

      {/* Products grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">
            {isFiltering ? 'Filtered Products' : 'All Products'}
          </h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg">
            {filtered.length} products
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <PackageOpen size={48} className="mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-base font-semibold text-card-foreground mb-2">No products found</h3>
            <p className="text-sm text-muted-foreground mb-4">Try different keywords or browse other categories</p>
            <button
              onClick={() => { store.setSelectedCategory('all'); store.setSearchQuery(''); }}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
