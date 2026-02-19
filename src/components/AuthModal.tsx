import { useState } from 'react';
import { X, Mail, Lock, User, Loader2, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

export default function AuthModal() {
  const { signIn, signUp } = useAuth();
  const store = useStore();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) { setError('Please enter your name'); setLoading(false); return; }
        const { error } = await signUp(email, password, name);
        if (error) { setError(error.message); setLoading(false); return; }
        store.toast('Account created! Check your email to verify.', 'success');
      } else {
        const { error } = await signIn(email, password);
        if (error) { setError(error.message); setLoading(false); return; }
        store.toast('Welcome back!', 'success');
      }
      store.setShowAuth(false);
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={e => e.target === e.currentTarget && store.setShowAuth(false)}
    >
      <div className="bg-card rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[95vh] overflow-y-auto shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-card-foreground">
            {isRegister ? 'Create Account' : 'Sign In'}
          </h2>
          <button
            onClick={() => store.setShowAuth(false)}
            className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Globe size={24} className="text-primary-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {isRegister ? 'Join the global marketplace' : 'Welcome back to Global Market'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {isRegister && (
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
              </div>
            )}

            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                required
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                isRegister ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground mt-5">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-primary font-semibold ml-1.5 hover:underline"
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
