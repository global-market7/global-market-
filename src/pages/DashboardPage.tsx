import { DollarSign, ShoppingBag, Package, AlertTriangle, TrendingUp, Lightbulb } from 'lucide-react';
import { useAppContext } from '../App';

export function DashboardPage() {
  const { store, openAuthModal } = useAppContext();

  if (!store.user) {
    return (
      <div className="text-center py-20 text-slate-400">
        <Package size={64} className="mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-bold mb-2">سجل الدخول لعرض لوحة التحكم</h3>
        <button
          onClick={openAuthModal}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          تسجيل الدخول
        </button>
      </div>
    );
  }

  const totalSales = store.orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = store.orders.length;
  const totalProducts = store.products.filter(p => p.sellerId === 'seller1').length; // simulated
  const lowStock = store.products.filter(p => p.stock < 100).length;

  const stats = [
    { label: 'إجمالي المبيعات', value: `$${totalSales.toFixed(0)}`, icon: DollarSign, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { label: 'الطلبات', value: totalOrders.toString(), icon: ShoppingBag, color: 'from-emerald-500 to-emerald-600', change: '+8%' },
    { label: 'المنتجات', value: totalProducts.toString(), icon: Package, color: 'from-purple-500 to-purple-600', change: '+3' },
    { label: 'مخزون منخفض', value: lowStock.toString(), icon: AlertTriangle, color: lowStock > 0 ? 'from-red-500 to-red-600' : 'from-emerald-500 to-emerald-600', change: '' },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-6">لوحة التحكم</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <Icon size={22} className="text-white" />
              </div>
              <div className="text-2xl font-extrabold text-slate-800 mb-1">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
              {stat.change && (
                <div className="flex items-center gap-1 mt-2 text-xs text-emerald-500 font-medium">
                  <TrendingUp size={12} />
                  {stat.change}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Orders & Tips */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">آخر الطلبات</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500">
                  <th className="text-right px-5 py-3 font-semibold">المنتج</th>
                  <th className="text-right px-5 py-3 font-semibold">الكمية</th>
                  <th className="text-right px-5 py-3 font-semibold">الإجمالي</th>
                  <th className="text-right px-5 py-3 font-semibold">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {store.orders.slice(0, 5).map(o => (
                  <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-700">{o.productName}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{o.quantity}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-blue-600">${o.total.toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        o.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                        o.status === 'shipped' ? 'bg-purple-50 text-purple-600' :
                        o.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {o.status === 'delivered' ? 'تم التسليم' :
                         o.status === 'shipped' ? 'تم الشحن' :
                         o.status === 'pending' ? 'قيد الانتظار' : o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100 h-fit">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Lightbulb size={18} className="text-amber-500" />
            نصائح سريعة
          </h3>
          <ul className="space-y-4 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-0.5">💡</span>
              <span>أضف صور عالية الجودة لزيادة المبيعات بنسبة 40%</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-0.5">💡</span>
              <span>اكتب أوصافاً تفصيلية تشمل المواصفات والمميزات</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-0.5">💡</span>
              <span>رد على الرسائل خلال 24 ساعة للحصول على شارة البائع السريع</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-0.5">💡</span>
              <span>قدم عروض تنافسية لجذب المزيد من المشترين</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
