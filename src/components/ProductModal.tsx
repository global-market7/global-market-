import { ShoppingCart, MessageCircle, Star, MapPin, Package, Truck, Shield, ThumbsUp, Share2 } from 'lucide-react';
import { Modal } from './Modal';
import { renderStars } from './ProductCard';
import { useAppContext } from '../App';
import { type Product } from '../store';

interface Props {
  product: Product;
  onClose: () => void;
  onOrder: () => void;
  onChat: () => void;
  onReview: () => void;
}

export function ProductModal({ product, onClose, onOrder, onChat, onReview }: Props) {
  const { store, showToast } = useAppContext();
  const reviews = store.getProductReviews(product.id);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <Modal title="تفاصيل المنتج" onClose={onClose}>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Images */}
        <div>
          <div className="relative rounded-2xl overflow-hidden mb-3 bg-slate-100">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-4 right-4 bg-gradient-to-l from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl">
                خصم {discount}%
              </span>
            )}
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <Shield size={18} className="text-blue-600 mx-auto mb-1" />
              <span className="text-[10px] text-blue-700 font-semibold">ضمان الجودة</span>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <Truck size={18} className="text-emerald-600 mx-auto mb-1" />
              <span className="text-[10px] text-emerald-700 font-semibold">شحن {product.shippingDays} أيام</span>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <Package size={18} className="text-amber-600 mx-auto mb-1" />
              <span className="text-[10px] text-amber-700 font-semibold">MOQ {product.moq}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div>
          {/* Seller */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
              {product.sellerName.charAt(0)}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-700">{product.sellerName}</span>
              <span className="text-xs text-slate-400 mr-1">{product.sellerCountry}</span>
            </div>
            {product.verified && (
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md mr-auto">✓ موثق</span>
            )}
          </div>

          <h2 className="text-lg font-extrabold text-slate-800 mb-3 leading-relaxed">{product.name}</h2>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex text-amber-400 gap-0.5">{renderStars(product.rating)}</div>
            <span className="text-sm text-slate-500 font-medium">{product.rating}</span>
            <span className="text-xs text-slate-400">({product.reviewCount} تقييم)</span>
            <span className="text-xs text-slate-300">|</span>
            <span className="text-xs text-emerald-600 font-bold">{product.sold.toLocaleString()} مبيعة</span>
          </div>

          {/* Price */}
          <div className="bg-gradient-to-l from-blue-50 to-indigo-50 rounded-2xl p-4 mb-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-blue-600">${product.price}</span>
              {product.oldPrice && (
                <span className="text-lg text-slate-400 line-through">${product.oldPrice}</span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">الحد الأدنى للطلب: {product.moq} قطعة | المخزون: {product.stock.toLocaleString()}</p>
          </div>

          {/* Features */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {product.features.map((f, i) => (
                <span key={i} className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-lg">
                  ✓ {f}
                </span>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex gap-4 mb-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-lg">
              <Package size={14} /> {product.stock.toLocaleString()} متوفر
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-lg">
              <MapPin size={14} /> {product.origin}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-lg">
              <Truck size={14} /> {product.shippingDays} أيام
            </span>
          </div>

          <p className="text-slate-600 leading-relaxed mb-6 text-sm">{product.description}</p>

          {/* Actions */}
          <div className="flex gap-3 mb-3">
            <button
              onClick={onOrder}
              className="flex-1 bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30"
            >
              <ShoppingCart size={18} />
              اطلب الآن
            </button>
            <button
              onClick={onChat}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3.5 rounded-xl transition-colors"
            >
              <MessageCircle size={18} />
            </button>
            <button
              onClick={() => showToast('تم نسخ الرابط!', 'success')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3.5 rounded-xl transition-colors"
            >
              <Share2 size={18} />
            </button>
          </div>

          <button
            onClick={onReview}
            className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors text-sm border border-amber-200"
          >
            <Star size={16} />
            إضافة تقييم
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 text-lg">التقييمات ({reviews.length})</h3>
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">{renderStars(product.rating)}</div>
            <span className="font-bold text-slate-800">{product.rating}</span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <span className="text-4xl block mb-2">⭐</span>
            <p className="text-sm">لا توجد تقييمات بعد. كن أول من يقيّم!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {r.userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{r.userName}</span>
                      <span className="text-sm">{r.userCountry}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">{renderStars(r.rating)}</div>
                      <span className="text-[11px] text-slate-400">{r.createdAt.toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{r.text}</p>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-200/50">
                  <button className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors">
                    <ThumbsUp size={12} /> مفيد ({r.helpful})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
