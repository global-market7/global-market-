import { Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function FavoritesPage() {
  const store = useStore();
  const favProducts = store.products.filter(p => store.favorites.includes(p.id));

  if (favProducts.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-border">
        <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart size={28} className="text-destructive/40" />
        </div>
        <h3 className="text-base font-semibold text-card-foreground mb-2">No favorites yet</h3>
        <p className="text-sm text-muted-foreground mb-5">Save products you like for easy access later</p>
        <button
          onClick={() => store.setPage('home')}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
          <Heart size={18} className="text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Favorites</h2>
          <p className="text-xs text-muted-foreground">{favProducts.length} saved products</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {favProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
