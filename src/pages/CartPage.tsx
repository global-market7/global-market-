import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Shield, Truck, RotateCcw, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function CartPage() {
  const store = useStore();

  if (store.cart.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-border">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingCart size={28} className="text-primary/40" />
        </div>
        <h3 className="text-base font-semibold text-card-foreground mb-2">Your cart is empty</h3>
        <p className="text-sm text-muted-foreground mb-5">Add products to start shopping</p>
        <button
          onClick={() => store.setPage('home')}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const total = store.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = store.cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <ShoppingCart size={18} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Shopping Cart</h2>
          <p className="text-xs text-muted-foreground">{store.cart.length} items, {itemCount} pieces</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Items */}
        <div className="flex flex-col gap-3">
          {store.cart.map(item => (
            <div key={item.id} className="bg-card rounded-xl border border-border p-4 flex gap-4 hover:shadow-sm transition-shadow">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-card-foreground text-sm line-clamp-1 mb-1">{item.name}</h4>
                <p className="text-primary font-bold text-lg">${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
                    <button
                      onClick={() => store.updateCartQty(item.id, -1)}
                      className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-card transition-colors text-foreground"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-semibold text-sm w-8 text-center text-foreground">{item.qty}</span>
                    <button
                      onClick={() => store.updateCartQty(item.id, 1)}
                      className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-card transition-colors text-foreground"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-xs text-muted-foreground">= ${(item.price * item.qty).toFixed(2)}</span>
                  <button
                    onClick={() => store.removeFromCart(item.id)}
                    className="ml-auto bg-destructive/10 hover:bg-destructive/20 text-destructive p-2 rounded-lg transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => store.setPage('home')} className="text-primary text-sm font-semibold flex items-center gap-1 mt-1 hover:gap-2 transition-all">
            <ArrowLeft size={14} /> Continue Shopping
          </button>
        </div>

        {/* Summary */}
        <div className="bg-card rounded-xl border border-border p-5 h-fit sticky top-[140px]">
          <h3 className="font-bold text-card-foreground mb-4">Order Summary</h3>
          <div className="flex flex-col gap-3 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Products ({itemCount})</span>
              <span className="font-medium text-foreground">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-success font-semibold">Free</span>
            </div>
          </div>
          <div className="border-t border-dashed border-border pt-4 mb-5">
            <div className="flex justify-between">
              <span className="text-base font-bold text-foreground">Total</span>
              <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => store.toast('Redirecting to checkout...', 'info')}
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <CreditCard size={18} /> Checkout
          </button>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { icon: Shield, label: 'Buyer Protection', color: 'text-success' },
              { icon: Truck, label: 'Free Shipping', color: 'text-primary' },
              { icon: RotateCcw, label: 'Easy Returns', color: 'text-accent' },
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-1 p-2">
                <b.icon size={14} className={b.color} />
                <span className="text-[10px] text-muted-foreground">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
