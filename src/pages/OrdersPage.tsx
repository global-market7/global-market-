import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '../App';

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: 'قيد الانتظار', color: 'text-amber-600', bg: 'bg-amber-50', icon: <Clock size={14} /> },
  processing: { label: 'قيد المعالجة', color: 'text-blue-600', bg: 'bg-blue-50', icon: <Package size={14} /> },
  shipped: { label: 'تم الشحن', color: 'text-purple-600', bg: 'bg-purple-50', icon: <Truck size={14} /> },
  delivered: { label: 'تم التسليم', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <CheckCircle size={14} /> },
  cancelled: { label: 'ملغي', color: 'text-red-600', bg: 'bg-red-50', icon: <XCircle size={14} /> },
};

export function OrdersPage() {
  const { store, openAuthModal } = useAppContext();

  if (!store.user) {
    return (
      <div className="text-center py-20 text-slate-400">
        <Package size={64} className="mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-bold mb-2">سجل الدخول لعرض طلباتك</h3>
        <button
          onClick={openAuthModal}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          تسجيل الدخول
        </button>
      </div>
    );
  }

  if (store.orders.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <Package size={64} className="mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-bold mb-2">لا توجد طلبات</h3>
        <p className="text-sm">ابدأ بالتسوق وسترى طلباتك هنا</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-4">طلباتي ({store.orders.length})</h2>
      <div className="space-y-4">
        {store.orders.map(order => {
          const status = statusConfig[order.status] || statusConfig.pending;
          return (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-5">
                <div className="flex gap-4">
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 mb-1 truncate">{order.productName}</h4>
                    <div className="text-sm text-slate-500 mb-1">الكمية: {order.quantity}</div>
                    <div className="text-blue-600 font-bold text-xl">${order.total.toFixed(2)}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.color} ${status.bg}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-slate-50 flex justify-between items-center bg-slate-50/50">
                <span className="text-xs text-slate-400">
                  {order.createdAt.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="text-xs text-slate-400">رقم الطلب: #{order.id.slice(-6)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
