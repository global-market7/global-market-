import { Home, Heart, ShoppingCart, User, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { id: 'home' as const, icon: Home, label: 'Home' },
  { id: 'favorites' as const, icon: Heart, label: 'Favorites' },
  { id: 'cart' as const, icon: ShoppingCart, label: 'Cart' },
  { id: 'orders' as const, icon: Package, label: 'Orders' },
  { id: 'profile' as const, icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const store = useStore();
  const { user } = useAuth();
  const cartCount = store.cart.reduce((s, i) => s + i.qty, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 sm:hidden" role="navigation" aria-label="Main navigation">
      <div className="flex justify-around items-center py-1.5 px-2">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = store.page === item.id;

          const handleClick = () => {
            if ((item.id === 'orders' || item.id === 'profile') && !user) {
              store.setShowAuth(true);
              return;
            }
            store.setPage(item.id);
          };

          return (
            <button
              key={item.id}
              onClick={handleClick}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[56px] ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon size={20} />
                {item.id === 'cart' && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-accent text-accent-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
