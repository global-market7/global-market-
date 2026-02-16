import { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { UserProfile, Notification, Category } from '../firebase';

interface HeaderProps {
  user: User | null;
  profile: UserProfile | null;
  cartCount: number;
  notifCount: number;
  notifications: Notification[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onShowAuth: () => void;
  onNotificationClick: (notification: Notification) => void;
  onMarkAllRead: () => void;
}

const categories = [
  { id: 'all', name: 'الكل' },
  { id: 'machinery', name: 'آلات ومعدات' },
  { id: 'electronics', name: 'إلكترونيات' },
  { id: 'apparel', name: 'أزياء' },
  { id: 'home', name: 'منزل' },
  { id: 'beauty', name: 'جمال' },
  { id: 'sports', name: 'رياضة' },
  { id: 'automotive', name: 'سيارات' },
];

export function Header({
  user,
  profile,
  cartCount,
  notifCount,
  notifications,
  searchQuery,
  onSearchChange,
  onSearch,
  selectedCategory,
  onCategoryChange,
  onShowAuth,
  onNotificationClick,
  onMarkAllRead
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-2 text-2xl font-bold">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <i className="fas fa-globe text-yellow-400 text-xl"></i>
            </div>
            <span className="hidden sm:block">Global Market</span>
          </a>

          <div className="flex-1 max-w-2xl">
            <div className="relative flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن منتجات، موردين، علامات تجارية..."
                className="flex-1 px-4 py-2.5 text-gray-800 rounded-r-lg border-0 focus:ring-2 focus:ring-yellow-400"
                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              />
              <button
                onClick={onSearch}
                className="px-6 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-l-lg transition-colors"
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex flex-col items-center gap-1 p-2 hover:bg-white/10 rounded-lg transition-colors relative"
              >
                <i className="fas fa-bell text-xl"></i>
                <span className="text-xs hidden sm:block">التنبيهات</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-slideDown">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">التنبيهات</h3>
                    <button
                      onClick={onMarkAllRead}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      تحديد الكل مقروء
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <i className="fas fa-bell-slash text-4xl mb-2 opacity-50"></i>
                        <p>لا توجد تنبيهات</p>
                      </div>
                    ) : (
                      notifications.map((notification: Notification) => (
                        <div
                          key={notification.id}
                          onClick={() => {
                            onNotificationClick(notification);
                            setShowNotifications(false);
                          }}
                          className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                            !notification.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              notification.type === 'order' ? 'bg-green-100 text-green-600' :
                              notification.type === 'message' ? 'bg-blue-100 text-blue-600' :
                              notification.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              <i className={`fas ${
                                notification.type === 'order' ? 'fa-shopping-bag' :
                                notification.type === 'message' ? 'fa-comment' :
                                notification.type === 'review' ? 'fa-star' :
                                'fa-info-circle'
                              }`}></i>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800 text-sm">{notification.title}</p>
                              <p className="text-gray-600 text-xs mt-1">{notification.body}</p>
                              <p className="text-gray-400 text-xs mt-1">
                                {notification.createdAt?.toDate().toLocaleDateString('ar-SA')}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className="flex flex-col items-center gap-1 p-2 hover:bg-white/10 rounded-lg transition-colors relative">
              <i className="fas fa-shopping-cart text-xl"></i>
              <span className="text-xs hidden sm:block">السلة</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-blue-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <img
                    src={profile?.photoURL || `https://ui-avatars.com/api/?name=${profile?.name || 'User'}&background=0D47A1&color=fff`}
                    alt=""
                    className="w-9 h-9 rounded-full border-2 border-white/50"
                  />
                  <span className="hidden md:block text-sm font-medium">{profile?.name?.split(' ')[0]}</span>
                  <i className="fas fa-chevron-down text-xs hidden md:block"></i>
                </button>

                {showUserMenu && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-slideDown">
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <p className="font-bold">{profile?.name}</p>
                      <p className="text-sm opacity-80">{profile?.email}</p>
                    </div>
                    <div className="p-2">
                      <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                        <i className="fas fa-user text-blue-600"></i> حسابي
                      </a>
                      <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                        <i className="fas fa-box text-blue-600"></i> طلباتي
                      </a>
                      <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                        <i className="fas fa-store text-blue-600"></i> لوحة البائع
                      </a>
                      <hr className="my-2" />
                      <a href="#" className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <i className="fas fa-sign-out-alt"></i> تسجيل الخروج
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onShowAuth}
                className="flex flex-col items-center gap-1 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <i className="fas fa-user text-xl"></i>
                <span className="text-xs hidden sm:block">دخول</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white text-blue-700'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
