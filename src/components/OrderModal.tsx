import { Minus, Plus, CreditCard, Shield, Truck, RotateCcw } from 'lucide-react';
import { Modal } from './Modal';
import { type Product } from '../store';

interface Props {
  product: Product;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onClose: () => void;
  onProceed: () => void;
}

export function OrderModal({ product, quantity, onQuantityChange, onClose, onProceed }: Props) {
  const total = (product.price * quantity).toFixed(2);
  const savings = product.oldPrice ? ((product.oldPrice - product.price) * quantity).toFixed(2) : null;

  return (
    <Modal title="طلب منتج" onClose={onClose} maxWidth="max-w-lg">
      {/* Product Info */}
      <div className="flex gap-4 p-4 bg-gradient-to-l from-slate-50 to-blue-50/30 rounded-2xl mb-6 border border-slate-100">
        <img src={product.images[0]} alt={product.name} className="w-24 h-24 object-cover rounded-xl shadow-sm" />
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-800 mb-1 text-sm line-clamp-2">{product.name}</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-blue-600 font-extrabold text-xl">${product.price}</span>
            {product.oldPrice && <span className="text-xs text-slate-400 line-through">${product.oldPrice}</span>}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">الحد الأدنى للطلب: {product.moq} قطعة</div>
        </div>
      </div>

      {/* Quantity */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-3">الكمية المطلوبة</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onQuantityChange(Math.max(product.moq, quantity - 10))}
            className="w-11 h-11 border-2 border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 hover:border-blue-300 transition-all text-slate-600"
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => onQuantityChange(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
            className="w-28 text-center py-3 border-2 border-slate-200 rounded-xl font-bold text-lg outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={() => onQuantityChange(quantity + 10)}
            className="w-11 h-11 border-2 border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 hover:border-blue-300 transition-all text-slate-600"
          >
            <Plus size={16} />
          </button>
        </div>
        {/* Quick quantity buttons */}
        <div className="flex gap-2 mt-3">
          {[product.moq, product.moq * 2, product.moq * 5, product.moq * 10].map(q => (
            <button
              key={q}
              onClick={() => onQuantityChange(q)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                quantity === q ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {q} قطعة
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white border-2 border-slate-100 rounded-2xl p-5 mb-6">
        <div className="flex justify-between py-2 text-sm">
          <span className="text-slate-500">سعر الوحدة</span>
          <span className="font-semibold">${product.price}</span>
        </div>
        <div className="flex justify-between py-2 text-sm">
          <span className="text-slate-500">الكمية</span>
          <span className="font-semibold">{quantity} قطعة</span>
        </div>
        <div className="flex justify-between py-2 text-sm">
          <span className="text-slate-500">الشحن</span>
          <span className="text-emerald-600 font-bold">مجاني 🎉</span>
        </div>
        {savings && (
          <div className="flex justify-between py-2 text-sm">
            <span className="text-slate-500">وفرت</span>
            <span className="text-emerald-600 font-bold">-${savings}</span>
          </div>
        )}
        <div className="flex justify-between pt-4 mt-3 border-t-2 border-dashed border-slate-200">
          <span className="text-lg font-extrabold text-slate-800">الإجمالي</span>
          <span className="text-2xl font-black text-blue-600">${total}</span>
        </div>
      </div>

      {/* Trust */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl">
          <Shield size={14} className="text-emerald-500 flex-shrink-0" />
          <span>حماية المشتري</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl">
          <Truck size={14} className="text-blue-500 flex-shrink-0" />
          <span>شحن سريع</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl">
          <RotateCcw size={14} className="text-amber-500 flex-shrink-0" />
          <span>إرجاع مجاني</span>
        </div>
      </div>

      <button
        onClick={onProceed}
        className="w-full bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 text-lg"
      >
        <CreditCard size={20} />
        متابعة الدفع - ${total}
      </button>
    </Modal>
  );
}
