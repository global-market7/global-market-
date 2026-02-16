import { useState } from 'react';
import { Lock, Loader2, Shield, CheckCircle } from 'lucide-react';
import { Modal } from './Modal';
import { type Product } from '../store';

interface Props {
  product: Product;
  quantity: number;
  onClose: () => void;
  onPay: () => void;
}

export function PaymentModal({ product, quantity, onClose, onPay }: Props) {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal' | 'apple'>('card');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(0);
  const total = (product.price * quantity).toFixed(2);

  const handlePay = async () => {
    setProcessing(true);
    setStep(1);
    await new Promise(r => setTimeout(r, 1000));
    setStep(2);
    await new Promise(r => setTimeout(r, 800));
    setStep(3);
    await new Promise(r => setTimeout(r, 500));
    setProcessing(false);
    onPay();
  };

  return (
    <Modal title="إتمام الدفع" onClose={onClose} maxWidth="max-w-md">
      <div className="mb-6">
        {/* Total Display */}
        <div className="text-center mb-6 bg-gradient-to-l from-blue-50 to-indigo-50 rounded-2xl p-5">
          <p className="text-xs text-slate-500 mb-1">المبلغ الإجمالي</p>
          <div className="text-4xl font-black text-blue-600">${total}</div>
          <p className="text-xs text-slate-400 mt-1">{quantity} × ${product.price} | {product.name.slice(0, 30)}...</p>
        </div>

        {/* Payment Methods */}
        <p className="text-sm font-bold text-slate-700 mb-3">اختر طريقة الدفع</p>
        <div className="space-y-2.5 mb-6">
          {[
            { id: 'card' as const, icon: '💳', title: 'بطاقة ائتمان', desc: 'Visa, Mastercard, AMEX' },
            { id: 'paypal' as const, icon: '🅿️', title: 'PayPal', desc: 'الدفع الآمن عبر PayPal' },
            { id: 'apple' as const, icon: '🍎', title: 'Apple Pay', desc: 'الدفع السريع' },
          ].map(method => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full flex items-center gap-4 p-4 border-2 rounded-2xl transition-all ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-blue-200'
              }`}
            >
              <span className="text-2xl">{method.icon}</span>
              <div className="text-right flex-1">
                <div className="font-bold text-sm">{method.title}</div>
                <div className="text-[11px] text-slate-400">{method.desc}</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedMethod === method.id ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
              }`}>
                {selectedMethod === method.id && <CheckCircle size={12} className="text-white" />}
              </div>
            </button>
          ))}
        </div>

        {/* Card Form */}
        {selectedMethod === 'card' && (
          <div className="space-y-3 mb-6 animate-[fadeIn_0.3s]">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">رقم البطاقة</label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm font-mono"
                defaultValue="4242 4242 4242 4242"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">تاريخ الانتهاء</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm font-mono"
                  defaultValue="12/25"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">CVC</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm font-mono"
                  defaultValue="123"
                />
              </div>
            </div>
          </div>
        )}

        {/* Processing Steps */}
        {processing && (
          <div className="mb-6 animate-[fadeIn_0.3s]">
            <div className="space-y-3">
              {['التحقق من بيانات الدفع...', 'معالجة المعاملة...', 'تأكيد الطلب...'].map((text, i) => (
                <div key={i} className={`flex items-center gap-3 text-sm transition-all ${step > i ? 'text-emerald-600' : step === i ? 'text-blue-600' : 'text-slate-300'}`}>
                  {step > i ? <CheckCircle size={18} /> : step === i ? <Loader2 size={18} className="animate-spin" /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-200" />}
                  <span className={step >= i ? 'font-semibold' : ''}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Security badges */}
      <div className="flex items-center justify-center gap-4 mb-4 text-xs text-slate-400">
        <span className="flex items-center gap-1"><Shield size={12} className="text-emerald-500" /> SSL مشفر</span>
        <span className="flex items-center gap-1"><Lock size={12} className="text-blue-500" /> PCI DSS</span>
      </div>

      <button
        onClick={handlePay}
        disabled={processing}
        className="w-full bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 text-lg"
      >
        {processing ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            جاري المعالجة...
          </>
        ) : (
          <>
            <Lock size={18} />
            تأكيد الدفع - ${total}
          </>
        )}
      </button>
    </Modal>
  );
}
