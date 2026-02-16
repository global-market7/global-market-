import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(timer); return 100; }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex flex-col items-center justify-center z-[99999]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" style={{ animation: 'float 5s ease-in-out infinite 1s' }} />
      </div>

      {/* Logo */}
      <div className="relative z-10 text-center">
        <div
          className="w-28 h-28 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-8 mx-auto border border-white/20 shadow-2xl"
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
          <span className="text-6xl">🌐</span>
        </div>

        <h1 className="text-white text-3xl font-extrabold mb-2 tracking-tight">
          Global Market
          <span className="text-amber-400 mr-1">Pro</span>
        </h1>
        <p className="text-blue-200 text-sm mb-8">سوق B2B العالمي الأول</p>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-l from-amber-400 to-amber-300 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-blue-200/60 text-xs">جاري التحميل... {Math.min(Math.round(progress), 100)}%</p>
        </div>
      </div>

      {/* Bottom Features */}
      <div className="absolute bottom-12 flex gap-8 text-white/50 text-xs">
        <span>🔒 دفع آمن</span>
        <span>🌍 190+ دولة</span>
        <span>⚡ توصيل سريع</span>
      </div>
    </div>
  );
}
