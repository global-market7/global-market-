import { useState, useEffect, useCallback, createContext, useContext, useRef, type ReactNode } from 'react';
import {
  Globe, Search, Bell, ShoppingCart, User, Heart, Home, Plus, X, ChevronDown,
  Star, Truck, Shield, Package, MapPin, MessageCircle, Share2,
  Minus, CreditCard, Lock, Loader2, CheckCircle, Send, Upload,
  LogOut, AlertTriangle, TrendingUp, DollarSign, ShoppingBag,
  Clock, XCircle, RotateCcw, ArrowLeft, ChevronLeft,
  Paperclip, Smile, Mail, Crown, Gift, BarChart3,
  Copy, Users, Zap, Sparkles, type LucideIcon
} from 'lucide-react';

/* ================================================================
   TYPES
   ================================================================ */
interface Language { code: string; name: string; native: string; flag: string; dir: 'rtl' | 'ltr'; }
interface Country { code: string; name: string; nameAr: string; flag: string; currency: string; symbol: string; rate: number; lang: string; manufacturing?: boolean; }
interface Category { id: string; icon: string; label: Record<string, string>; color: string; count: string; }
interface Product { id: string; name: Record<string, string>; desc: Record<string, string>; price: number; oldPrice?: number; moq: number; stock: number; category: string; images: string[]; sellerId: string; sellerName: string; sellerCountry: string; rating: number; reviews: number; sold: number; verified: boolean; featured?: boolean; origin: string; }
interface CartItem { id: string; product: Product; qty: number; }
interface Order { id: string; product: Product; qty: number; total: number; status: string; date: Date; }
interface Notif { id: string; type: string; title: string; body: string; read: boolean; time: Date; }
interface ChatMsg { id: string; text: string; isMe: boolean; time: Date; }
interface SubPlan { id: string; name: Record<string, string>; price: number; icon: string; color: string; features: string[]; maxProducts: number; commission: number; popular?: boolean; }
interface ToastItem { id: string; msg: string; type: 'success' | 'error' | 'warning' | 'info'; }

type Page = 'home' | 'favorites' | 'cart' | 'orders' | 'dashboard' | 'profile' | 'subscription' | 'wallet' | 'referral' | 'reports';

/* ================================================================
   LANGUAGES (12 commercial languages)
   ================================================================ */
const LANGUAGES: Language[] = [
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩', dir: 'ltr' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳', dir: 'ltr' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa', flag: '🇮🇩', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵', dir: 'ltr' },
];

/* ================================================================
   COUNTRIES
   ================================================================ */
const COUNTRIES: Country[] = [
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'السعودية', flag: '🇸🇦', currency: 'SAR', symbol: 'ر.س', rate: 3.75, lang: 'ar' },
  { code: 'AE', name: 'UAE', nameAr: 'الإمارات', flag: '🇦🇪', currency: 'AED', symbol: 'د.إ', rate: 3.67, lang: 'ar' },
  { code: 'US', name: 'USA', nameAr: 'أمريكا', flag: '🇺🇸', currency: 'USD', symbol: '$', rate: 1, lang: 'en' },
  { code: 'CN', name: 'China', nameAr: 'الصين', flag: '🇨🇳', currency: 'CNY', symbol: '¥', rate: 7.2, lang: 'zh', manufacturing: true },
  { code: 'TR', name: 'Turkey', nameAr: 'تركيا', flag: '🇹🇷', currency: 'TRY', symbol: '₺', rate: 32, lang: 'tr', manufacturing: true },
  { code: 'IN', name: 'India', nameAr: 'الهند', flag: '🇮🇳', currency: 'INR', symbol: '₹', rate: 83, lang: 'hi', manufacturing: true },
  { code: 'BD', name: 'Bangladesh', nameAr: 'بنجلاديش', flag: '🇧🇩', currency: 'BDT', symbol: '৳', rate: 110, lang: 'bn', manufacturing: true },
  { code: 'VN', name: 'Vietnam', nameAr: 'فيتنام', flag: '🇻🇳', currency: 'VND', symbol: '₫', rate: 24500, lang: 'vi', manufacturing: true },
  { code: 'ID', name: 'Indonesia', nameAr: 'إندونيسيا', flag: '🇮🇩', currency: 'IDR', symbol: 'Rp', rate: 15700, lang: 'id', manufacturing: true },
  { code: 'BR', name: 'Brazil', nameAr: 'البرازيل', flag: '🇧🇷', currency: 'BRL', symbol: 'R$', rate: 5, lang: 'pt' },
  { code: 'RU', name: 'Russia', nameAr: 'روسيا', flag: '🇷🇺', currency: 'RUB', symbol: '₽', rate: 92, lang: 'ru' },
  { code: 'DE', name: 'Germany', nameAr: 'ألمانيا', flag: '🇩🇪', currency: 'EUR', symbol: '€', rate: 0.92, lang: 'de' },
  { code: 'JP', name: 'Japan', nameAr: 'اليابان', flag: '🇯🇵', currency: 'JPY', symbol: '¥', rate: 150, lang: 'ja' },
  { code: 'GB', name: 'UK', nameAr: 'بريطانيا', flag: '🇬🇧', currency: 'GBP', symbol: '£', rate: 0.79, lang: 'en' },
  { code: 'EG', name: 'Egypt', nameAr: 'مصر', flag: '🇪🇬', currency: 'EGP', symbol: 'ج.م', rate: 48, lang: 'ar' },
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', flag: '🇰🇼', currency: 'KWD', symbol: 'د.ك', rate: 0.31, lang: 'ar' },
];

/* ================================================================
   TRANSLATIONS
   ================================================================ */
const T: Record<string, Record<string, string>> = {
  ar: { home:'الرئيسية', favorites:'المفضلة', cart:'السلة', profile:'حسابي', search:'ابحث عن منتجات...', login:'تسجيل الدخول', register:'إنشاء حساب', logout:'تسجيل الخروج', notifications:'التنبيهات', markAllRead:'تحديد الكل مقروء', noNotifs:'لا توجد تنبيهات', addToCart:'أضف للسلة', buyNow:'اشتري الآن', contactSeller:'تواصل مع البائع', productDetails:'تفاصيل المنتج', price:'السعر', moq:'الحد الأدنى', stock:'المخزون', shipping:'الشحن', free:'مجاني', reviews:'التقييمات', sold:'مبيعة', verified:'موثق', discount:'خصم', orderNow:'اطلب الآن', quantity:'الكمية', total:'الإجمالي', subtotal:'المجموع', checkout:'إتمام الشراء', continueShopping:'مواصلة التسوق', emptyCart:'السلة فارغة', emptyFav:'لا توجد مفضلات', noOrders:'لا توجد طلبات', orders:'الطلبات', dashboard:'لوحة التحكم', totalSales:'إجمالي المبيعات', totalOrders:'الطلبات', products:'المنتجات', lowStock:'مخزون منخفض', recentOrders:'آخر الطلبات', tips:'نصائح سريعة', subscription:'الاشتراكات', wallet:'المحفظة', balance:'الرصيد', deposit:'إيداع', withdraw:'سحب', referral:'الدعوات', referralCode:'رمز الدعوة', copyLink:'نسخ الرابط', reports:'التقارير', email:'البريد الإلكتروني', password:'كلمة المرور', name:'الاسم', forgotPassword:'نسيت كلمة المرور؟', orEmail:'أو بالبريد الإلكتروني', googleLogin:'المتابعة بحساب Google', appleLogin:'المتابعة مع Apple', haveAccount:'لديك حساب بالفعل؟', noAccount:'ليس لديك حساب؟', createAccount:'أنشئ حساب مجاناً', addProduct:'إضافة منتج', publish:'نشر المنتج', productName:'اسم المنتج', category:'الفئة', description:'الوصف', images:'صور المنتج', uploadImages:'اسحب الصور أو اضغط للرفع', addReview:'إضافة تقييم', rateProduct:'كيف تقيّم هذا المنتج؟', shareExperience:'شارك تجربتك', submitReview:'إرسال التقييم', payment:'الدفع', confirmPayment:'تأكيد الدفع', processing:'جاري المعالجة...', paymentSuccess:'تم الدفع بنجاح!', orderCreated:'تم إنشاء الطلب بنجاح!', cardNumber:'رقم البطاقة', expiry:'تاريخ الانتهاء', paymentMethod:'طريقة الدفع', creditCard:'بطاقة ائتمان', securePayment:'دفع آمن', protection:'حماية المشتري', fastShipping:'شحن سريع', easyReturn:'إرجاع سهل', qualityGuarantee:'ضمان الجودة', selectCountry:'اختر الدولة', selectLanguage:'اختر اللغة', language:'اللغة', country:'الدولة', currency:'العملة', settings:'الإعدادات', allCategories:'جميع الفئات', featuredProducts:'منتجات مميزة', hotDeals:'عروض حصرية', discountUp:'خصم يصل 50%', viewAll:'عرض الكل', browseProducts:'تصفح المنتجات', startSelling:'ابدأ البيع اليوم!', sellDescription:'انضم إلى آلاف البائعين الناجحين', createStore:'أنشئ متجرك مجاناً', heroTitle1:'اكتشف عالم التجارة الدولية', heroSub1:'آلاف الموردين الموثقين من 190+ دولة', heroCta1:'ابدأ الآن', heroTitle2:'خصومات نهاية الموسم', heroSub2:'وفر حتى 70% على الإلكترونيات والأزياء', heroCta2:'تسوق العروض', heroTitle3:'شحن سريع لجميع الدول', heroSub3:'توصيل مضمون خلال 5-14 يوم عمل', heroCta3:'اكتشف المزيد', countries190:'دولة', verifiedSuppliers:'مورد موثق', successfulShipments:'شحنة ناجحة', satisfaction:'رضا العملاء', browseCategories:'تصفح الفئات', allProducts:'جميع المنتجات', noProducts:'لا توجد منتجات', tryDifferent:'جرب كلمات بحث مختلفة', showAll:'عرض جميع المنتجات', pending:'قيد الانتظار', shipped:'تم الشحن', delivered:'تم التسليم', cancelled:'ملغي', orderNumber:'رقم الطلب', commission:'العمولة', commissionRate:'نسبة العمولة', platformFee:'رسوم المنصة 5%', monthlyEarnings:'الأرباح الشهرية', upgrade:'ترقية', month:'شهر', currentPlan:'باقتك الحالية', choosePlan:'اختر باقتك', perMonth:'شهرياً', maxProducts:'منتج كحد أقصى', commissionFee:'عمولة', transactionHistory:'سجل المعاملات', inviteFriends:'دعوة أصدقاء', referralEarnings:'أرباح الدعوات', referralsCount:'عدد الدعوات', shareReferral:'شارك رابط الدعوة', salesReport:'تقرير المبيعات', productsReport:'تقرير المنتجات', comingSoon:'قريباً' },

  en: { home:'Home', favorites:'Favorites', cart:'Cart', profile:'Profile', search:'Search products...', login:'Login', register:'Register', logout:'Logout', notifications:'Notifications', markAllRead:'Mark all read', noNotifs:'No notifications', addToCart:'Add to Cart', buyNow:'Buy Now', contactSeller:'Contact Seller', productDetails:'Product Details', price:'Price', moq:'MOQ', stock:'Stock', shipping:'Shipping', free:'Free', reviews:'Reviews', sold:'sold', verified:'Verified', discount:'Off', orderNow:'Order Now', quantity:'Quantity', total:'Total', subtotal:'Subtotal', checkout:'Checkout', continueShopping:'Continue Shopping', emptyCart:'Cart is empty', emptyFav:'No favorites yet', noOrders:'No orders yet', orders:'Orders', dashboard:'Dashboard', totalSales:'Total Sales', totalOrders:'Orders', products:'Products', lowStock:'Low Stock', recentOrders:'Recent Orders', tips:'Quick Tips', subscription:'Subscription', wallet:'Wallet', balance:'Balance', deposit:'Deposit', withdraw:'Withdraw', referral:'Referral', referralCode:'Referral Code', copyLink:'Copy Link', reports:'Reports', email:'Email', password:'Password', name:'Name', forgotPassword:'Forgot password?', orEmail:'or with email', googleLogin:'Continue with Google', appleLogin:'Continue with Apple', haveAccount:'Already have account?', noAccount:"Don't have account?", createAccount:'Create free account', addProduct:'Add Product', publish:'Publish', productName:'Product Name', category:'Category', description:'Description', images:'Product Images', uploadImages:'Drag images or click to upload', addReview:'Add Review', rateProduct:'How do you rate this product?', shareExperience:'Share your experience', submitReview:'Submit Review', payment:'Payment', confirmPayment:'Confirm Payment', processing:'Processing...', paymentSuccess:'Payment successful!', orderCreated:'Order created successfully!', cardNumber:'Card Number', expiry:'Expiry', paymentMethod:'Payment Method', creditCard:'Credit Card', securePayment:'Secure Payment', protection:'Buyer Protection', fastShipping:'Fast Shipping', easyReturn:'Easy Return', qualityGuarantee:'Quality Guarantee', selectCountry:'Select Country', selectLanguage:'Select Language', language:'Language', country:'Country', currency:'Currency', settings:'Settings', allCategories:'All Categories', featuredProducts:'Featured Products', hotDeals:'Hot Deals', discountUp:'Up to 50% off', viewAll:'View All', browseProducts:'Browse Products', startSelling:'Start Selling Today!', sellDescription:'Join thousands of successful sellers', createStore:'Create your store free', heroTitle1:'Discover Global Trade', heroSub1:'Thousands of verified suppliers from 190+ countries', heroCta1:'Get Started', heroTitle2:'End of Season Sale', heroSub2:'Save up to 70% on electronics & fashion', heroCta2:'Shop Deals', heroTitle3:'Fast Shipping Worldwide', heroSub3:'Guaranteed delivery in 5-14 business days', heroCta3:'Learn More', countries190:'Countries', verifiedSuppliers:'Verified Suppliers', successfulShipments:'Successful Shipments', satisfaction:'Customer Satisfaction', browseCategories:'Browse Categories', allProducts:'All Products', noProducts:'No products found', tryDifferent:'Try different search terms', showAll:'Show all products', pending:'Pending', shipped:'Shipped', delivered:'Delivered', cancelled:'Cancelled', orderNumber:'Order #', commission:'Commission', commissionRate:'Commission Rate', platformFee:'5% Platform Fee', monthlyEarnings:'Monthly Earnings', upgrade:'Upgrade', month:'/mo', currentPlan:'Current Plan', choosePlan:'Choose Your Plan', perMonth:'/month', maxProducts:'max products', commissionFee:'commission', transactionHistory:'Transaction History', inviteFriends:'Invite Friends', referralEarnings:'Referral Earnings', referralsCount:'Total Referrals', shareReferral:'Share referral link', salesReport:'Sales Report', productsReport:'Products Report', comingSoon:'Coming Soon' },

  zh: { home:'首页', favorites:'收藏', cart:'购物车', profile:'个人', search:'搜索产品...', login:'登录', logout:'退出', notifications:'通知', addToCart:'加入购物车', buyNow:'立即购买', price:'价格', reviews:'评价', sold:'已售', verified:'已认证', discount:'折扣', orderNow:'立即下单', total:'合计', checkout:'结算', emptyCart:'购物车是空的', orders:'订单', dashboard:'仪表板', subscription:'订阅', wallet:'钱包', referral:'推荐', reports:'报告', payment:'支付', confirmPayment:'确认支付', processing:'处理中...', securePayment:'安全支付' },

  tr: { home:'Ana Sayfa', favorites:'Favoriler', cart:'Sepet', profile:'Profil', search:'Ürün ara...', login:'Giriş', logout:'Çıkış', notifications:'Bildirimler', addToCart:'Sepete Ekle', buyNow:'Hemen Al', price:'Fiyat', reviews:'Yorumlar', sold:'satıldı', verified:'Onaylı', discount:'İndirim', orderNow:'Sipariş Ver', total:'Toplam', checkout:'Ödeme', emptyCart:'Sepet boş', orders:'Siparişler', dashboard:'Panel', subscription:'Abonelik', wallet:'Cüzdan', referral:'Davet', reports:'Raporlar', payment:'Ödeme', confirmPayment:'Ödemeyi Onayla', processing:'İşleniyor...', securePayment:'Güvenli Ödeme' },

  hi: { home:'होम', favorites:'पसंदीदा', cart:'कार्ट', profile:'प्रोफाइल', search:'उत्पाद खोजें...', login:'लॉगिन', addToCart:'कार्ट में डालें', buyNow:'अभी खरीदें', price:'कीमत', total:'कुल', checkout:'चेकआउट', orders:'ऑर्डर', dashboard:'डैशबोर्ड', payment:'भुगतान' },

  ja: { home:'ホーム', favorites:'お気に入り', cart:'カート', profile:'プロフィール', search:'商品を検索...', login:'ログイン', addToCart:'カートに追加', buyNow:'今すぐ購入', price:'価格', total:'合計', checkout:'購入手続き', orders:'注文', dashboard:'ダッシュボード', payment:'お支払い' },
};

const t = (key: string, lang: string): string => T[lang]?.[key] || T.en?.[key] || T.ar?.[key] || key;

/* ================================================================
   CATEGORIES
   ================================================================ */
const CATEGORIES: Category[] = [
  { id: 'electronics', icon: '📱', label: { ar:'إلكترونيات', en:'Electronics', zh:'电子产品', tr:'Elektronik' }, color: 'from-blue-500 to-cyan-500', count: '89K+' },
  { id: 'fashion', icon: '👔', label: { ar:'أزياء وموضة', en:'Fashion', zh:'时尚服装', tr:'Moda' }, color: 'from-pink-500 to-rose-500', count: '125K+' },
  { id: 'home', icon: '🏠', label: { ar:'منزل وديكور', en:'Home & Decor', zh:'家居装饰', tr:'Ev & Dekor' }, color: 'from-amber-500 to-orange-500', count: '45K+' },
  { id: 'beauty', icon: '💄', label: { ar:'جمال وعناية', en:'Beauty', zh:'美容护肤', tr:'Güzellik' }, color: 'from-purple-500 to-violet-500', count: '32K+' },
  { id: 'industrial', icon: '🏭', label: { ar:'معدات صناعية', en:'Industrial', zh:'工业设备', tr:'Endüstri' }, color: 'from-slate-500 to-slate-700', count: '15K+' },
  { id: 'sports', icon: '⚽', label: { ar:'رياضة', en:'Sports', zh:'体育运动', tr:'Spor' }, color: 'from-green-500 to-emerald-500', count: '18K+' },
  { id: 'food', icon: '🍽️', label: { ar:'مواد غذائية', en:'Food', zh:'食品饮料', tr:'Gıda' }, color: 'from-red-500 to-orange-500', count: '22K+' },
  { id: 'auto', icon: '🚗', label: { ar:'سيارات', en:'Automotive', zh:'汽车配件', tr:'Otomotiv' }, color: 'from-gray-600 to-gray-800', count: '23K+' },
];

/* ================================================================
   PRODUCTS (12 from different countries)
   ================================================================ */
const PRODUCTS: Product[] = [
  { id:'1', name:{ar:'سماعات بلوتوث لاسلكية احترافية',en:'Professional Wireless Bluetooth Headphones',zh:'专业无线蓝牙耳机',tr:'Profesyonel Kablosuz Kulaklık'}, desc:{ar:'سماعات لاسلكية عالية الجودة مع إلغاء الضوضاء وبطارية تدوم 40 ساعة',en:'High quality wireless headphones with noise cancellation and 40h battery'}, price:25, oldPrice:45, moq:100, stock:5000, category:'electronics', images:['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'], sellerId:'s1', sellerName:'TechFactory', sellerCountry:'🇨🇳', rating:4.8, reviews:256, sold:15000, verified:true, featured:true, origin:'China' },
  { id:'2', name:{ar:'تيشيرتات قطنية بالجملة',en:'Cotton T-Shirts Bulk',zh:'棉质T恤批发',tr:'Toplu Pamuklu Tişört'}, desc:{ar:'تيشيرتات 100% قطن جميع المقاسات والألوان',en:'100% cotton t-shirts all sizes and colors'}, price:3.5, moq:500, stock:50000, category:'fashion', images:['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'], sellerId:'s2', sellerName:'BD Textiles', sellerCountry:'🇧🇩', rating:4.5, reviews:128, sold:500000, verified:true, origin:'Bangladesh' },
  { id:'3', name:{ar:'طقم كنب مودرن فاخر',en:'Luxury Modern Sofa Set',zh:'豪华现代沙发套装',tr:'Lüks Modern Koltuk Takımı'}, desc:{ar:'طقم كنب جلد طبيعي تصميم إيطالي فاخر',en:'Genuine leather sofa set with Italian luxury design'}, price:450, oldPrice:650, moq:5, stock:100, category:'home', images:['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500'], sellerId:'s3', sellerName:'Turkish Furniture', sellerCountry:'🇹🇷', rating:4.9, reviews:89, sold:500, verified:true, featured:true, origin:'Turkey' },
  { id:'4', name:{ar:'كريم عناية بالبشرة عضوي',en:'Organic Skincare Cream',zh:'有机护肤霜',tr:'Organik Cilt Bakım Kremi'}, desc:{ar:'كريم مرطب طبيعي 100% خالي من المواد الكيميائية',en:'100% natural moisturizer free of chemicals'}, price:8, moq:500, stock:50000, category:'beauty', images:['https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=500'], sellerId:'s4', sellerName:'K-Beauty Lab', sellerCountry:'🇰🇷', rating:4.7, reviews:445, sold:8900, verified:true, origin:'South Korea' },
  { id:'5', name:{ar:'ألواح إضاءة LED صناعية',en:'Industrial LED Panel Lights',zh:'工业LED面板灯',tr:'Endüstriyel LED Panel'}, desc:{ar:'ألواح إضاءة LED موفرة للطاقة للاستخدام التجاري',en:'Energy efficient LED panels for commercial use'}, price:15, moq:200, stock:10000, category:'industrial', images:['https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=500'], sellerId:'s5', sellerName:'VN LED Solutions', sellerCountry:'🇻🇳', rating:4.6, reviews:67, sold:8000, verified:true, origin:'Vietnam' },
  { id:'6', name:{ar:'أجهزة رياضية متكاملة',en:'Complete Gym Equipment Set',zh:'全套健身器材',tr:'Komple Spor Ekipmanı'}, desc:{ar:'مجموعة أجهزة رياضية للمنزل شاملة التركيب',en:'Home gym equipment set including installation'}, price:120, oldPrice:180, moq:20, stock:500, category:'sports', images:['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500'], sellerId:'s6', sellerName:'CN Sports MFG', sellerCountry:'🇨🇳', rating:4.4, reviews:45, sold:800, verified:false, origin:'China' },
  { id:'7', name:{ar:'ألعاب تعليمية للأطفال بالجملة',en:'Educational Toys Bulk',zh:'教育玩具批发',tr:'Toplu Eğitici Oyuncak'}, desc:{ar:'ألعاب تعليمية آمنة للأطفال 3-10 سنوات',en:'Safe educational toys for children 3-10 years'}, price:8, moq:300, stock:15000, category:'electronics', images:['https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500'], sellerId:'s7', sellerName:'ID Toys Factory', sellerCountry:'🇮🇩', rating:4.6, reviews:178, sold:25000, verified:true, featured:true, origin:'Indonesia' },
  { id:'8', name:{ar:'قطع غيار سيارات بالجملة',en:'Car Parts Wholesale',zh:'汽车零部件批发',tr:'Toptan Oto Yedek Parça'}, desc:{ar:'قطع غيار أصلية وبديلة لجميع الماركات',en:'OEM and aftermarket parts for all brands'}, price:50, moq:100, stock:8000, category:'auto', images:['https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=500'], sellerId:'s8', sellerName:'TR Auto Parts', sellerCountry:'🇹🇷', rating:4.5, reviews:92, sold:5000, verified:true, origin:'Turkey' },
  { id:'9', name:{ar:'تمور فاخرة سعودية بالجملة',en:'Premium Saudi Dates Bulk',zh:'优质沙特椰枣批发',tr:'Toptan Premium Hurma'}, desc:{ar:'تمور سعودية فاخرة مع شهادات دولية',en:'Premium Saudi dates with international certificates'}, price:12, moq:100, stock:10000, category:'food', images:['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500'], sellerId:'s9', sellerName:'Saudi Dates Co', sellerCountry:'🇸🇦', rating:4.9, reviews:312, sold:50000, verified:true, featured:true, origin:'Saudi Arabia' },
  { id:'10', name:{ar:'حرير هندي فاخر بالمتر',en:'Premium Indian Silk Fabric',zh:'优质印度丝绸面料',tr:'Premium Hint İpeği'}, desc:{ar:'أقمشة حرير هندي أصيل بألوان متعددة',en:'Authentic Indian silk fabric in multiple colors'}, price:18, moq:50, stock:3000, category:'fashion', images:['https://images.unsplash.com/photo-1558171813-4c088753af8f?w=500'], sellerId:'s10', sellerName:'India Silk House', sellerCountry:'🇮🇳', rating:4.7, reviews:156, sold:12000, verified:true, origin:'India' },
  { id:'11', name:{ar:'قهوة برازيلية فاخرة',en:'Premium Brazilian Coffee',zh:'优质巴西咖啡',tr:'Premium Brezilya Kahvesi'}, desc:{ar:'حبوب قهوة برازيلية عضوية 100%',en:'100% organic Brazilian coffee beans'}, price:22, oldPrice:30, moq:50, stock:5000, category:'food', images:['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500'], sellerId:'s11', sellerName:'Brazil Coffee Export', sellerCountry:'🇧🇷', rating:4.8, reviews:234, sold:18000, verified:true, origin:'Brazil' },
  { id:'12', name:{ar:'لابتوب أعمال احترافي',en:'Professional Business Laptop',zh:'专业商务笔记本电脑',tr:'Profesyonel İş Laptopu'}, desc:{ar:'لابتوب i7 جيل 12 رام 16GB شاشة 14 بوصة',en:'Laptop i7 12th Gen 16GB RAM 14" FHD display'}, price:850, oldPrice:1100, moq:10, stock:200, category:'electronics', images:['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'], sellerId:'s12', sellerName:'US Tech Wholesale', sellerCountry:'🇺🇸', rating:4.6, reviews:89, sold:3000, verified:true, featured:true, origin:'USA' },
];

/* ================================================================
   SUBSCRIPTION PLANS
   ================================================================ */
const PLANS: SubPlan[] = [
  { id:'free', name:{ar:'أساسي',en:'Basic'}, price:0, icon:'🥉', color:'from-gray-400 to-gray-500', features:['10 منتجات','دعم بريد إلكتروني','تقارير أساسية'], maxProducts:10, commission:8 },
  { id:'silver', name:{ar:'فضي',en:'Silver'}, price:29, icon:'🥈', color:'from-slate-400 to-slate-500', features:['100 منتج','دعم مباشر','تقارير متقدمة','منتجات مميزة'], maxProducts:100, commission:6 },
  { id:'gold', name:{ar:'ذهبي',en:'Gold'}, price:99, icon:'🥇', color:'from-amber-400 to-amber-600', features:['500 منتج','فيديو للمنتجات','أولوية في البحث','تحليلات متقدمة'], maxProducts:500, commission:4, popular:true },
  { id:'diamond', name:{ar:'ماسي',en:'Diamond'}, price:299, icon:'💎', color:'from-cyan-400 to-blue-500', features:['منتجات غير محدودة','مدير حساب مخصص','دعم 24/7','كل المميزات'], maxProducts:999999, commission:2 },
];

/* ================================================================
   CONTEXT
   ================================================================ */
interface AppCtx {
  lang: Language; country: Country; setLang: (l: Language) => void; setCountry: (c: Country) => void;
  user: { name: string; email: string; photo: string } | null; login: (n: string, e: string) => void; doLogout: () => void;
  cart: CartItem[]; addCart: (p: Product, q: number) => void; removeCart: (id: string) => void; updateQty: (id: string, d: number) => void;
  favs: string[]; toggleFav: (id: string) => void;
  orders: Order[]; createOrder: (p: Product, q: number) => void;
  notifs: Notif[]; markRead: (id: string) => void;
  toast: (msg: string, type?: ToastItem['type']) => void;
  page: Page; setPage: (p: Page) => void;
  openProduct: (p: Product) => void; openOrder: (p: Product) => void; openAuth: () => void;
  formatPrice: (usd: number) => string;
}
const Ctx = createContext<AppCtx | null>(null);
const useApp = () => { const c = useContext(Ctx); if (!c) throw new Error('No ctx'); return c; };

/* ================================================================
   UTILITY COMPONENTS
   ================================================================ */
function ToastContainer({ items }: { items: ToastItem[] }) {
  if (!items.length) return null;
  const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Zap };
  const colors = { success: 'text-emerald-400', error: 'text-red-400', warning: 'text-amber-400', info: 'text-blue-400' };
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[10000] flex flex-col gap-2">
      {items.map(t => { const I = icons[t.type]; return (
        <div key={t.id} className="bg-slate-900 text-white px-5 py-3 rounded-full text-sm font-medium flex items-center gap-3 shadow-2xl" style={{animation:'slideDown .3s ease-out'}}>
          <I size={16} className={colors[t.type]} /> {t.msg}
        </div>
      ); })}
    </div>
  );
}

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto" style={{animation:'fadeIn .2s'}} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`bg-white rounded-t-3xl sm:rounded-2xl w-full ${wide ? 'max-w-4xl' : 'max-w-lg'} max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl`} style={{animation:'slideUp .35s ease-out'}}>
        <div className="bg-gradient-to-l from-blue-600 via-blue-700 to-indigo-700 text-white px-6 py-4 flex justify-between items-center rounded-t-3xl sm:rounded-t-2xl shrink-0 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
          <h3 className="font-bold text-lg relative z-10">{title}</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-xl transition-colors relative z-10"><X size={18} /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

function Stars({ r, s = 14 }: { r: number; s?: number }) {
  return <div className="flex text-amber-400 gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} size={s} fill={i <= Math.round(r) ? 'currentColor' : 'none'} />)}</div>;
}

function LoadingScreen() {
  const [p, setP] = useState(0);
  useEffect(() => { const t = setInterval(() => setP(v => v >= 100 ? (clearInterval(t), 100) : v + Math.random() * 15 + 5), 200); return () => clearInterval(t); }, []);
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex flex-col items-center justify-center z-[99999]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" style={{animation:'float 6s ease-in-out infinite'}} />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" style={{animation:'float 8s ease-in-out infinite reverse'}} />
      </div>
      <div className="relative z-10 text-center">
        <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6 mx-auto border border-white/20" style={{animation:'float 3s ease-in-out infinite'}}>
          <span className="text-5xl">🌐</span>
        </div>
        <h1 className="text-white text-3xl font-extrabold mb-2">Global Market<span className="text-amber-400 mx-1">Pro</span></h1>
        <p className="text-blue-200 text-sm mb-6">B2B Marketplace</p>
        <div className="w-56 mx-auto">
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-l from-amber-400 to-amber-300 rounded-full transition-all duration-300" style={{width:`${Math.min(p,100)}%`}} />
          </div>
          <p className="text-blue-200/60 text-xs">{Math.min(Math.round(p), 100)}%</p>
        </div>
      </div>
      <div className="absolute bottom-10 flex gap-6 text-white/40 text-xs">
        <span>🔒 Secure</span><span>🌍 190+ Countries</span><span>⚡ Fast</span>
      </div>
    </div>
  );
}

/* ================================================================
   HEADER
   ================================================================ */
function Header() {
  const app = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [search, setSearch] = useState('');
  const [selCat, setSelCat] = useState('all');
  const unread = app.notifs.filter(n => !n.read).length;
  const cartCount = app.cart.reduce((s, i) => s + i.qty, 0);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <button onClick={() => app.setPage('home')} className="flex items-center gap-2 text-xl font-bold shrink-0">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"><Globe size={18} className="text-amber-400" /></div>
            <span className="hidden sm:block">Global Market</span>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative flex">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('search', app.lang.code)}
                className="flex-1 px-4 py-2 text-gray-800 rounded-r-lg border-0 focus:ring-2 focus:ring-amber-400 text-sm" />
              <button className="px-5 bg-amber-500 hover:bg-amber-400 text-blue-900 font-bold rounded-l-lg"><Search size={16} /></button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Language */}
            <div className="relative">
              <button onClick={() => setShowLang(!showLang)} className="flex items-center gap-1 p-2 hover:bg-white/10 rounded-lg text-xs">
                <span className="text-lg">{app.lang.flag}</span>
                <ChevronDown size={12} />
              </button>
              {showLang && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto" style={{animation:'slideDown .2s'}}>
                  <div className="p-2 border-b border-gray-100 bg-gray-50"><span className="text-xs font-bold text-gray-500">🌍 {t('selectLanguage', app.lang.code)}</span></div>
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => { app.setLang(l); setShowLang(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-blue-50 transition-colors ${app.lang.code === l.code ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-700'}`}>
                      <span className="text-lg">{l.flag}</span><span>{l.native}</span>
                      {app.lang.code === l.code && <CheckCircle size={14} className="mr-auto text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setShowNotifs(!showNotifs)} className="p-2 hover:bg-white/10 rounded-lg relative">
                <Bell size={18} />
                {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-[9px] rounded-full flex items-center justify-center animate-pulse">{unread}</span>}
              </button>
              {showNotifs && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-2xl border overflow-hidden z-50" style={{animation:'slideDown .2s'}}>
                  <div className="p-3 border-b flex justify-between items-center">
                    <span className="font-bold text-gray-800 text-sm">{t('notifications', app.lang.code)}</span>
                    <button onClick={() => app.notifs.forEach(n => app.markRead(n.id))} className="text-xs text-blue-600">{t('markAllRead', app.lang.code)}</button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {app.notifs.length === 0 ? <p className="p-6 text-center text-gray-400 text-sm">{t('noNotifs', app.lang.code)}</p> :
                      app.notifs.map(n => (
                        <div key={n.id} onClick={() => { app.markRead(n.id); setShowNotifs(false); }} className={`p-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 flex gap-3 ${!n.read ? 'bg-blue-50/50' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.type === 'order' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                            {n.type === 'order' ? <ShoppingBag size={14} /> : <Bell size={14} />}
                          </div>
                          <div><p className="font-semibold text-gray-800 text-xs">{n.title}</p><p className="text-gray-500 text-xs">{n.body}</p></div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <button onClick={() => app.setPage('cart')} className="p-2 hover:bg-white/10 rounded-lg relative">
              <ShoppingCart size={18} />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-blue-900 text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>

            {/* User */}
            {app.user ? (
              <button onClick={() => app.setPage('profile')} className="flex items-center gap-2 p-1 hover:bg-white/10 rounded-lg">
                <img src={app.user.photo} alt="" className="w-8 h-8 rounded-full border-2 border-white/50" />
              </button>
            ) : (
              <button onClick={app.openAuth} className="p-2 hover:bg-white/10 rounded-lg"><User size={18} /></button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
          <button onClick={() => setSelCat('all')} className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selCat === 'all' ? 'bg-white text-blue-700' : 'bg-white/10 hover:bg-white/20'}`}>
            {t('allCategories', app.lang.code)}
          </button>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setSelCat(c.id)} className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selCat === c.id ? 'bg-white text-blue-700' : 'bg-white/10 hover:bg-white/20'}`}>
              {c.icon} {c.label[app.lang.code] || c.label.en}
            </button>
          ))}
        </div>
      </div>

      {/* Pass filter state up via hidden input trick - or we use context. Let's store in a ref */}
      <input type="hidden" id="__cat" value={selCat} />
      <input type="hidden" id="__search" value={search} />
    </header>
  );
}

/* ================================================================
   BOTTOM NAV
   ================================================================ */
function BottomNav() {
  const app = useApp();
  const cartCount = app.cart.reduce((s, i) => s + i.qty, 0);
  const items: { id: Page; icon: LucideIcon; label: string }[] = [
    { id: 'home', icon: Home, label: t('home', app.lang.code) },
    { id: 'favorites', icon: Heart, label: t('favorites', app.lang.code) },
    { id: 'cart', icon: ShoppingCart, label: t('cart', app.lang.code) },
    { id: 'profile', icon: User, label: t('profile', app.lang.code) },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
      <div className="flex justify-around items-center py-2">
        {items.map(it => { const I = it.icon; return (
          <button key={it.id} onClick={() => app.setPage(it.id)} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${app.page === it.id ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}>
            <div className="relative"><I size={20} />{it.id === 'cart' && cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center">{cartCount}</span>}</div>
            <span className="text-[10px] font-medium">{it.label}</span>
          </button>
        ); })}
      </div>
    </nav>
  );
}

/* ================================================================
   PRODUCT CARD
   ================================================================ */
function ProductCard({ p, i = 0 }: { p: Product; i?: number }) {
  const app = useApp();
  const isFav = app.favs.includes(p.id);
  const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return (
    <div onClick={() => app.openProduct(p)} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer group"
      style={{ animationDelay: `${i * 60}ms`, animation: 'fadeInUp .5s ease-out both' }}>
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img src={p.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {p.verified && <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">✓ {t('verified', app.lang.code)}</span>}
          {disc > 0 && <span className="bg-gradient-to-l from-red-500 to-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">{disc}% {t('discount', app.lang.code)}</span>}
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={e => { e.stopPropagation(); app.toggleFav(p.id); }} className={`w-8 h-8 rounded-lg flex items-center justify-center shadow ${isFav ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-500 hover:bg-red-500 hover:text-white'} transition-all`}>
            <Heart size={13} fill={isFav ? 'currentColor' : 'none'} />
          </button>
          <button onClick={e => { e.stopPropagation(); app.openOrder(p); }} className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center shadow text-gray-500 hover:bg-blue-500 hover:text-white transition-all">
            <ShoppingCart size={13} />
          </button>
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-lg font-extrabold text-blue-600">{app.formatPrice(p.price)}</span>
          {p.oldPrice && <span className="text-[10px] text-gray-400 line-through">{app.formatPrice(p.oldPrice)}</span>}
          <span className="text-[9px] text-gray-400 mr-auto">/{p.moq}+</span>
        </div>
        <h3 className="text-xs font-bold text-gray-800 mb-1.5 line-clamp-2 leading-relaxed group-hover:text-blue-600 transition-colors">
          {p.name[app.lang.code] || p.name.en || p.name.ar}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <Stars r={p.rating} s={10} />
          <span className="text-[10px] text-gray-400">({p.reviews})</span>
          <span className="text-[10px] text-emerald-600 font-semibold mr-auto">{p.sold.toLocaleString()} {t('sold', app.lang.code)}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{p.sellerCountry}</span>
            <span className="text-[10px] text-gray-500">{p.sellerName}</span>
          </div>
          <span className="text-[9px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">📍 {p.origin}</span>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   PAGES
   ================================================================ */
function HomePage() {
  const app = useApp();
  const [banner, setBanner] = useState(0);
  useEffect(() => { const t = setInterval(() => setBanner(v => (v + 1) % 3), 5000); return () => clearInterval(t); }, []);

  const catFilter = (document.getElementById('__cat') as HTMLInputElement)?.value || 'all';
  const searchFilter = (document.getElementById('__search') as HTMLInputElement)?.value || '';

  const filtered = PRODUCTS.filter(p => {
    if (catFilter !== 'all' && p.category !== catFilter) return false;
    if (searchFilter.length >= 2) { const q = searchFilter.toLowerCase(); return (p.name.en || '').toLowerCase().includes(q) || (p.name.ar || '').toLowerCase().includes(q); }
    return true;
  });

  const heroData = [
    { title: t('heroTitle1', app.lang.code), sub: t('heroSub1', app.lang.code), cta: t('heroCta1', app.lang.code), grad: 'from-blue-600 via-indigo-600 to-purple-700', emoji: '🌍' },
    { title: t('heroTitle2', app.lang.code), sub: t('heroSub2', app.lang.code), cta: t('heroCta2', app.lang.code), grad: 'from-orange-500 via-red-500 to-pink-600', emoji: '🔥' },
    { title: t('heroTitle3', app.lang.code), sub: t('heroSub3', app.lang.code), cta: t('heroCta3', app.lang.code), grad: 'from-emerald-500 via-teal-500 to-cyan-600', emoji: '🚀' },
  ];

  const isHome = catFilter === 'all' && searchFilter.length < 2;

  return (
    <div className="space-y-6">
      {isHome && <>
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl shadow-lg" style={{animation:'fadeInUp .5s'}}>
          {heroData.map((h, i) => (
            <div key={i} className={`bg-gradient-to-l ${h.grad} p-6 sm:p-8 text-white relative ${i === banner ? 'block' : 'hidden'}`}>
              <div className="absolute -top-20 -left-20 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-white/5 rounded-full" />
              <div className="relative z-10 max-w-lg">
                <span className="text-4xl mb-3 block" style={{animation:'float 3s ease-in-out infinite'}}>{h.emoji}</span>
                <h2 className="text-xl sm:text-2xl font-black mb-2">{h.title}</h2>
                <p className="text-white/80 mb-4 text-sm">{h.sub}</p>
                <button className="bg-white text-gray-800 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/90 flex items-center gap-2">{h.cta} <ArrowLeft size={14} /></button>
              </div>
            </div>
          ))}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {[0,1,2].map(i => <button key={i} onClick={() => setBanner(i)} className={`h-1.5 rounded-full transition-all ${i === banner ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />)}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" style={{animation:'fadeInUp .6s'}}>
          {[
            { icon: Globe, val: '190+', label: t('countries190', app.lang.code), color: 'bg-blue-50 text-blue-600' },
            { icon: Shield, val: '50K+', label: t('verifiedSuppliers', app.lang.code), color: 'bg-emerald-50 text-emerald-600' },
            { icon: Truck, val: '1M+', label: t('successfulShipments', app.lang.code), color: 'bg-purple-50 text-purple-600' },
            { icon: Zap, val: '99%', label: t('satisfaction', app.lang.code), color: 'bg-amber-50 text-amber-600' },
          ].map((s, i) => { const I = s.icon; return (
            <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><I size={18} /></div>
              <div><div className="text-lg font-black text-gray-800">{s.val}</div><div className="text-[10px] text-gray-500">{s.label}</div></div>
            </div>
          ); })}
        </div>

        {/* Categories */}
        <div style={{animation:'fadeInUp .7s'}}>
          <h2 className="text-base font-extrabold text-gray-800 mb-3">📂 {t('browseCategories', app.lang.code)}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORIES.map(c => (
              <button key={c.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">{c.icon}</span>
                <p className="text-xs font-bold text-gray-700">{c.label[app.lang.code] || c.label.en}</p>
                <p className={`text-[9px] font-semibold mt-0.5 bg-gradient-to-l ${c.color} bg-clip-text text-transparent`}>{c.count}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Hot Deals */}
        {PRODUCTS.filter(p => p.oldPrice).length > 0 && (
          <div style={{animation:'fadeInUp .8s'}}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-extrabold text-gray-800 flex items-center gap-2">🔥 {t('hotDeals', app.lang.code)}
                <span className="text-[10px] font-bold text-white bg-gradient-to-l from-red-500 to-pink-500 px-2 py-0.5 rounded-md">{t('discountUp', app.lang.code)}</span>
              </h2>
              <button className="text-blue-600 text-xs font-semibold flex items-center gap-1">{t('viewAll', app.lang.code)} <ArrowLeft size={12} /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {PRODUCTS.filter(p => p.oldPrice).slice(0, 4).map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
            </div>
          </div>
        )}
      </>}

      {/* All Products */}
      <div style={{animation:'fadeInUp .9s'}}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold text-gray-800">🏷️ {isHome ? t('allProducts', app.lang.code) : `${t('products', app.lang.code)}`}
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md mx-2">{filtered.length}</span>
          </h2>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl"><Package size={48} className="mx-auto mb-3 text-gray-300" /><h3 className="font-bold text-gray-600 mb-1">{t('noProducts', app.lang.code)}</h3><p className="text-xs text-gray-400">{t('tryDifferent', app.lang.code)}</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">{filtered.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div>
        )}
      </div>

      {/* CTA */}
      {isHome && (
        <div className="bg-gradient-to-l from-gray-800 to-gray-900 rounded-2xl p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-2">🚀 {t('startSelling', app.lang.code)}</h3>
            <p className="text-gray-400 mb-4 text-sm max-w-md mx-auto">{t('sellDescription', app.lang.code)}</p>
            <button className="bg-gradient-to-l from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm">{t('createStore', app.lang.code)} ←</button>
          </div>
        </div>
      )}
    </div>
  );
}

function FavoritesPage() {
  const app = useApp();
  const favProds = PRODUCTS.filter(p => app.favs.includes(p.id));
  if (!favProds.length) return (
    <div className="text-center py-16 bg-white rounded-2xl"><Heart size={48} className="mx-auto mb-3 text-red-300" /><h3 className="font-bold text-gray-600 mb-1">{t('emptyFav', app.lang.code)}</h3>
      <button onClick={() => app.setPage('home')} className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold">{t('browseProducts', app.lang.code)}</button></div>
  );
  return (<div><h2 className="text-base font-bold text-gray-800 mb-4">❤️ {t('favorites', app.lang.code)} ({favProds.length})</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">{favProds.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div></div>);
}

function CartPage() {
  const app = useApp();
  if (!app.cart.length) return (
    <div className="text-center py-16 bg-white rounded-2xl"><ShoppingCart size={48} className="mx-auto mb-3 text-blue-300" /><h3 className="font-bold text-gray-600 mb-1">{t('emptyCart', app.lang.code)}</h3>
      <button onClick={() => app.setPage('home')} className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold">{t('browseProducts', app.lang.code)}</button></div>
  );
  const total = app.cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  return (
    <div>
      <h2 className="text-base font-bold text-gray-800 mb-4">🛒 {t('cart', app.lang.code)} ({app.cart.length})</h2>
      <div className="grid lg:grid-cols-[1fr_280px] gap-4">
        <div className="space-y-3">
          {app.cart.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border p-3 flex gap-3">
              <img src={item.product.images[0]} alt="" className="w-20 h-20 object-cover rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 text-xs line-clamp-1">{item.product.name[app.lang.code] || item.product.name.en}</h4>
                <div className="text-blue-600 font-extrabold text-lg">{app.formatPrice(item.product.price)}</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
                    <button onClick={() => app.updateQty(item.id, -1)} className="w-7 h-7 rounded flex items-center justify-center hover:bg-white text-gray-600"><Minus size={12} /></button>
                    <span className="font-bold text-sm w-8 text-center">{item.qty}</span>
                    <button onClick={() => app.updateQty(item.id, 1)} className="w-7 h-7 rounded flex items-center justify-center hover:bg-white text-gray-600"><Plus size={12} /></button>
                  </div>
                  <span className="text-xs text-gray-400">= {app.formatPrice(item.product.price * item.qty)}</span>
                  <button onClick={() => app.removeCart(item.id)} className="mr-auto bg-red-50 text-red-500 p-1.5 rounded-lg"><XCircle size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 h-fit sticky top-36">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">{t('total', app.lang.code)}</h3>
          <div className="flex justify-between mb-2 text-sm"><span className="text-gray-500">{t('subtotal', app.lang.code)}</span><span className="font-semibold">{app.formatPrice(total)}</span></div>
          <div className="flex justify-between mb-3 text-sm"><span className="text-gray-500">{t('shipping', app.lang.code)}</span><span className="text-emerald-600 font-bold">{t('free', app.lang.code)} 🎉</span></div>
          <div className="border-t pt-3 mb-4 flex justify-between"><span className="font-extrabold">{t('total', app.lang.code)}</span><span className="text-xl font-black text-blue-600">{app.formatPrice(total)}</span></div>
          <button onClick={() => { app.cart.forEach(i => app.createOrder(i.product, i.qty)); app.toast(t('orderCreated', app.lang.code), 'success'); }}
            className="w-full bg-gradient-to-l from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm">
            <CreditCard size={16} /> {t('checkout', app.lang.code)}
          </button>
          <div className="grid grid-cols-3 gap-1 mt-3 text-center">
            <div className="p-1.5"><Shield size={14} className="mx-auto text-emerald-500 mb-0.5" /><span className="text-[8px] text-gray-400">{t('protection', app.lang.code)}</span></div>
            <div className="p-1.5"><Truck size={14} className="mx-auto text-blue-500 mb-0.5" /><span className="text-[8px] text-gray-400">{t('fastShipping', app.lang.code)}</span></div>
            <div className="p-1.5"><RotateCcw size={14} className="mx-auto text-amber-500 mb-0.5" /><span className="text-[8px] text-gray-400">{t('easyReturn', app.lang.code)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersPage() {
  const app = useApp();
  const statusMap: Record<string, { label: string; color: string; icon: LucideIcon }> = {
    pending: { label: t('pending', app.lang.code), color: 'bg-amber-50 text-amber-600', icon: Clock },
    shipped: { label: t('shipped', app.lang.code), color: 'bg-purple-50 text-purple-600', icon: Truck },
    delivered: { label: t('delivered', app.lang.code), color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
    cancelled: { label: t('cancelled', app.lang.code), color: 'bg-red-50 text-red-600', icon: XCircle },
  };
  if (!app.user) return <div className="text-center py-16 bg-white rounded-2xl"><Package size={48} className="mx-auto mb-3 text-gray-300" /><button onClick={app.openAuth} className="mt-2 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold">{t('login', app.lang.code)}</button></div>;
  if (!app.orders.length) return <div className="text-center py-16 bg-white rounded-2xl"><Package size={48} className="mx-auto mb-3 text-gray-300" /><h3 className="font-bold text-gray-600">{t('noOrders', app.lang.code)}</h3></div>;
  return (
    <div><h2 className="text-base font-bold text-gray-800 mb-4">📦 {t('orders', app.lang.code)} ({app.orders.length})</h2>
      <div className="space-y-3">{app.orders.map(o => {
        const st = statusMap[o.status] || statusMap.pending; const I = st.icon;
        return (
          <div key={o.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 flex gap-3">
              <img src={o.product.images[0]} alt="" className="w-20 h-20 object-cover rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 text-xs truncate">{o.product.name[app.lang.code] || o.product.name.en}</h4>
                <div className="text-xs text-gray-500">{t('quantity', app.lang.code)}: {o.qty}</div>
                <div className="text-blue-600 font-bold text-lg">{app.formatPrice(o.total)}</div>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold h-fit ${st.color}`}><I size={12} />{st.label}</span>
            </div>
            <div className="px-4 py-2 border-t bg-gray-50/50 flex justify-between text-[10px] text-gray-400">
              <span>{o.date.toLocaleDateString()}</span><span>{t('orderNumber', app.lang.code)}: #{o.id.slice(-6)}</span>
            </div>
          </div>
        );
      })}</div>
    </div>
  );
}

function DashboardPage() {
  const app = useApp();
  if (!app.user) return <div className="text-center py-16 bg-white rounded-2xl"><button onClick={app.openAuth} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold">{t('login', app.lang.code)}</button></div>;
  const totalSales = app.orders.reduce((s, o) => s + o.total, 0);
  const commission = totalSales * 0.05;
  const stats: { icon: LucideIcon; val: string; label: string; color: string; change?: string }[] = [
    { icon: DollarSign, val: app.formatPrice(totalSales), label: t('totalSales', app.lang.code), color: 'from-blue-500 to-blue-600', change: '+12%' },
    { icon: ShoppingBag, val: String(app.orders.length), label: t('totalOrders', app.lang.code), color: 'from-emerald-500 to-emerald-600', change: '+8%' },
    { icon: Package, val: String(PRODUCTS.length), label: t('products', app.lang.code), color: 'from-purple-500 to-purple-600' },
    { icon: DollarSign, val: app.formatPrice(commission), label: t('commission', app.lang.code) + ' (5%)', color: 'from-amber-500 to-amber-600' },
  ];
  return (
    <div>
      <h2 className="text-base font-bold text-gray-800 mb-4">📊 {t('dashboard', app.lang.code)}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => { const I = s.icon; return (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 border">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}><I size={18} className="text-white" /></div>
            <div className="text-xl font-extrabold text-gray-800 mb-0.5">{s.val}</div>
            <div className="text-[10px] text-gray-500">{s.label}</div>
            {s.change && <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-500 font-medium"><TrendingUp size={10} />{s.change}</div>}
          </div>
        ); })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Crown, label: t('subscription', app.lang.code), page: 'subscription' as Page, color: 'from-amber-500 to-orange-500' },
          { icon: DollarSign, label: t('wallet', app.lang.code), page: 'wallet' as Page, color: 'from-emerald-500 to-teal-500' },
          { icon: Gift, label: t('referral', app.lang.code), page: 'referral' as Page, color: 'from-purple-500 to-pink-500' },
          { icon: BarChart3, label: t('reports', app.lang.code), page: 'reports' as Page, color: 'from-blue-500 to-indigo-500' },
        ].map((a, i) => { const I = a.icon; return (
          <button key={i} onClick={() => app.setPage(a.page)} className={`bg-gradient-to-br ${a.color} text-white rounded-xl p-4 text-center hover:shadow-lg transition-all`}>
            <I size={24} className="mx-auto mb-2" /><span className="text-xs font-bold">{a.label}</span>
          </button>
        ); })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-4 py-3 border-b"><h3 className="font-bold text-gray-800 text-sm">{t('recentOrders', app.lang.code)}</h3></div>
        {app.orders.length === 0 ? <p className="p-8 text-center text-gray-400 text-sm">{t('noOrders', app.lang.code)}</p> :
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-xs text-gray-500"><th className="text-right px-4 py-2">{t('products', app.lang.code)}</th><th className="text-right px-4 py-2">{t('quantity', app.lang.code)}</th><th className="text-right px-4 py-2">{t('total', app.lang.code)}</th></tr></thead>
              <tbody>{app.orders.slice(0, 5).map(o => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-xs">{(o.product.name[app.lang.code] || o.product.name.en || '').slice(0, 30)}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{o.qty}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-blue-600">{app.formatPrice(o.total)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        }
      </div>
    </div>
  );
}

function SubscriptionPage() {
  const app = useApp();
  return (
    <div>
      <h2 className="text-base font-bold text-gray-800 mb-2">👑 {t('choosePlan', app.lang.code)}</h2>
      <p className="text-xs text-gray-500 mb-6">{t('platformFee', app.lang.code)}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map(plan => (
          <div key={plan.id} className={`bg-white rounded-2xl shadow-sm border p-5 relative ${plan.popular ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}>
            {plan.popular && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full">⭐ {t('featuredProducts', app.lang.code)}</span>}
            <div className="text-center mb-4">
              <span className="text-3xl block mb-2">{plan.icon}</span>
              <h3 className="text-lg font-extrabold text-gray-800">{plan.name[app.lang.code] || plan.name.en}</h3>
              <div className="text-2xl font-black text-blue-600 mt-2">{plan.price === 0 ? t('free', app.lang.code) : `${app.formatPrice(plan.price)}`}<span className="text-xs text-gray-400 font-normal">/{t('month', app.lang.code)}</span></div>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f, i) => <li key={i} className="flex items-center gap-2 text-xs text-gray-600"><CheckCircle size={14} className="text-emerald-500 shrink-0" />{f}</li>)}
              <li className="flex items-center gap-2 text-xs text-gray-600"><Package size={14} className="text-blue-500 shrink-0" />{plan.maxProducts === 999999 ? '∞' : plan.maxProducts} {t('maxProducts', app.lang.code)}</li>
              <li className="flex items-center gap-2 text-xs text-gray-600"><DollarSign size={14} className="text-amber-500 shrink-0" />{plan.commission}% {t('commissionFee', app.lang.code)}</li>
            </ul>
            <button className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${plan.popular ? 'bg-gradient-to-l from-blue-600 to-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {plan.price === 0 ? t('currentPlan', app.lang.code) : t('upgrade', app.lang.code)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function WalletPage() {
  const app = useApp();
  const totalSales = app.orders.reduce((s, o) => s + o.total, 0);
  const commission = totalSales * 0.05;
  const balance = totalSales - commission;
  return (
    <div>
      <h2 className="text-base font-bold text-gray-800 mb-4">💰 {t('wallet', app.lang.code)}</h2>
      <div className="bg-gradient-to-l from-blue-600 to-indigo-600 text-white rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/5 rounded-full" />
        <p className="text-blue-200 text-xs mb-1">{t('balance', app.lang.code)}</p>
        <div className="text-3xl font-black mb-4">{app.formatPrice(balance)}</div>
        <div className="flex gap-3">
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Plus size={14} />{t('deposit', app.lang.code)}</button>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><ArrowLeft size={14} />{t('withdraw', app.lang.code)}</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center"><div className="text-lg font-black text-emerald-600">{app.formatPrice(totalSales)}</div><div className="text-[10px] text-gray-500">{t('totalSales', app.lang.code)}</div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center"><div className="text-lg font-black text-red-500">{app.formatPrice(commission)}</div><div className="text-[10px] text-gray-500">{t('commission', app.lang.code)} (5%)</div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center"><div className="text-lg font-black text-blue-600">{app.formatPrice(balance)}</div><div className="text-[10px] text-gray-500">{t('balance', app.lang.code)}</div></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-4"><h3 className="font-bold text-gray-800 text-sm mb-3">{t('transactionHistory', app.lang.code)}</h3>
        {app.orders.length === 0 ? <p className="text-center text-gray-400 text-sm py-8">{t('noOrders', app.lang.code)}</p> :
          app.orders.slice(0, 5).map(o => (
            <div key={o.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><DollarSign size={14} className="text-emerald-600" /></div>
              <div className="flex-1"><p className="text-xs font-semibold text-gray-800">{(o.product.name[app.lang.code] || o.product.name.en || '').slice(0, 25)}</p><p className="text-[10px] text-gray-400">{o.date.toLocaleDateString()}</p></div>
              <span className="text-xs font-bold text-emerald-600">+{app.formatPrice(o.total * 0.95)}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}

function ReferralPage() {
  const app = useApp();
  const code = 'GM-' + (app.user?.name || 'USER').toUpperCase().slice(0, 4) + '-2024';
  return (
    <div>
      <h2 className="text-base font-bold text-gray-800 mb-4">🎁 {t('referral', app.lang.code)}</h2>
      <div className="bg-gradient-to-l from-purple-600 to-pink-600 text-white rounded-2xl p-6 mb-6 text-center relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-white/5 rounded-full" />
        <Gift size={40} className="mx-auto mb-3" style={{animation:'float 3s ease-in-out infinite'}} />
        <h3 className="text-xl font-black mb-2">{t('inviteFriends', app.lang.code)}</h3>
        <p className="text-white/80 text-sm mb-4">{t('shareReferral', app.lang.code)}</p>
        <div className="bg-white/20 rounded-xl p-3 flex items-center gap-3 max-w-sm mx-auto">
          <span className="flex-1 font-mono font-bold text-sm">{code}</span>
          <button onClick={() => { navigator.clipboard?.writeText(code); app.toast(t('copyLink', app.lang.code), 'success'); }} className="bg-white text-purple-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"><Copy size={12} />{t('copyLink', app.lang.code)}</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center"><Users size={20} className="mx-auto text-purple-500 mb-2" /><div className="text-xl font-black text-gray-800">0</div><div className="text-[10px] text-gray-500">{t('referralsCount', app.lang.code)}</div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center"><DollarSign size={20} className="mx-auto text-emerald-500 mb-2" /><div className="text-xl font-black text-gray-800">{app.formatPrice(0)}</div><div className="text-[10px] text-gray-500">{t('referralEarnings', app.lang.code)}</div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border text-center"><Sparkles size={20} className="mx-auto text-amber-500 mb-2" /><div className="text-xl font-black text-gray-800">1%</div><div className="text-[10px] text-gray-500">{t('commissionRate', app.lang.code)}</div></div>
      </div>
    </div>
  );
}

function ReportsPage() {
  const app = useApp();
  return (
    <div>
      <h2 className="text-base font-bold text-gray-800 mb-4">📈 {t('reports', app.lang.code)}</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: BarChart3, label: t('salesReport', app.lang.code), color: 'from-blue-500 to-indigo-500' },
          { icon: Package, label: t('productsReport', app.lang.code), color: 'from-emerald-500 to-teal-500' },
          { icon: Users, label: t('referral', app.lang.code), color: 'from-purple-500 to-pink-500' },
          { icon: DollarSign, label: t('commission', app.lang.code), color: 'from-amber-500 to-orange-500' },
        ].map((r, i) => { const I = r.icon; return (
          <div key={i} className={`bg-gradient-to-br ${r.color} text-white rounded-2xl p-6 text-center cursor-pointer hover:shadow-lg transition-all`}>
            <I size={32} className="mx-auto mb-3" />
            <h3 className="font-bold text-sm mb-1">{r.label}</h3>
            <p className="text-white/70 text-xs">{t('comingSoon', app.lang.code)}</p>
          </div>
        ); })}
      </div>
    </div>
  );
}

function ProfilePage() {
  const app = useApp();
  if (!app.user) return (
    <div className="text-center py-16 bg-white rounded-2xl"><span className="text-5xl block mb-3">👤</span><h3 className="font-bold text-gray-600 mb-4">{t('login', app.lang.code)}</h3>
      <button onClick={app.openAuth} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm">{t('login', app.lang.code)}</button></div>
  );
  const menuItems: { icon: LucideIcon; label: string; page: Page; count?: number }[] = [
    { icon: ShoppingBag, label: t('orders', app.lang.code), page: 'orders', count: app.orders.length },
    { icon: Heart, label: t('favorites', app.lang.code), page: 'favorites', count: app.favs.length },
    { icon: BarChart3, label: t('dashboard', app.lang.code), page: 'dashboard' },
    { icon: Crown, label: t('subscription', app.lang.code), page: 'subscription' },
    { icon: DollarSign, label: t('wallet', app.lang.code), page: 'wallet' },
    { icon: Gift, label: t('referral', app.lang.code), page: 'referral' },
    { icon: BarChart3, label: t('reports', app.lang.code), page: 'reports' },
  ];
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border p-6 text-center mb-4">
        <img src={app.user.photo} alt="" className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-blue-100 shadow-lg" />
        <h2 className="text-lg font-bold text-gray-800">{app.user.name}</h2>
        <p className="text-xs text-gray-400 mb-4">{app.user.email}</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-xl p-3"><div className="text-lg font-extrabold text-blue-600">{app.orders.length}</div><div className="text-[9px] text-gray-500">{t('orders', app.lang.code)}</div></div>
          <div className="bg-gray-50 rounded-xl p-3"><div className="text-lg font-extrabold text-blue-600">{app.favs.length}</div><div className="text-[9px] text-gray-500">{t('favorites', app.lang.code)}</div></div>
          <div className="bg-gray-50 rounded-xl p-3"><div className="text-lg font-extrabold text-blue-600">{app.cart.length}</div><div className="text-[9px] text-gray-500">{t('cart', app.lang.code)}</div></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-4">
        {menuItems.map((m, i) => { const I = m.icon; return (
          <button key={i} onClick={() => app.setPage(m.page)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center"><I size={16} className="text-blue-600" /></div>
            <span className="flex-1 text-right text-sm font-medium text-gray-700">{m.label}</span>
            {m.count !== undefined && m.count > 0 && <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">{m.count}</span>}
            <ChevronLeft size={14} className="text-gray-300" />
          </button>
        ); })}
      </div>
      <button onClick={() => { app.doLogout(); app.toast(t('logout', app.lang.code), 'success'); }} className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm"><LogOut size={16} />{t('logout', app.lang.code)}</button>
    </div>
  );
}

/* ================================================================
   MODALS
   ================================================================ */
function AuthModal({ onClose }: { onClose: () => void }) {
  const app = useApp();
  const [email, setEmail] = useState(''); const [isReg, setIsReg] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!email.trim()) return; const name = email.split('@')[0]; app.login(name, email); app.toast(`${t('home', app.lang.code)} 🎉`, 'success'); onClose(); };
  const handleGoogle = () => { app.login('Ahmed Trader', 'ahmed@globalmarket.com'); app.toast('Welcome Ahmed! 🎉', 'success'); onClose(); };
  return (
    <Modal title={isReg ? t('register', app.lang.code) : t('login', app.lang.code)} onClose={onClose}>
      <div className="text-center mb-5">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"><span className="text-3xl">🌐</span></div>
        <h3 className="text-base font-extrabold text-gray-800">Global Market Pro</h3>
      </div>
      <div className="space-y-2 mb-5">
        <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 py-3 rounded-xl font-semibold text-sm hover:border-gray-300"><img src="https://www.google.com/favicon.ico" width="16" alt="" />{t('googleLogin', app.lang.code)}</button>
        <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-3 rounded-xl font-semibold text-sm">🍎 {t('appleLogin', app.lang.code)}</button>
      </div>
      <div className="flex items-center gap-4 mb-5"><div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400">{t('orEmail', app.lang.code)}</span><div className="flex-1 h-px bg-gray-200" /></div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative"><Mail size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder={t('email', app.lang.code)} className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-500 outline-none" required /></div>
        <div className="relative"><Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="password" placeholder={t('password', app.lang.code)} className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-500 outline-none" defaultValue="demo123" /></div>
        <button type="submit" className="w-full bg-gradient-to-l from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg">{isReg ? t('register', app.lang.code) : t('login', app.lang.code)} <ArrowLeft size={14} className="inline" /></button>
      </form>
      <p className="text-center text-xs text-gray-500 mt-4">{isReg ? t('haveAccount', app.lang.code) : t('noAccount', app.lang.code)}<button onClick={() => setIsReg(!isReg)} className="text-blue-600 font-bold mx-1">{isReg ? t('login', app.lang.code) : t('createAccount', app.lang.code)}</button></p>
    </Modal>
  );
}

function ProductDetailModal({ p, onClose }: { p: Product; onClose: () => void }) {
  const app = useApp();
  const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return (
    <Modal title={t('productDetails', app.lang.code)} onClose={onClose} wide>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-3"><img src={p.images[0]} alt="" className="w-full aspect-square object-cover" />
            {disc > 0 && <span className="absolute top-3 right-3 bg-gradient-to-l from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-xl">{disc}% {t('discount', app.lang.code)}</span>}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 rounded-xl p-2.5 text-center"><Shield size={16} className="text-blue-600 mx-auto mb-0.5" /><span className="text-[9px] text-blue-700 font-semibold">{t('qualityGuarantee', app.lang.code)}</span></div>
            <div className="bg-emerald-50 rounded-xl p-2.5 text-center"><Truck size={16} className="text-emerald-600 mx-auto mb-0.5" /><span className="text-[9px] text-emerald-700 font-semibold">{t('fastShipping', app.lang.code)}</span></div>
            <div className="bg-amber-50 rounded-xl p-2.5 text-center"><RotateCcw size={16} className="text-amber-600 mx-auto mb-0.5" /><span className="text-[9px] text-amber-700 font-semibold">{t('easyReturn', app.lang.code)}</span></div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">{p.sellerCountry}</span><span className="text-sm font-bold text-gray-700">{p.sellerName}</span>
            {p.verified && <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded mr-auto">✓</span>}
          </div>
          <h2 className="text-base font-extrabold text-gray-800 mb-2">{p.name[app.lang.code] || p.name.en || p.name.ar}</h2>
          <div className="flex items-center gap-2 mb-3"><Stars r={p.rating} s={12} /><span className="text-xs text-gray-400">({p.reviews})</span><span className="text-xs text-emerald-600 font-bold">{p.sold.toLocaleString()} {t('sold', app.lang.code)}</span></div>
          <div className="bg-gradient-to-l from-blue-50 to-indigo-50 rounded-xl p-4 mb-3">
            <div className="flex items-baseline gap-2"><span className="text-2xl font-black text-blue-600">{app.formatPrice(p.price)}</span>{p.oldPrice && <span className="text-sm text-gray-400 line-through">{app.formatPrice(p.oldPrice)}</span>}</div>
            <p className="text-[10px] text-gray-500 mt-1">{t('moq', app.lang.code)}: {p.moq} | {t('stock', app.lang.code)}: {p.stock.toLocaleString()}</p>
          </div>
          <div className="flex gap-2 text-[10px] text-gray-500 mb-3">
            <span className="bg-gray-50 px-2 py-1.5 rounded-lg flex items-center gap-1"><Package size={11} />{p.stock.toLocaleString()}</span>
            <span className="bg-gray-50 px-2 py-1.5 rounded-lg flex items-center gap-1"><MapPin size={11} />{p.origin}</span>
          </div>
          <p className="text-gray-600 text-xs leading-relaxed mb-4">{p.desc[app.lang.code] || p.desc.en || p.desc.ar}</p>
          <div className="flex gap-2">
            <button onClick={() => { onClose(); app.openOrder(p); }} className="flex-1 bg-gradient-to-l from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"><ShoppingCart size={16} />{t('orderNow', app.lang.code)}</button>
            <button onClick={() => app.toast(t('comingSoon', app.lang.code), 'info')} className="bg-gray-100 p-3 rounded-xl"><MessageCircle size={16} className="text-gray-600" /></button>
            <button onClick={() => app.toast('Link copied!', 'success')} className="bg-gray-100 p-3 rounded-xl"><Share2 size={16} className="text-gray-600" /></button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function OrderFormModal({ p, onClose }: { p: Product; onClose: () => void }) {
  const app = useApp();
  const [qty, setQty] = useState(p.moq);
  const total = p.price * qty;
  const [paying, setPaying] = useState(false);
  const [step, setStep] = useState(0);

  const handlePay = async () => {
    setPaying(true); setStep(1); await new Promise(r => setTimeout(r, 800));
    setStep(2); await new Promise(r => setTimeout(r, 600));
    setStep(3); await new Promise(r => setTimeout(r, 400));
    if (!app.user) { app.openAuth(); setPaying(false); return; }
    app.createOrder(p, qty);
    app.toast(t('orderCreated', app.lang.code), 'success');
    setPaying(false); onClose();
  };

  return (
    <Modal title={t('orderNow', app.lang.code)} onClose={onClose}>
      {/* Product */}
      <div className="flex gap-3 p-3 bg-gray-50 rounded-xl mb-4">
        <img src={p.images[0]} alt="" className="w-20 h-20 object-cover rounded-lg" />
        <div><h4 className="font-bold text-gray-800 text-xs line-clamp-1">{p.name[app.lang.code] || p.name.en}</h4><div className="text-blue-600 font-extrabold text-xl">{app.formatPrice(p.price)}</div><div className="text-[10px] text-gray-400">{t('moq', app.lang.code)}: {p.moq}</div></div>
      </div>

      {/* Quantity */}
      <label className="block text-xs font-bold text-gray-700 mb-2">{t('quantity', app.lang.code)}</label>
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => setQty(Math.max(p.moq, qty - 10))} className="w-9 h-9 border-2 rounded-lg flex items-center justify-center hover:bg-gray-50"><Minus size={14} /></button>
        <input type="number" value={qty} onChange={e => setQty(Math.max(p.moq, +e.target.value || p.moq))} className="w-24 text-center py-2 border-2 rounded-lg font-bold outline-none focus:border-blue-500" />
        <button onClick={() => setQty(qty + 10)} className="w-9 h-9 border-2 rounded-lg flex items-center justify-center hover:bg-gray-50"><Plus size={14} /></button>
      </div>
      <div className="flex gap-1.5 mb-4">{[p.moq, p.moq*2, p.moq*5, p.moq*10].map(q => (
        <button key={q} onClick={() => setQty(q)} className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${qty === q ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{q}</button>
      ))}</div>

      {/* Summary */}
      <div className="bg-white border-2 rounded-xl p-4 mb-4">
        <div className="flex justify-between text-xs py-1"><span className="text-gray-500">{t('price', app.lang.code)}</span><span className="font-semibold">{app.formatPrice(p.price)}</span></div>
        <div className="flex justify-between text-xs py-1"><span className="text-gray-500">{t('quantity', app.lang.code)}</span><span className="font-semibold">{qty}</span></div>
        <div className="flex justify-between text-xs py-1"><span className="text-gray-500">{t('shipping', app.lang.code)}</span><span className="text-emerald-600 font-bold">{t('free', app.lang.code)} 🎉</span></div>
        <div className="flex justify-between pt-3 mt-2 border-t-2 border-dashed"><span className="font-extrabold">{t('total', app.lang.code)}</span><span className="text-xl font-black text-blue-600">{app.formatPrice(total)}</span></div>
      </div>

      {/* Payment */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-700 mb-2">{t('paymentMethod', app.lang.code)}</label>
        <div className="space-y-2">
          {[{ icon: '💳', title: t('creditCard', app.lang.code), desc: 'Visa, Mastercard' }, { icon: '🅿️', title: 'PayPal', desc: 'PayPal' }].map((m, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer ${i === 0 ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'}`}>
              <span className="text-xl">{m.icon}</span><div className="flex-1"><div className="font-bold text-xs">{m.title}</div><div className="text-[10px] text-gray-400">{m.desc}</div></div>
              {i === 0 && <CheckCircle size={16} className="text-blue-500" />}
            </div>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="space-y-2 mb-4">
        <input placeholder="0000 0000 0000 0000" className="w-full px-3 py-2.5 border-2 rounded-xl text-xs outline-none focus:border-blue-500 font-mono" defaultValue="4242 4242 4242 4242" />
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="MM/YY" className="px-3 py-2.5 border-2 rounded-xl text-xs outline-none focus:border-blue-500 font-mono" defaultValue="12/26" />
          <input placeholder="CVC" className="px-3 py-2.5 border-2 rounded-xl text-xs outline-none focus:border-blue-500 font-mono" defaultValue="123" />
        </div>
      </div>

      {paying && (
        <div className="mb-4">{['Verifying...', 'Processing...', 'Confirming...'].map((txt, i) => (
          <div key={i} className={`flex items-center gap-2 text-xs py-1 ${step > i ? 'text-emerald-600' : step === i ? 'text-blue-600' : 'text-gray-300'}`}>
            {step > i ? <CheckCircle size={14} /> : step === i ? <Loader2 size={14} className="animate-spin" /> : <div className="w-3.5 h-3.5 rounded-full border-2" />}
            <span className={step >= i ? 'font-semibold' : ''}>{txt}</span>
          </div>
        ))}</div>
      )}

      <div className="flex items-center justify-center gap-3 mb-3 text-[10px] text-gray-400"><Shield size={10} className="text-emerald-500" />SSL<Lock size={10} className="text-blue-500" />PCI DSS</div>

      <button onClick={handlePay} disabled={paying} className="w-full bg-gradient-to-l from-blue-600 to-indigo-600 disabled:opacity-50 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg">
        {paying ? <><Loader2 size={16} className="animate-spin" />{t('processing', app.lang.code)}</> : <><Lock size={14} />{t('confirmPayment', app.lang.code)} - {app.formatPrice(total)}</>}
      </button>
    </Modal>
  );
}

function AddProductModal({ onClose }: { onClose: () => void }) {
  const app = useApp();
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSubmitting(true); await new Promise(r => setTimeout(r, 1500)); app.toast(t('publish', app.lang.code) + ' ✅', 'success'); setSubmitting(false); onClose(); };
  return (
    <Modal title={t('addProduct', app.lang.code)} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block text-xs font-bold text-gray-700 mb-1">{t('images', app.lang.code)}</label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all">
            <Upload size={28} className="text-blue-400 mb-2" /><p className="text-xs text-gray-500">{t('uploadImages', app.lang.code)}</p><input type="file" multiple accept="image/*" className="hidden" />
          </label>
        </div>
        <div><label className="block text-xs font-bold text-gray-700 mb-1">{t('productName', app.lang.code)} *</label><input required className="w-full px-3 py-2.5 border-2 rounded-xl text-sm outline-none focus:border-blue-500" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-bold text-gray-700 mb-1">{t('category', app.lang.code)} *</label>
            <select required className="w-full px-3 py-2.5 border-2 rounded-xl text-sm outline-none focus:border-blue-500 bg-white">
              <option value="">-</option>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label[app.lang.code] || c.label.en}</option>)}
            </select>
          </div>
          <div><label className="block text-xs font-bold text-gray-700 mb-1">{t('price', app.lang.code)} ($) *</label><input type="number" required step="0.01" min="0.01" className="w-full px-3 py-2.5 border-2 rounded-xl text-sm outline-none focus:border-blue-500" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-bold text-gray-700 mb-1">{t('moq', app.lang.code)} *</label><input type="number" required min="1" className="w-full px-3 py-2.5 border-2 rounded-xl text-sm outline-none focus:border-blue-500" /></div>
          <div><label className="block text-xs font-bold text-gray-700 mb-1">{t('stock', app.lang.code)} *</label><input type="number" required min="0" className="w-full px-3 py-2.5 border-2 rounded-xl text-sm outline-none focus:border-blue-500" /></div>
        </div>
        <div><label className="block text-xs font-bold text-gray-700 mb-1">{t('description', app.lang.code)} *</label><textarea required rows={3} className="w-full px-3 py-2.5 border-2 rounded-xl text-sm outline-none focus:border-blue-500 resize-none" /></div>
        <button type="submit" disabled={submitting} className="w-full bg-gradient-to-l from-blue-600 to-indigo-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg">
          {submitting ? <><Loader2 size={16} className="animate-spin" /></> : <><Send size={14} />{t('publish', app.lang.code)}</>}
        </button>
      </form>
    </Modal>
  );
}

/* ================================================================
   CHAT WIDGET
   ================================================================ */
function ChatWidget({ seller, onClose }: { seller: string; onClose: () => void }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([{ id: '0', text: 'مرحباً! كيف يمكنني مساعدتك؟', isMe: false, time: new Date() }]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs(prev => [...prev, { id: Date.now().toString(), text: input, isMe: true, time: new Date() }]);
    setInput('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { id: (Date.now() + 1).toString(), text: 'شكراً لتواصلك! سنرد عليك قريباً.', isMe: false, time: new Date() }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-24 left-4 w-[360px] max-w-[calc(100vw-32px)] h-[480px] bg-white rounded-2xl shadow-2xl border flex flex-col z-[999] overflow-hidden" style={{animation:'slideUp .3s ease-out'}}>
      <div className="bg-gradient-to-l from-blue-600 to-indigo-700 text-white p-3 flex justify-between items-center">
        <div className="flex items-center gap-2"><div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center font-bold">{seller.charAt(0)}</div>
          <div><div className="font-bold text-sm">{seller}</div><div className="text-[10px] text-blue-200">Online</div></div>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-lg"><X size={16} /></button>
      </div>
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50 flex flex-col gap-2">
        {msgs.map(m => (
          <div key={m.id} className={`max-w-[80%] ${m.isMe ? 'self-end' : 'self-start'}`}>
            <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${m.isMe ? 'bg-gradient-to-l from-blue-600 to-indigo-600 text-white rounded-bl-md' : 'bg-white text-gray-700 rounded-br-md border shadow-sm'}`}>{m.text}</div>
            <span className={`text-[9px] text-gray-400 mt-0.5 block ${m.isMe ? 'text-left' : 'text-right'}`}>{m.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="p-2 border-t flex gap-2">
        <button className="text-gray-400 p-1"><Paperclip size={14} /></button>
        <button className="text-gray-400 p-1"><Smile size={14} /></button>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="..." className="flex-1 px-3 py-2 border rounded-xl text-xs outline-none focus:border-blue-400" />
        <button onClick={send} disabled={!input.trim()} className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center disabled:opacity-40"><Send size={12} /></button>
      </div>
    </div>
  );
}

/* ================================================================
   MAIN APP
   ================================================================ */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [lang, setLangState] = useState<Language>(LANGUAGES[0]);
  const [country, setCountryState] = useState<Country>(COUNTRIES[0]);
  const [user, setUser] = useState<{ name: string; email: string; photo: string } | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favs, setFavs] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifs, setNotifs] = useState<Notif[]>([
    { id: '1', type: 'system', title: 'مرحباً بك! 🎉', body: 'ابدأ بتصفح المنتجات وأضف إلى السلة', read: false, time: new Date() },
    { id: '2', type: 'order', title: 'عرض خاص! 🔥', body: 'خصومات حتى 50% على الإلكترونيات', read: false, time: new Date() },
  ]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [page, setPage] = useState<Page>('home');
  const [productModal, setProductModal] = useState<Product | null>(null);
  const [orderModal, setOrderModal] = useState<Product | null>(null);
  const [authModal, setAuthModal] = useState(false);
  const [addProductModal, setAddProductModal] = useState(false);
  const [chatSeller, setChatSeller] = useState<string | null>(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 2200); return () => clearTimeout(t); }, []);

  useEffect(() => {
    document.documentElement.lang = lang.code;
    document.documentElement.dir = lang.dir;
    document.body.style.fontFamily = lang.dir === 'rtl' ? "'Tajawal', sans-serif" : "'Inter', sans-serif";
    localStorage.setItem('lang', lang.code);
  }, [lang]);

  useEffect(() => { const saved = localStorage.getItem('lang'); if (saved) { const l = LANGUAGES.find(x => x.code === saved); if (l) setLangState(l); } }, []);

  const toast = useCallback((msg: string, type: ToastItem['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const formatPrice = useCallback((usd: number) => {
    const converted = usd * country.rate;
    if (country.currency === 'USD') return `$${usd.toLocaleString('en-US', { minimumFractionDigits: usd < 100 ? 2 : 0, maximumFractionDigits: 2 })}`;
    return `${converted.toLocaleString(lang.code === 'ar' ? 'ar-SA' : 'en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ${country.symbol}`;
  }, [country, lang]);

  const ctx: AppCtx = {
    lang, country,
    setLang: (l) => { setLangState(l); const c = COUNTRIES.find(x => x.lang === l.code); if (c) setCountryState(c); },
    setCountry: (c) => { setCountryState(c); const l = LANGUAGES.find(x => x.code === c.lang); if (l) setLangState(l); },
    user, login: (n, e) => setUser({ name: n, email: e, photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=2563eb&color=fff` }),
    doLogout: () => { setUser(null); setCart([]); setOrders([]); },
    cart, addCart: (p, q) => { if (!user) { setAuthModal(true); return; } setCart(prev => { const ex = prev.find(i => i.product.id === p.id); if (ex) return prev.map(i => i.product.id === p.id ? { ...i, qty: i.qty + q } : i); return [...prev, { id: p.id, product: p, qty: q }]; }); toast(t('addToCart', lang.code), 'success'); },
    removeCart: (id) => setCart(prev => prev.filter(i => i.id !== id)),
    updateQty: (id, d) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i)),
    favs, toggleFav: (id) => { if (!user) { setAuthModal(true); return; } setFavs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]); },
    orders, createOrder: (p, q) => {
      if (!user) { setAuthModal(true); return; }
      const order: Order = { id: Date.now().toString(), product: p, qty: q, total: p.price * q, status: 'pending', date: new Date() };
      setOrders(prev => [order, ...prev]);
      setNotifs(prev => [{ id: Date.now().toString(), type: 'order', title: t('orderCreated', lang.code), body: `${q}x ${p.name[lang.code] || p.name.en}`, read: false, time: new Date() }, ...prev]);
      setCart(prev => prev.filter(i => i.product.id !== p.id));
    },
    notifs, markRead: (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)),
    toast, page, setPage,
    openProduct: (p) => setProductModal(p),
    openOrder: (p) => setOrderModal(p),
    openAuth: () => setAuthModal(true),
    formatPrice,
  };

  if (loading) return <LoadingScreen />;

  return (
    <Ctx.Provider value={ctx}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <Header />
        <main className="pb-24 pt-4 px-3 max-w-7xl mx-auto">
          {page === 'home' && <HomePage />}
          {page === 'favorites' && <FavoritesPage />}
          {page === 'cart' && <CartPage />}
          {page === 'orders' && <OrdersPage />}
          {page === 'dashboard' && <DashboardPage />}
          {page === 'profile' && <ProfilePage />}
          {page === 'subscription' && <SubscriptionPage />}
          {page === 'wallet' && <WalletPage />}
          {page === 'referral' && <ReferralPage />}
          {page === 'reports' && <ReportsPage />}
        </main>
        <BottomNav />

        {/* FAB */}
        <button onClick={() => user ? setAddProductModal(true) : setAuthModal(true)}
          className="fixed bottom-24 left-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl hover:scale-110 transition-transform flex items-center justify-center z-40" style={{animation:'pulse-glow 2s infinite'}}>
          <Plus size={20} />
        </button>

        {/* Modals */}
        {productModal && <ProductDetailModal p={productModal} onClose={() => setProductModal(null)} />}
        {orderModal && <OrderFormModal p={orderModal} onClose={() => setOrderModal(null)} />}
        {authModal && <AuthModal onClose={() => setAuthModal(false)} />}
        {addProductModal && <AddProductModal onClose={() => setAddProductModal(false)} />}
        {chatSeller && <ChatWidget seller={chatSeller} onClose={() => setChatSeller(null)} />}

        <ToastContainer items={toasts} />
      </div>
    </Ctx.Provider>
  );
}
