import { useState } from 'react';
import { Heart, ShoppingCart, Star, Shield, Truck, RotateCcw, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore, type Product } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';

export default function ProductDetail({ product, onClose }: { product: Product; onClose: () => void }) {
  const store = useStore();
  const { user } = useAuth();
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(product.moq);
  const isFav = store.favorites.includes(product.id);
  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;

  const handleAddCart = () => {
    if (!user) { store.setShowAuth(true); return; }
    store.addToCart(product, qty);
    store.toast('Added to cart!', 'success');
  };

  const handleFav = () => {
    if (!user) { store.setShowAuth(true); return; }
    store.toggleFavorite(product.id);
  };

  return (
    <Modal title={product.name_en} onClose={onClose} wide>
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary mb-3">
            <img
              src={product.images[imgIdx]}
              alt={product.name_en}
              className="w-full h-full object-cover"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx(i => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-card/80 rounded-lg flex items-center justify-center text-foreground hover:bg-card transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setImgIdx(i => (i + 1) % product.images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-card/80 rounded-lg flex items-center justify-center text-foreground hover:bg-card transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
            {discount > 0 && (
              <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-lg">
                {discount}% OFF
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === imgIdx ? 'border-primary' : 'border-border'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
            {product.old_price && (
              <span className="text-sm text-muted-foreground line-through">${product.old_price.toFixed(2)}</span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-accent gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={14} fill={i <= Math.round(product.rating) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
          </div>

          {product.verified && (
            <div className="flex items-center gap-2 bg-success/10 text-success px-3 py-2 rounded-lg mb-4 text-sm font-medium">
              <Shield size={14} /> Verified Supplier
            </div>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            {product.description_en}
          </p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-[11px] text-muted-foreground">MOQ</p>
              <p className="text-sm font-semibold text-foreground">{product.moq} pieces</p>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-[11px] text-muted-foreground">Origin</p>
              <p className="text-sm font-semibold text-foreground">{product.origin}</p>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-[11px] text-muted-foreground">Shipping</p>
              <p className="text-sm font-semibold text-foreground">{product.shipping_days} days</p>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-[11px] text-muted-foreground">Sold</p>
              <p className="text-sm font-semibold text-foreground">{product.sold.toLocaleString()}</p>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm font-medium text-foreground">Quantity:</span>
            <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
              <button
                onClick={() => setQty(q => Math.max(product.moq, q - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-card transition-colors text-foreground"
              >
                <Minus size={14} />
              </button>
              <span className="font-semibold text-sm w-10 text-center text-foreground">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-card transition-colors text-foreground"
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="text-sm text-muted-foreground ml-auto">Total: <span className="font-bold text-primary">${(product.price * qty).toFixed(2)}</span></span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleFav}
              className={`p-3 rounded-xl border transition-colors ${
                isFav
                  ? 'bg-destructive/10 border-destructive/20 text-destructive'
                  : 'border-border text-muted-foreground hover:border-destructive hover:text-destructive'
              }`}
              aria-label="Toggle favorite"
            >
              <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleAddCart}
              className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Shield size={14} className="text-success" /> Buyer Protection
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Truck size={14} className="text-primary" /> Free Shipping
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <RotateCcw size={14} className="text-accent" /> Easy Returns
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
