import { LogOut, ShoppingBag, Heart, Settings, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const store = useStore();

  if (!user) {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-border">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Settings size={28} className="text-primary/40" />
        </div>
        <h3 className="text-base font-semibold text-card-foreground mb-2">Sign in to continue</h3>
        <p className="text-sm text-muted-foreground mb-5">Manage your account, orders, and favorites</p>
        <button
          onClick={() => store.setShowAuth(true)}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Sign In
        </button>
      </div>
    );
  }

  const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  const menuItems = [
    { icon: ShoppingBag, label: 'My Orders', page: 'orders' as const, count: store.orders.length },
    { icon: Heart, label: 'Favorites', page: 'favorites' as const, count: store.favorites.length },
    { icon: Settings, label: 'Settings', page: 'profile' as const, count: 0 },
  ];

  return (
    <div className="max-w-lg mx-auto">
      {/* Profile Card */}
      <div className="bg-card rounded-2xl border border-border p-6 text-center mb-5">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 text-primary-foreground text-2xl font-bold">
          {initial}
        </div>
        <h2 className="text-lg font-bold text-card-foreground mb-0.5">{displayName}</h2>
        <p className="text-sm text-muted-foreground mb-5">{user.email}</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: store.orders.length, label: 'Orders' },
            { value: store.favorites.length, label: 'Favorites' },
            { value: store.cart.length, label: 'In Cart' },
          ].map((s, i) => (
            <div key={i} className="bg-secondary rounded-xl p-3">
              <p className="text-xl font-bold text-primary">{s.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden mb-5">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={i}
              onClick={() => store.setPage(item.page)}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-secondary transition-colors border-b border-border last:border-b-0"
            >
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon size={16} className="text-primary" />
              </div>
              <span className="flex-1 text-left font-medium text-card-foreground text-sm">{item.label}</span>
              {item.count > 0 && (
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{item.count}</span>
              )}
              <ChevronRight size={14} className="text-muted-foreground" />
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <button
        onClick={async () => {
          await signOut();
          store.toast('Signed out', 'info');
          store.setPage('home');
        }}
        className="w-full bg-destructive/10 hover:bg-destructive/20 text-destructive py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors text-sm"
      >
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  );
}
