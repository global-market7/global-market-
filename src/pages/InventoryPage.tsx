import { Package, Edit, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../App';

export function InventoryPage() {
  const { store, openAuthModal, showToast } = useAppContext();

  if (!store.user) {
    return (
      <div className="text-center py-20 text-slate-400">
        <Package size={64} className="mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-bold mb-2">سجل الدخول لإدارة المخزون</h3>
        <button
          onClick={openAuthModal}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          تسجيل الدخول
        </button>
      </div>
    );
  }

  const products = store.products; // In real app, filter by seller

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">إدارة المخزون</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1.5 text-red-500 bg-red-50 px-3 py-1.5 rounded-full font-medium">
            <AlertTriangle size={14} />
            {products.filter(p => p.stock < 100).length} مخزون منخفض
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500">
                <th className="text-right px-5 py-3.5 font-semibold">المنتج</th>
                <th className="text-right px-5 py-3.5 font-semibold">السعر</th>
                <th className="text-right px-5 py-3.5 font-semibold">المخزون</th>
                <th className="text-right px-5 py-3.5 font-semibold">المبيعات</th>
                <th className="text-right px-5 py-3.5 font-semibold">الحالة</th>
                <th className="text-right px-5 py-3.5 font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-blue-600">${p.price}</td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-semibold ${p.stock < 100 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {p.stock.toLocaleString()}
                    </span>
                    {p.stock < 100 && (
                      <span className="block text-[10px] text-red-400 mt-0.5">مخزون منخفض!</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">{p.sold.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      p.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {p.status === 'active' ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => showToast('سيتم فتح صفحة التعديل قريباً', 'info')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
