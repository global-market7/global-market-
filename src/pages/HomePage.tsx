import { useMemo, useState, useEffect } from 'react';
import { PackageOpen, ArrowLeft, TrendingUp, Shield, Truck, Globe, Zap } from 'lucide-react';
import { useAppContext } from '../App';
import { ProductCard } from '../components/ProductCard';

const heroBanners = [
  {
    title: 'اكتشف عالم التجارة الدولية',
    subtitle: 'آلاف الموردين الموثقين من 190+ دولة',
    cta: 'ابدأ الآن',
    gradient: 'from-blue-600 via-indigo-600 to-purple-700',
    emoji: '🌍',
  },
  {
    title: 'خصومات نهاية الموسم',
    subtitle: 'وفر حتى 70% على الإلكترونيات والأزياء',
    cta: 'تسوق العروض',
    gradient: 'from-orange-500 via-red-500 to-pink-600',
    emoji: '🔥',
  },
  {
    title: 'شحن سريع لجميع الدول العربية',
    subtitle: 'توصيل مضمون خلال 5-14 يوم عمل',
    cta: 'اكتشف المزيد',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    emoji: '🚀',
  },
];

const categoryCards = [
  { id: 'electronics', icon: '📱', label: 'إلكترونيات', count: '12K+', color: 'from-blue-500 to-cyan-500' },
  { id: 'fashion', icon: '👔', label: 'أزياء وموضة', count: '8K+', color: 'from-pink-500 to-rose-500' },
  { id: 'home', icon: '🏠', label: 'منزل وديكور', count: '6K+', color: 'from-amber-500 to-orange-500' },
  { id: 'beauty', icon: '💄', label: 'جمال وعناية', count: '5K+', color: 'from-purple-500 to-violet-500' },
  { id: 'industrial', icon: '🏭', label: 'معدات صناعية', count: '3K+', color: 'from-slate-500 to-slate-700' },
];

export function HomePage() {
  const { store, selectedCategory, searchQuery, setSelectedCategory, setCurrentPage } = useAppContext();
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = store.products;
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [store.products, selectedCategory, searchQuery]);

  const hotDeals = store.products.filter(p => p.oldPrice);
  const newProducts = store.products.filter(p => p.badge === 'new');

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      {selectedCategory === 'all' && searchQuery.length < 2 && (
        <>
          <div className="relative overflow-hidden rounded-3xl shadow-xl" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
            {heroBanners.map((banner, i) => (
              <div
                key={i}
                className={`bg-gradient-to-l ${banner.gradient} p-8 sm:p-10 text-white relative transition-all duration-700 ${
                  i === currentBanner ? 'block' : 'hidden'
                }`}
              >
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32" />
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-24 translate-y-24" />
                <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full" />

                <div className="relative z-10 max-w-lg">
                  <span className="text-5xl mb-4 block" style={{ animation: 'float 3s ease-in-out infinite' }}>{banner.emoji}</span>
                  <h2 className="text-2xl sm:text-3xl font-black mb-3 leading-tight">{banner.title}</h2>
                  <p className="text-white/80 mb-6 text-sm sm:text-base">{banner.subtitle}</p>
                  <button className="bg-white text-slate-800 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/90 transition-all shadow-lg flex items-center gap-2 hover:gap-3">
                    {banner.cta}
                    <ArrowLeft size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {heroBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentBanner ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            {[
              { icon: <Globe size={20} />, value: '190+', label: 'دولة', color: 'bg-blue-50 text-blue-600' },
              { icon: <Shield size={20} />, value: '50K+', label: 'مورد موثق', color: 'bg-emerald-50 text-emerald-600' },
              { icon: <Truck size={20} />, value: '1M+', label: 'شحنة ناجحة', color: 'bg-purple-50 text-purple-600' },
              { icon: <Zap size={20} />, value: '99%', label: 'رضا العملاء', color: 'bg-amber-50 text-amber-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-xl font-black text-slate-800">{stat.value}</div>
                  <div className="text-[11px] text-slate-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Category Cards */}
          <div style={{ animation: 'fadeInUp 0.7s ease-out' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                📂 تصفح الفئات
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {categoryCards.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setCurrentPage('home'); }}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center hover:shadow-lg hover:-translate-y-1 transition-all group"
                >
                  <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <p className="text-sm font-bold text-slate-700">{cat.label}</p>
                  <p className={`text-[11px] font-semibold mt-1 bg-gradient-to-l ${cat.color} bg-clip-text text-transparent`}>
                    {cat.count} منتج
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Hot Deals */}
          {hotDeals.length > 0 && (
            <div style={{ animation: 'fadeInUp 0.8s ease-out' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                  🔥 عروض حصرية
                  <span className="text-xs font-bold text-white bg-gradient-to-l from-red-500 to-pink-500 px-2.5 py-1 rounded-lg">
                    خصم يصل 50%
                  </span>
                </h2>
                <button className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  عرض الكل <ArrowLeft size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {hotDeals.slice(0, 3).map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* New Arrivals */}
          {newProducts.length > 0 && (
            <div style={{ animation: 'fadeInUp 0.9s ease-out' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                  ✨ وصل حديثاً
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {newProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Search Results Header */}
      {searchQuery.length >= 2 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
          <TrendingUp size={20} className="text-blue-600" />
          <div>
            <h2 className="font-bold text-slate-800">نتائج البحث: "{searchQuery}"</h2>
            <p className="text-xs text-slate-400">{filteredProducts.length} نتيجة</p>
          </div>
        </div>
      )}

      {/* All Products */}
      <div style={{ animation: `fadeInUp ${selectedCategory === 'all' && searchQuery.length < 2 ? '1' : '0.5'}s ease-out` }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            🏷️ {selectedCategory === 'all' ? 'جميع المنتجات' : `منتجات ${selectedCategory}`}
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
              {filteredProducts.length} منتج
            </span>
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-400 bg-white rounded-3xl">
            <PackageOpen size={64} className="mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-bold mb-2">لا توجد منتجات</h3>
            <p className="text-sm mb-4">جرب البحث بكلمات مختلفة أو تصفح فئات أخرى</p>
            <button
              onClick={() => { setSelectedCategory('all'); }}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
            >
              عرض جميع المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {selectedCategory === 'all' && searchQuery.length < 2 && (
        <div className="bg-gradient-to-l from-slate-800 to-slate-900 rounded-3xl p-8 text-white text-center relative overflow-hidden" style={{ animation: 'fadeInUp 1.1s ease-out' }}>
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-3">🚀 ابدأ البيع اليوم!</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm">
              انضم إلى آلاف البائعين الناجحين على Global Market واوصل منتجاتك إلى ملايين المشترين حول العالم
            </p>
            <button className="bg-gradient-to-l from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/30">
              أنشئ متجرك مجاناً ←
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
