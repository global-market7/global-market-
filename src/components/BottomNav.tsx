import { Page } from '../App';

interface BottomNavProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  cartCount: number;
}

export function BottomNav({ currentPage, onPageChange, cartCount }: BottomNavProps) {
  const navItems: { id: Page; icon: string; label: string }[] = [
    { id: 'home', icon: 'fa-home', label: 'الرئيسية' },
    { id: 'favorites', icon: 'fa-heart', label: 'المفضلة' },
    { id: 'cart', icon: 'fa-shopping-cart', label: 'السلة' },
    { id: 'profile', icon: 'fa-user', label: 'حسابي' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentPage === item.id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="relative">
              <i className={`fas ${item.icon} text-xl`}></i>
              {item.id === 'cart' && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
