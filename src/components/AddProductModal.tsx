import { useState } from 'react';
import { Upload, Send, ImagePlus } from 'lucide-react';
import { Modal } from './Modal';
import { useAppContext } from '../App';

interface Props {
  onClose: () => void;
}

export function AddProductModal({ onClose }: Props) {
  const { showToast } = useAppContext();
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls = Array.from(files).slice(0, 5).map(f => URL.createObjectURL(f));
      setPreviews(urls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    showToast('تم نشر المنتج بنجاح! 🎉', 'success');
    onClose();
  };

  return (
    <Modal title="إضافة منتج جديد" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">صور المنتج <span className="text-red-500">*</span></label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
              {previews.length > 0 ? <ImagePlus size={28} className="text-blue-500" /> : <Upload size={28} className="text-blue-400" />}
            </div>
            <p className="text-sm font-semibold text-slate-600">اسحب الصور هنا أو اضغط للرفع</p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG حتى 5 صور (بحد أقصى 10MB لكل صورة)</p>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
          {previews.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {previews.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt="" className="w-full aspect-square object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => setPreviews(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">اسم المنتج <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm transition-colors"
            placeholder="مثال: سماعات بلوتوث لاسلكية عالية الجودة"
            style={{ fontFamily: "'Tajawal', sans-serif" }}
          />
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">الفئة <span className="text-red-500">*</span></label>
            <select
              required
              className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm bg-white"
              style={{ fontFamily: "'Tajawal', sans-serif" }}
            >
              <option value="">اختر الفئة</option>
              <option value="electronics">📱 إلكترونيات</option>
              <option value="fashion">👔 أزياء</option>
              <option value="home">🏠 منزل وديكور</option>
              <option value="beauty">💄 جمال وعناية</option>
              <option value="industrial">🏭 صناعة</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">السعر ($) <span className="text-red-500">*</span></label>
            <input
              type="number"
              required
              step="0.01"
              min="0.01"
              className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* MOQ & Stock */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">الحد الأدنى (MOQ) <span className="text-red-500">*</span></label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
              placeholder="50"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">المخزون <span className="text-red-500">*</span></label>
            <input
              type="number"
              required
              min="0"
              className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
              placeholder="1000"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">الوصف التفصيلي <span className="text-red-500">*</span></label>
          <textarea
            required
            rows={4}
            className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm resize-none"
            placeholder="اكتب وصفاً تفصيلياً للمنتج يشمل المميزات والمواصفات..."
            style={{ fontFamily: "'Tajawal', sans-serif" }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              جاري النشر...
            </>
          ) : (
            <>
              <Send size={18} />
              نشر المنتج
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}
