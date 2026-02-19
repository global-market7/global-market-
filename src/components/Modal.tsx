import { X } from 'lucide-react';
import { type ReactNode, useEffect } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export default function Modal({ title, onClose, children, wide }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-card rounded-t-2xl sm:rounded-2xl w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl animate-slide-up`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h3 className="font-bold text-card-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
