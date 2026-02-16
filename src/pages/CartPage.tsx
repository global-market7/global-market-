import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Shield, Truck, RotateCcw, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../App';

export function CartPage() {
  const { store, showToast, setCurrentPage } = useAppContext();

  if (store.cart.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
        <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <ShoppingCart size={40} className="text-blue-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">السلة فارغة</h3>
        <p className="text-sm text-slate-400 mb-6">أضف منتجات للسلة وابدأ تجربة التسوق</p>
        <button
          onClick={() => setCurrentPage('home')}
          className="bg-gradient-to-l from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm"
        >
          تصفح المنتجات ←
        </button>
      </div>
    );
  }

  const total = store.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = store.cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <ShoppingCart size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-slate-800">سلة التسوق</h2>
          <p className="text-xs text-slate-400">{store.cart.length} منتج • {itemCount} قطعة</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Items */}
        <div className="space-y-3">
          {store.cart.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex gap-4 hover:shadow-md transition-shadow">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 mb-1 text-sm line-clamp-1">{item.name}</h4>
                <div className="text-blue-600 font-extrabold text-lg">${item.price}</div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1">
                    <button
                      onClick={() => store.updateCartQty(item.id, -1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors text-slate-600"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-sm w-10 text-center">{item.quantity}</span>
                    <button
                      onClick={() => store.updateCartQty(item.id, 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors text-slate-600"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">= ${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => { store.removeFromCart(item.id); showToast('تمت الإزالة من السلة', 'info'); }}
                    className="mr-auto bg-red-50 hover:bg-red-100 text-red-500 p-2 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button onClick={() => setCurrentPage('home')} className="text-blue-600 text-sm font-semibold flex items-center gap-1 mt-2 hover:gap-2 transition-all">
            <ArrowLeft size={14} className="rotate-180" />
            متابعة التسوق
          </button>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sticky top-[140px]">
            <h3 className="font-bold text-slate-800 mb-4">ملخص الطلب</h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">المنتجات ({itemCount})</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">الشحن</span>
                <span className="text-emerald-600 font-bold">مجاني 🎉</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">الضريبة</span>
                <span className="text-slate-400">-</span>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-slate-200 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-lg font-extrabold text-slate-800">الإجمالي</span>
                <span className="text-2xl font-black text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => showToast('جاري تحويلك لصفحة الدفع...', 'info')}
              className="w-full bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 text-lg"
            >
              <CreditCard size={20} />
              إتمام الشراء
            </button>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="flex flex-col items-center text-center gap-1 p-2">
                <Shield size={16} className="text-emerald-500" />
                <span className="text-[10px] text-slate-400">حماية كاملة</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 p-2">
                <Truck size={16} className="text-blue-500" />
                <span className="text-[10px] text-slate-400">شحن مجاني</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 p-2">
                <RotateCcw size={16} className="text-amber-500" />
                <span className="text-[10px] text-slate-400">إرجاع سهل</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
