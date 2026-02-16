import { Heart } from 'lucide-react';
import { useAppContext } from '../App';
import { ProductCard } from '../components/ProductCard';

export function FavoritesPage() {
  const { store, setCurrentPage } = useAppContext();
  const favProducts = store.products.filter(p => store.favorites.includes(p.id));

  if (favProducts.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
        <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Heart size={40} className="text-red-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">لا توجد مفضلات بعد</h3>
        <p className="text-sm text-slate-400 mb-6">أضف المنتجات التي تعجبك لتجدها بسهولة لاحقاً</p>
        <button
          onClick={() => setCurrentPage('home')}
          className="bg-gradient-to-l from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all"
        >
          تصفح المنتجات ←
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
          <Heart size={20} className="text-red-500" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-slate-800">المفضلة</h2>
          <p className="text-xs text-slate-400">{favProducts.length} منتج محفوظ</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {favProducts.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
}
