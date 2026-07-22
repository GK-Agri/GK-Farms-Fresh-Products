import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  ArrowRight,
  Truck,
  CheckCircle2,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    cart,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useApp();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  if (!isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setLoadingCoupon(true);
    await applyCoupon(couponCodeInput);
    setLoadingCoupon(false);
    setCouponCodeInput('');
  };

  const freeShippingThreshold = 35;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between border-l border-emerald-100 dark:border-slate-800">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Your Farm Cart</h3>
              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.length} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 px-5 py-3 border-b border-emerald-100 dark:border-emerald-800/40">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {amountNeededForFreeShipping === 0
                  ? '🎉 You unlocked FREE Farm Delivery!'
                  : `Add $${amountNeededForFreeShipping.toFixed(2)} more for FREE Delivery!`}
              </span>
            </div>
            <div className="w-full bg-emerald-200 dark:bg-emerald-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 dark:bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse our fresh organic vegetables, fruits, dairy, and farm products to start filling your box!
                </p>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div key={product.id} className="pt-4 first:pt-0 flex gap-4 items-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100 dark:border-slate-800"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                      {product.name}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {product.vendorName}
                    </p>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      ${product.price.toFixed(2)} / {product.unit}
                    </p>
                  </div>

                  {/* Quantity Controls & Delete */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <button
                        onClick={() => updateCartQty(product.id, quantity - 1)}
                        className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-l-lg"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold">{quantity}</span>
                      <button
                        onClick={() => updateCartQty(product.id, quantity + 1)}
                        className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-r-lg"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Box */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80 space-y-4">
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-100/70 dark:bg-emerald-950/60 rounded-xl border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                    <span className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Coupon {appliedCoupon.code} Applied ({appliedCoupon.discountPercent}% Off)
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-600 hover:underline font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Coupon (e.g. FRESH10)"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs uppercase"
                      />
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                    <button
                      type="submit"
                      disabled={loadingCoupon}
                      className="px-4 py-2 bg-slate-900 dark:bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                    <span>Discount</span>
                    <span>-${cartDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Farm Delivery Fee</span>
                  <span>
                    {cartDeliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase">Free</span>
                    ) : (
                      `$${cartDeliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-emerald-700 dark:text-emerald-400">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  id="proceed-checkout-btn"
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 py-1"
                >
                  Clear Cart Items
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
