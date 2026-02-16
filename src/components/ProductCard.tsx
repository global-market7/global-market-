import { Heart, ShoppingCart, Star, StarHalf, BadgeCheck, Truck, Eye } from 'lucide-react';
import { useAppContext } from '../App';
import { type Product } from '../store';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { store, showToast, openProductModal, openOrderModal, openAuthModal } = useAppContext();
  const isFav = store.favorites.includes(product.id);

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!store.user) { openAuthModal(); return; }
    store.toggleFavorite(product.id);
    showToast(isFav ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة للمفضلة ❤️', isFav ? 'info' : 'success');
  };

  const handleCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    openOrderModal(product);
  };

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <div
      onClick={() => openProductModal(product)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer group"
      style={{ animationDelay: `${index * 80}ms`, animation: 'fadeInUp 0.5s ease-out both' }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {product.verified && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
              <BadgeCheck size={11} /> موثق
            </span>
          )}
          {discount > 0 && (
            <span className="bg-gradient-to-l from-red-500 to-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
              خصم {discount}%
            </span>
          )}
          {product.badge === 'hot' && (
            <span className="bg-gradient-to-l from-orange-500 to-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
              🔥 الأكثر مبيعاً
            </span>
          )}
          {product.badge === 'new' && (
            <span className="bg-gradient-to-l from-blue-500 to-cyan-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
              ✨ جديد
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={handleFav}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all backdrop-blur-md ${
              isFav ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-500 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart size={15} fill={isFav ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleCart}
            className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg text-slate-500 hover:bg-blue-500 hover:text-white transition-all"
          >
            <ShoppingCart size={15} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); openProductModal(product); }}
            className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg text-slate-500 hover:bg-indigo-500 hover:text-white transition-all"
          >
            <Eye size={15} />
          </button>
        </div>

        {/* Bottom shipping badge */}
        <div className="absolute bottom-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="bg-white/90 backdrop-blur text-slate-600 text-[10px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <Truck size={11} />
            {product.shippingDays} أيام
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-extrabold text-blue-600">${product.price}</span>
          {product.oldPrice && (
            <span className="text-xs text-slate-400 line-through">${product.oldPrice}</span>
          )}
          <span className="text-[10px] text-slate-400 mr-auto">/ {product.moq}+ pcs</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-800 mb-2 line-clamp-2 leading-relaxed group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex text-amber-400 gap-0.5">
            {renderStars(product.rating)}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">({product.reviewCount})</span>
          <span className="text-[11px] text-slate-300 mx-1">|</span>
          <span className="text-[11px] text-emerald-600 font-semibold">{product.sold.toLocaleString()} مبيعة</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-[9px] font-bold">
              {product.sellerName.charAt(0)}
            </div>
            <div>
              <span className="text-[11px] text-slate-600 font-medium">{product.sellerName}</span>
              <span className="text-[10px] text-slate-400 mr-1">{product.sellerCountry}</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
            📍 {product.origin}
          </span>
        </div>
      </div>
    </div>
  );
}

export function renderStars(rating: number) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<Star key={i} size={13} fill="currentColor" />);
    } else if (i - 0.5 <= rating) {
      stars.push(<StarHalf key={i} size={13} fill="currentColor" />);
    } else {
      stars.push(<Star key={i} size={13} />);
    }
  }
  return stars;
}
