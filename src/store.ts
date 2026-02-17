import { useState, useEffect } from 'react';
import { supabase } from './firebase';
import type { Product } from './firebase';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface StoreState {
  user: User | null;
  isLoading: boolean;
  cart: Product[];
  favorites: Product[];
}

const useStore = () => {
  const [state, setState] = useState<StoreState>({
    user: null,
    isLoading: true,
    cart: [],
    favorites: [],
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setState(prev => ({
            ...prev,
            user: {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || '',
            },
            isLoading: false,
          }));
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setState(prev => ({
            ...prev,
            user: {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || '',
            },
          }));
        } else {
          setState(prev => ({
            ...prev,
            user: null,
            cart: [],
            favorites: [],
          }));
        }
      }
    );

    initializeAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const addToCart = (product: Product) => {
    setState(prev => ({
      ...prev,
      cart: [...prev.cart, product],
    }));
  };

  const removeFromCart = (productId: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(p => p.id !== productId),
    }));
  };

  const addToFavorites = (product: Product) => {
    setState(prev => ({
      ...prev,
      favorites: [...prev.favorites, product],
    }));
  };

  const removeFromFavorites = (productId: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.filter(p => p.id !== productId),
    }));
  };

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    addToCart,
    removeFromCart,
    addToFavorites,
    removeFromFavorites,
  };
};

export default useStore;
