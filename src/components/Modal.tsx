import { X } from 'lucide-react';
import { type ReactNode, useEffect } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ title, onClose, children, maxWidth = 'max-w-3xl' }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-[fadeIn_0.2s]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-white rounded-t-3xl sm:rounded-2xl w-full ${maxWidth} max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl animate-[slideUp_0.35s_ease-out]`}>
        <div className="bg-gradient-to-l from-blue-600 via-blue-700 to-indigo-700 text-white px-6 py-5 flex justify-between items-center rounded-t-3xl sm:rounded-t-2xl flex-shrink-0 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-12 translate-y-12" />
          <h3 className="font-bold text-lg relative z-10">{title}</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-xl transition-colors relative z-10">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
