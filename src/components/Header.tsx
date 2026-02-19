import { useState, useRef, useEffect } from 'react';
import { Globe, Search, ShoppingCart, User, Heart, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'home', label: 'Home & Decor' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'industrial', label: 'Industrial' },
  { id: 'sports', label: 'Sports' },
  { id: 'food', label: 'Food' },
  { id: 'auto', label: 'Automotive' },
];

export default function Header() {
  const { user } = useAuth();
  const store = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const cartCount = store.cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { store.setPage('home'); store.setSelectedCategory('all'); store.setSearchQuery(''); }}
            className="flex items-center gap-2.5 shrink-0"
          >
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <Globe size={18} className="text-primary-foreground" />
            </div>
            <span className="hidden sm:block text-lg font-bold text-foreground tracking-tight">
              Global Market
            </span>
          </button>

          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={store.searchQuery}
                onChange={e => store.setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-xl text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
              {store.searchQuery && (
                <button onClick={() => store.setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2.5 hover:bg-secondary rounded-xl text-muted-foreground transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <button
              onClick={() => store.setPage('favorites')}
              className="p-2.5 hover:bg-secondary rounded-xl text-muted-foreground transition-colors relative"
              aria-label="Favorites"
            >
              <Heart size={20} />
              {store.favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {store.favorites.length}
                </span>
              )}
            </button>

            <button
              onClick={() => store.setPage('cart')}
              className="p-2.5 hover:bg-secondary rounded-xl text-muted-foreground transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <button
                onClick={() => store.setPage('profile')}
                className="p-2 hover:bg-secondary rounded-xl transition-colors"
                aria-label="Profile"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {(user.user_metadata?.name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              </button>
            ) : (
              <button
                onClick={() => store.setShowAuth(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <User size={16} />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>

        {searchOpen && (
          <div className="md:hidden mt-3 animate-slide-down">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchRef}
                value={store.searchQuery}
                onChange={e => store.setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-xl text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-primary outline-none"
              />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => store.setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  store.selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
