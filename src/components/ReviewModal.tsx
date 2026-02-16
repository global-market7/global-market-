import { useState } from 'react';
import { Star } from 'lucide-react';
import { Modal } from './Modal';
import { useAppContext } from '../App';
import { type Product } from '../store';

interface Props {
  product: Product;
  onClose: () => void;
}

export function ReviewModal({ onClose }: Props) {
  const { showToast } = useAppContext();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');

  const ratingLabels = ['', 'سيء 😞', 'مقبول 😐', 'جيد 🙂', 'ممتاز 😊', 'رائع! 🤩'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      showToast('اختر التقييم أولاً', 'warning');
      return;
    }
    showToast('تم إضافة التقييم بنجاح! ⭐', 'success');
    onClose();
  };

  return (
    <Modal title="إضافة تقييم" onClose={onClose} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <label className="block text-sm font-bold text-slate-700 mb-4">كيف تقيّم هذا المنتج؟</label>
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map(i => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i)}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-125 active:scale-95"
              >
                <Star
                  size={40}
                  className={`transition-colors ${
                    i <= (hoverRating || rating) ? 'text-amber-400' : 'text-slate-200'
                  }`}
                  fill={i <= (hoverRating || rating) ? 'currentColor' : 'none'}
                />
              </button>
            ))}
          </div>
          {(hoverRating || rating) > 0 && (
            <p className="text-sm font-semibold text-slate-600 animate-[fadeIn_0.2s]">
              {ratingLabels[hoverRating || rating]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">شارك تجربتك</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={4}
            placeholder="اكتب عن تجربتك مع هذا المنتج... ما الذي أعجبك؟ هل تنصح به؟"
            className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm resize-none"
            style={{ fontFamily: "'Tajawal', sans-serif" }}
          />
          <p className="text-[11px] text-slate-400 mt-1.5">{text.length}/500 حرف</p>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20"
        >
          ⭐ إرسال التقييم
        </button>
      </form>
    </Modal>
  );
}
