import { Heart, ShoppingCart, Star, Shield } from 'lucide-react';
import { useStore, type Product } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product }: { product: Product }) {
  const store = useStore();
  const { user } = useAuth();
  const isFav = store.favorites.includes(product.id);
  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { store.setShowAuth(true); return; }
    store.toggleFavorite(product.id);
  };

  const handleAddCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { store.setShowAuth(true); return; }
    store.addToCart(product, product.moq);
  };

  return (
    <article
      onClick={() => store.setSelectedProduct(product)}
      className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={product.images[0]}
          alt={product.name_en}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
          {product.verified && (
            <span className="flex items-center gap-1 bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              <Shield size={10} /> Verified
            </span>
          )}
          {discount > 0 && (
            <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-md">
              {discount}% OFF
            </span>
          )}
        </div>
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleFav}
            className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-colors ${
              isFav ? 'bg-destructive text-destructive-foreground' : 'bg-card/90 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground'
            }`}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleAddCart}
            className="w-8 h-8 bg-card/90 rounded-lg flex items-center justify-center shadow-md text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>

      <div className="p-3.5">
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
          {product.old_price && (
            <span className="text-xs text-muted-foreground line-through">${product.old_price.toFixed(2)}</span>
          )}
          <span className="text-[10px] text-muted-foreground ml-auto">MOQ: {product.moq}+</span>
        </div>
        <h3 className="text-sm font-semibold text-card-foreground mb-2 line-clamp-2 leading-relaxed group-hover:text-primary transition-colors">
          {product.name_en}
        </h3>
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex text-accent gap-0.5">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={11} fill={i <= Math.round(product.rating) ? 'currentColor' : 'none'} />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground">({product.reviews})</span>
          <span className="text-[11px] text-success font-medium ml-auto">{product.sold.toLocaleString()} sold</span>
        </div>
        <div className="flex items-center justify-between pt-2.5 border-t border-border">
          <span className="text-xs font-medium text-muted-foreground">{product.seller_name}</span>
          <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">{product.origin}</span>
        </div>
      </div>
    </article>
  );
}
