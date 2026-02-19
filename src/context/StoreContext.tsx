import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface Product {
  id: string;
  name_en: string;
  name_ar: string | null;
  desc_en: string | null;
  desc_ar: string | null;
  price: number;
  old_price: number | null;
  moq: number;
  stock: number;
  category: string;
  images: string[];
  seller_id: string | null;
  seller_name: string | null;
  seller_country: string | null;
  rating: number;
  reviews: number;
  sold: number;
  verified: boolean;
  featured: boolean;
  origin: string | null;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Order {
  id: string;
  product: Product;
  qty: number;
  total: number;
  status: string;
  date: Date;
}

type ToastType = 'success' | 'error' | 'info';
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

type Page = 'home' | 'favorites' | 'cart' | 'orders' | 'profile';

interface StoreContextType {
  lang: string;
  setLang: (l: string) => void;
  page: Page;
  setPage: (p: Page) => void;
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, delta: number) => void;
  clearCart: () => void;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  orders: Order[];
  createOrder: (product: Product, qty: number) => void;
  toasts: Toast[];
  toast: (message: string, type?: ToastType) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  showAuth: boolean;
  setShowAuth: (v: boolean) => void;
  showOrderForm: Product | null;
  setShowOrderForm: (p: Product | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState<Page>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { product, qty }];
    });
    toast('Added to cart', 'success');
  }, [toast]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateCartQty = useCallback((productId: string, delta: number) => {
    setCart(prev => prev.map(i =>
      i.product.id === productId ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    ));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  }, []);

  const createOrder = useCallback((product: Product, qty: number) => {
    const order: Order = {
      id: Date.now().toString(),
      product,
      qty,
      total: product.price * qty,
      status: 'pending',
      date: new Date(),
    };
    setOrders(prev => [order, ...prev]);
    setCart(prev => prev.filter(i => i.product.id !== product.id));
    toast('Order placed successfully!', 'success');
  }, [toast]);

  return (
    <StoreContext.Provider value={{
      lang, setLang, page, setPage,
      cart, addToCart, removeFromCart, updateCartQty, clearCart,
      favorites, toggleFavorite,
      orders, createOrder,
      toasts, toast,
      selectedProduct, setSelectedProduct,
      showAuth, setShowAuth,
      showOrderForm, setShowOrderForm,
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
    }}>
      {children}
    </StoreContext.Provider>
  );
}
