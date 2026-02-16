import { LogOut, ShoppingBag, Heart, Star, Settings, ChevronLeft } from 'lucide-react';
import { useAppContext } from '../App';

export function ProfilePage() {
  const { store, showToast, openAuthModal, setCurrentPage } = useAppContext();

  if (!store.user) {
    return (
      <div className="text-center py-20 text-slate-400">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">👤</span>
        </div>
        <h3 className="text-lg font-bold mb-2">مرحباً بك!</h3>
        <p className="text-sm mb-6">سجل الدخول لإدارة حسابك</p>
        <button
          onClick={openAuthModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
        >
          تسجيل الدخول
        </button>
      </div>
    );
  }

  const menuItems = [
    { icon: ShoppingBag, label: 'طلباتي', count: store.orders.length, page: 'orders' as const },
    { icon: Heart, label: 'المفضلة', count: store.favorites.length, page: 'favorites' as const },
    { icon: Star, label: 'تقييماتي', count: 0, page: 'home' as const },
    { icon: Settings, label: 'الإعدادات', count: 0, page: 'home' as const },
  ];

  return (
    <div className="max-w-lg mx-auto">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center mb-6">
        <img
          src={store.user.photoURL}
          alt={store.user.displayName}
          className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-blue-100 shadow-lg"
        />
        <h2 className="text-xl font-bold text-slate-800 mb-1">{store.user.displayName}</h2>
        <p className="text-sm text-slate-400 mb-6">{store.user.email}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-2xl font-extrabold text-blue-600">{store.orders.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">طلبات</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-2xl font-extrabold text-blue-600">{store.favorites.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">مفضلات</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-2xl font-extrabold text-blue-600">{store.cart.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">السلة</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={i}
              onClick={() => setCurrentPage(item.page)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Icon size={18} className="text-blue-600" />
              </div>
              <span className="flex-1 text-right font-medium text-slate-700">{item.label}</span>
              {item.count > 0 && (
                <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full">
                  {item.count}
                </span>
              )}
              <ChevronLeft size={16} className="text-slate-300" />
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          store.logout();
          showToast('تم تسجيل الخروج', 'success');
        }}
        className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut size={18} />
        تسجيل الخروج
      </button>
    </div>
  );
}
