import { useState } from 'react';
import { useAppContext } from '../App';
import { Modal } from './Modal';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function AuthModal({ onClose }: Props) {
  const { store, showToast } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('أدخل البريد الإلكتروني', 'warning');
      return;
    }
    const displayName = name.trim() || email.split('@')[0];
    store.login(displayName, email);
    showToast(`مرحباً ${displayName}! 🎉`, 'success');
    onClose();
  };

  const handleGoogleLogin = () => {
    store.login('أحمد المتاجر', 'ahmed@globalmarket.com');
    showToast('مرحباً أحمد! 🎉', 'success');
    onClose();
  };

  return (
    <Modal title={isRegister ? 'إنشاء حساب جديد' : 'تسجيل الدخول'} onClose={onClose} maxWidth="max-w-md">
      {/* Welcome */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
          <span className="text-4xl">🌐</span>
        </div>
        <h3 className="text-lg font-extrabold text-slate-800">
          {isRegister ? 'انضم إلى Global Market' : 'مرحباً بك مرة أخرى!'}
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          {isRegister ? 'اشترك الآن وابدأ التجارة العالمية' : 'سجل الدخول للمتابعة'}
        </p>
      </div>

      {/* Social Login */}
      <div className="space-y-2.5 mb-6">
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-sm py-3.5 rounded-xl font-semibold transition-all text-sm"
        >
          <img src="https://www.google.com/favicon.ico" width="18" alt="Google" />
          <span>المتابعة بحساب Google</span>
        </button>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold transition-all text-sm"
        >
          <span className="text-lg">🍎</span>
          <span>المتابعة مع Apple</span>
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-medium">أو بالبريد الإلكتروني</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div className="relative">
            <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pr-11 pl-4 py-3.5 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm transition-colors"
              placeholder="الاسم الكامل"
              style={{ fontFamily: "'Tajawal', sans-serif" }}
            />
          </div>
        )}
        <div className="relative">
          <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pr-11 pl-4 py-3.5 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm transition-colors"
            placeholder="البريد الإلكتروني"
            style={{ fontFamily: "'Tajawal', sans-serif" }}
            required
          />
        </div>
        <div className="relative">
          <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pr-11 pl-4 py-3.5 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm transition-colors"
            placeholder="كلمة المرور"
            style={{ fontFamily: "'Tajawal', sans-serif" }}
          />
        </div>

        {!isRegister && (
          <div className="text-left">
            <button type="button" className="text-xs text-blue-600 hover:underline font-medium">
              نسيت كلمة المرور؟
            </button>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
        >
          {isRegister ? 'إنشاء الحساب' : 'تسجيل الدخول'}
          <ArrowLeft size={16} />
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        {isRegister ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-blue-600 font-bold mr-1.5 hover:underline"
        >
          {isRegister ? 'تسجيل الدخول' : 'أنشئ حساب مجاناً'}
        </button>
      </p>
    </Modal>
  );
}
