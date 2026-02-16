import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp, onSnapshot, serverTimestamp, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB650D7BDg0f4q7cf9kndvKW5Qz8H1nFj0",
  authDomain: "mymarket-ec08e.firebaseapp.com",
  projectId: "mymarket-ec08e",
  storageBucket: "mymarket-ec08e.firebasestorage.app",
  messagingSenderId: "529357774752",
  appId: "1:529357774752:web:1dc0b061541702e22f8ec5",
  measurementId: "G-E4DY747EB9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export const googleProvider = new GoogleAuthProvider();

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  moq: number;
  stock: number;
  category: string;
  subcategory?: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerPhoto?: string;
  sellerVerified: boolean;
  sellerRating: number;
  rating: number;
  reviewCount: number;
  sold: number;
  origin: string;
  shipping: string;
  status: 'active' | 'inactive';
  featured?: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
};

export type Review = {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  text: string;
  images?: string[];
  createdAt: Timestamp;
};

export type Order = {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sellerId: string;
  sellerName: string;
  addedAt: Timestamp;
};

export type Notification = {
  id: string;
  userId: string;
  type: 'order' | 'message' | 'review' | 'system' | 'price_drop';
  title: string;
  body: string;
  data?: any;
  read: boolean;
  createdAt: Timestamp;
};

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  phone?: string;
  company?: string;
  role: 'buyer' | 'seller' | 'both';
  verified: boolean;
  rating: number;
  memberSince: Timestamp;
  address?: string;
  country?: string;
  language: string;
  currency: string;
};

export type Category = {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  image: string;
  count: number;
  subcategories: string[];
};

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  text: string;
  type: 'text' | 'image' | 'product' | 'order';
  read: boolean;
  createdAt: Timestamp;
};

export type Chat = {
  id: string;
  participants: string[];
  participantNames: string[];
  participantPhotos: string[];
  lastMessage: string;
  lastMessageTime: Timestamp;
  unreadCount: number;
};

export { Timestamp, serverTimestamp, increment, arrayUnion, arrayRemove };
