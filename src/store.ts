import { useState, useEffect, useCallback } from 'react';
import { auth, db, storage, googleProvider, Timestamp, serverTimestamp, increment, arrayUnion, arrayRemove } from './firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Product, Review, Order, CartItem, Notification, UserProfile, Category, Chat, Message } from './firebase';

export const categories: Category[] = [
  { id: 'machinery', name: 'آلات ومعدات', nameEn: 'Machinery', icon: 'fa-cogs', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', count: 15420, subcategories: ['معدات بناء', 'آلات صناعية', 'معدات زراعية'] },
  { id: 'electronics', name: 'إلكترونيات', nameEn: 'Electronics', icon: 'fa-microchip', image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=400', count: 89300, subcategories: ['هواتف', 'حواسيب', 'أجهزة منزلية'] },
  { id: 'apparel', name: 'أزياء وملابس', nameEn: 'Apparel', icon: 'fa-tshirt', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400', count: 125600, subcategories: ['ملابس رجالية', 'ملابس نسائية', 'أطفال'] },
  { id: 'home', name: 'أثاث ومنزل', nameEn: 'Home & Furniture', icon: 'fa-couch', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', count: 45200, subcategories: ['أثاث', 'ديكور', 'مطبخ'] },
  { id: 'beauty', name: 'جمال وعناية', nameEn: 'Beauty', icon: 'fa-spa', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', count: 32100, subcategories: ['مكياج', 'عناية بالبشرة', 'عطور'] },
  { id: 'sports', name: 'رياضة ولياقة', nameEn: 'Sports', icon: 'fa-running', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', count: 18900, subcategories: ['أدوات رياضية', 'ملابس رياضية', 'معدات خارجية'] },
  { id: 'automotive', name: 'سيارات وقطع', nameEn: 'Automotive', icon: 'fa-car', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400', count: 23400, subcategories: ['قطع غيار', 'إكسسوارات', 'أدوات صيانة'] },
  { id: 'packaging', name: 'تغليف وطباعة', nameEn: 'Packaging', icon: 'fa-box', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400', count: 12800, subcategories: ['مواد تغليف', 'طباعة', 'ملصقات'] },
];

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'حفارة هيدروليكية CAT 320D',
    description: 'حفارة هيدروليكية ثقيلة من كاتربيلر، موديل 2023، ساعات عمل قليلة، جاهزة للتصدير الفوري. تشمل ضمان سنة كاملة وقطع غيار أصلية.',
    price: 125000,
    oldPrice: 145000,
    moq: 1,
    stock: 5,
    category: 'machinery',
    subcategory: 'معدات بناء',
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'
    ],
    sellerId: 'seller1',
    sellerName: 'شركة المعدات الثقيلة',
    sellerPhoto: 'https://ui-avatars.com/api/?name=Heavy+Equipment&background=0D47A1&color=fff',
    sellerVerified: true,
    sellerRating: 4.9,
    rating: 4.8,
    reviewCount: 127,
    sold: 89,
    origin: 'الولايات المتحدة',
    shipping: 'شحن بحري',
    status: 'active',
    featured: true,
    createdAt: Timestamp.fromDate(new Date('2024-01-15'))
  },
  {
    id: '2',
    name: 'خط إنتاج كامل للبلاستيك',
    description: 'خط إنتاج متكامل لصناعة الأكياس البلاستيكية، إنتاجية 500 كجم/ساعة، شامل التركيب والتدريب.',
    price: 85000,
    moq: 1,
    stock: 3,
    category: 'machinery',
    subcategory: 'آلات صناعية',
    images: [
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'
    ],
    sellerId: 'seller2',
    sellerName: 'مصانع التقنية',
    sellerVerified: true,
    sellerRating: 4.7,
    rating: 4.6,
    reviewCount: 45,
    sold: 23,
    origin: 'الصين',
    shipping: 'شحن بحري',
    status: 'active',
    featured: true,
    createdAt: Timestamp.fromDate(new Date('2024-01-20'))
  },
  {
    id: '3',
    name: 'آيفون 15 برو ماكس - جملة',
    description: 'هواتف آيفون 15 برو ماكس أصلية 100%، جميع الألوان متوفرة، ضمان سنة عالمي.',
    price: 3200,
    oldPrice: 3500,
    moq: 10,
    stock: 500,
    category: 'electronics',
    subcategory: 'هواتف',
    images: [
      'https://images.unsplash.com/photo-1696446702183-cbd13d78e1e7?w=800',
      'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800'
    ],
    sellerId: 'seller3',
    sellerName: 'تك ستور العالمية',
    sellerVerified: true,
    sellerRating: 4.8,
    rating: 4.9,
    reviewCount: 892,
    sold: 3450,
    origin: 'الإمارات',
    shipping: 'شحن جوي',
    status: 'active',
    featured: true,
    createdAt: Timestamp.fromDate(new Date('2024-02-01'))
  },
  {
    id: '4',
    name: 'لابتوب Dell Latitude 7430',
    description: 'لابتوب أعمال احترافي، معالج i7 جيل 12، رام 16GB، SSD 512GB، شاشة 14 بوصة FHD.',
    price: 2800,
    moq: 5,
    stock: 120,
    category: 'electronics',
    subcategory: 'حواسيب',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'
    ],
    sellerId: 'seller4',
    sellerName: 'كمبيوترات الشركات',
    sellerVerified: false,
    sellerRating: 4.5,
    rating: 4.4,
    reviewCount: 67,
    sold: 234,
    origin: 'الولايات المتحدة',
    shipping: 'شحن جوي',
    status: 'active',
    createdAt: Timestamp.fromDate(new Date('2024-01-25'))
  },
  {
    id: '5',
    name: 'تيشيرتات قطنية 100% - جملة',
    description: 'تيشيرتات قطنية عالية الجودة، جميع المقاسات، ألوان متعددة، إمكانية الطباعة.',
    price: 15,
    oldPrice: 22,
    moq: 100,
    stock: 10000,
    category: 'apparel',
    subcategory: 'ملابس رجالية',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800'
    ],
    sellerId: 'seller5',
    sellerName: 'مصنع النسيج الذهبي',
    sellerVerified: true,
    sellerRating: 4.6,
    rating: 4.5,
    reviewCount: 234,
    sold: 15678,
    origin: 'تركيا',
    shipping: 'شحن بحري',
    status: 'active',
    featured: true,
    createdAt: Timestamp.fromDate(new Date('2024-01-10'))
  },
  {
    id: '6',
    name: 'أريكة جلد فاخرة 3+2+1',
    description: 'أريكة جلد طبيعي إيطالي، تصميم كلاسيكي فاخر، تشمل 3 مقاعد + 2 مقاعد + كرسي فردي.',
    price: 12500,
    moq: 1,
    stock: 15,
    category: 'home',
    subcategory: 'أثاث',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=800'
    ],
    sellerId: 'seller6',
    sellerName: 'أثاث القصور',
    sellerVerified: true,
    sellerRating: 4.9,
    rating: 4.8,
    reviewCount: 89,
    sold: 45,
    origin: 'إيطاليا',
    shipping: 'شحن بحري',
    status: 'active',
    createdAt: Timestamp.fromDate(new Date('2024-02-05'))
  },
  {
    id: '7',
    name: 'كريم العناية بالبشرة - عبوات جملة',
    description: 'كريم مرطب طبيعي 100%، خالي من المواد الكيميائية، عبوات 100ml، إمكانية تخصيص العلامة التجارية.',
    price: 8,
    moq: 500,
    stock: 50000,
    category: 'beauty',
    subcategory: 'عناية بالبشرة',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
      'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=800'
    ],
    sellerId: 'seller7',
    sellerName: 'مختبرات الجمال',
    sellerVerified: true,
    sellerRating: 4.7,
    rating: 4.6,
    reviewCount: 445,
    sold: 8934,
    origin: 'كوريا الجنوبية',
    shipping: 'شحن جوي',
    status: 'active',
    createdAt: Timestamp.fromDate(new Date('2024-01-18'))
  },
  {
    id: '8',
    name: 'أجهزة رياضية متكاملة - Home Gym',
    description: 'مجموعة أجهزة رياضية للمنزل، تشمل جهاز متعدد الوظائف، دمبلز، ومقاعد.',
    price: 4500,
    oldPrice: 5800,
    moq: 1,
    stock: 25,
    category: 'sports',
    subcategory: 'أدوات رياضية',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800'
    ],
    sellerId: 'seller8',
    sellerName: 'فيتنس برو',
    sellerVerified: false,
    sellerRating: 4.4,
    rating: 4.3,
    reviewCount: 78,
    sold: 156,
    origin: 'الصين',
    shipping: 'شحن بحري',
    status: 'active',
    createdAt: Timestamp.fromDate(new Date('2024-02-10'))
  }
];

export function useStore() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserData(currentUser.uid);
      } else {
        setProfile(null);
        setCart([]);
        setFavorites([]);
        setOrders([]);
        setNotifications([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid: string) => {
    try {
      const profileDoc = await getDoc(doc(db, 'users', uid));
      if (profileDoc.exists()) {
        setProfile(profileDoc.data() as UserProfile);
      }

      const cartSnap = await getDocs(query(collection(db, 'users', uid, 'cart')));
      setCart(cartSnap.docs.map(d => ({ id: d.id, ...d.data() }) as CartItem));

      const favSnap = await getDocs(query(collection(db, 'users', uid, 'favorites')));
      setFavorites(favSnap.docs.map(d => d.id));

      const ordersSnap = await getDocs(
        query(collection(db, 'orders'), where('buyerId', '==', uid), orderBy('createdAt', 'desc'))
      );
      setOrders(ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Order));

      const notifSnap = await getDocs(
        query(collection(db, 'notifications'), where('userId', '==', uid), orderBy('createdAt', 'desc'), limit(50))
      );
      const notifs = notifSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Notification);
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: 'buyer',
        verified: false,
        rating: 0,
        memberSince: serverTimestamp(),
        language: 'ar',
        currency: 'USD'
      }, { merge: true });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        role: 'buyer',
        verified: false,
        rating: 0,
        memberSince: serverTimestamp(),
        language: 'ar',
        currency: 'USD'
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const addToCart = async (product: Product, quantity: number) => {
    if (!user) return { success: false, error: 'يجب تسجيل الدخول' };
    
    try {
      const cartRef = doc(db, 'users', user.uid, 'cart', product.id);
      await setDoc(cartRef, {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        addedAt: serverTimestamp()
      });
      
      setCart(prev => {
        const existing = prev.find(item => item.productId === product.id);
        if (existing) {
          return prev.map(item => item.productId === product.id ? { ...item, quantity } : item);
        }
        return [...prev, { id: product.id, productId: product.id, name: product.name, price: product.price, image: product.images[0], quantity, sellerId: product.sellerId, sellerName: product.sellerName, addedAt: Timestamp.now() }];
      });
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'cart', productId));
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) return { success: false, error: 'يجب تسجيل الدخول' };
    
    try {
      const favRef = doc(db, 'users', user.uid, 'favorites', productId);
      const isFav = favorites.includes(productId);
      
      if (isFav) {
        await deleteDoc(favRef);
        setFavorites(prev => prev.filter(id => id !== productId));
      } else {
        await setDoc(favRef, { addedAt: serverTimestamp() });
        setFavorites(prev => [...prev, productId]);
      }
      
      return { success: true, isFavorite: !isFav };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const createOrder = async (product: Product, quantity: number, shippingAddress: string) => {
    if (!user || !profile) return { success: false, error: 'يجب تسجيل الدخول' };
    
    try {
      const orderRef = await addDoc(collection(db, 'orders'), {
        buyerId: user.uid,
        buyerName: profile.name,
        sellerId: product.sellerId,
        productId: product.id,
        productName: product.name,
        productImage: product.images[0],
        quantity,
        unitPrice: product.price,
        total: product.price * quantity,
        status: 'pending',
        paymentStatus: 'pending',
        shippingAddress,
        createdAt: serverTimestamp()
      });

      await updateDoc(doc(db, 'products', product.id), {
        stock: increment(-quantity),
        sold: increment(quantity)
      });

      await addDoc(collection(db, 'notifications'), {
        userId: product.sellerId,
        type: 'order',
        title: 'طلب جديد',
        body: `تم طلب ${quantity} قطعة من ${product.name}`,
        data: { orderId: orderRef.id },
        read: false,
        createdAt: serverTimestamp()
      });

      return { success: true, orderId: orderRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'sellerPhoto' | 'sellerVerified' | 'rating' | 'reviewCount' | 'sold' | 'createdAt'>, images: File[]) => {
    if (!user || !profile) return { success: false, error: 'يجب تسجيل الدخول' };
    
    try {
      const imageUrls: string[] = [];
      for (const image of images) {
        const storageRef = ref(storage, `products/${user.uid}/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      const productRef = await addDoc(collection(db, 'products'), {
        ...productData,
        images: imageUrls,
        sellerId: user.uid,
        sellerName: profile.name,
        sellerPhoto: profile.photoURL,
        sellerVerified: profile.verified,
        rating: 0,
        reviewCount: 0,
        sold: 0,
        createdAt: serverTimestamp()
      });

      return { success: true, productId: productRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const markNotificationRead = async (notificationId: string) => {
    if (!user) return;
    await updateDoc(doc(db, 'notifications', notificationId), { read: true });
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return {
    user,
    profile,
    products,
    cart,
    favorites,
    orders,
    notifications,
    unreadCount,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout,
    addToCart,
    removeFromCart,
    toggleFavorite,
    createOrder,
    addProduct,
    markNotificationRead,
    setProducts
  };
}
