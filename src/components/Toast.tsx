import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  warning: 'text-amber-400',
  info: 'text-blue-400',
};

export function Toast({ toasts }: { toasts: ToastItem[] }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[10000] flex flex-col gap-2.5">
      {toasts.map(toast => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className="bg-slate-900 text-white px-6 py-3.5 rounded-full text-sm font-medium flex items-center gap-3 shadow-2xl animate-[slideDown_0.3s_ease-out]"
          >
            <Icon size={18} className={colors[toast.type]} />
            {toast.message}
          </div>
        );
      })}
    </div>
  );
}
