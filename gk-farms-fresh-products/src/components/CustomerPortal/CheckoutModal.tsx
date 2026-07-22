import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Truck,
  FileText,
  X,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PaymentMethod, Order } from '../../types';
import { api } from '../../lib/api';
import { generateInvoicePDF } from '../../utils/pdfGenerator';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    currentUser,
    addNotification,
    setActiveTab,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [shippingAddress, setShippingAddress] = useState(currentUser.address || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [deliveryNotes, setDeliveryNotes] = useState('Please place in farm cooler box by doorstep.');

  // Card details mock
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('881');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      setIsSubmitting(true);

      const newOrder = await api.createOrder({
        customerId: currentUser.id,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        customerPhone: phone,
        shippingAddress,
        deliveryNotes,
        items: cart.map(({ product, quantity }) => ({
          productId: product.id,
          productName: product.name,
          vendorId: product.vendorId,
          vendorName: product.vendorName,
          price: product.price,
          quantity,
          unit: product.unit,
          image: product.image,
        })),
        subtotal: cartSubtotal,
        discount: cartDiscount,
        deliveryFee: cartDeliveryFee,
        totalPrice: cartTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
        orderStatus: 'placed',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      });

      setPlacedOrder(newOrder);
      clearCart();
      addNotification('Order placed successfully! Farm dispatch scheduled.');
    } catch {
      addNotification('Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl border border-emerald-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {placedOrder ? 'Order Confirmation & Invoice' : 'Secure Farm Checkout'}
            </h3>
          </div>
          <button
            onClick={() => {
              setPlacedOrder(null);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {placedOrder ? (
          /* Order Confirmation View */
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> Order Placed Successfully
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Thank you for your order, {placedOrder.customerName}!
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Invoice Number <span className="font-bold text-slate-800 dark:text-slate-200">{placedOrder.invoiceNumber}</span>. Your local farm growers have received your order and are packing your fresh produce.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Tracking Number:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{placedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Delivery:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {new Date(placedOrder.estimatedDelivery).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span className="font-semibold capitalize text-emerald-600">{placedOrder.paymentStatus}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-black">
                <span>Total Paid:</span>
                <span className="text-emerald-700 dark:text-emerald-400">${placedOrder.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => generateInvoicePDF(placedOrder)}
                className="flex-1 py-3 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Download Official Invoice PDF</span>
              </button>

              <button
                onClick={() => {
                  setPlacedOrder(null);
                  onClose();
                  setActiveTab('customer-orders');
                }}
                className="py-3 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs transition-colors"
              >
                View My Orders
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <form onSubmit={handlePlaceOrder} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Delivery Address */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                1. Delivery & Contact Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Shipping Address
                  </label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Delivery Drop-off Notes
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                2. Select Payment Method
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'card', label: 'Credit/Debit', icon: CreditCard },
                  { id: 'paypal', label: 'PayPal', icon: DollarSign },
                  { id: 'gpay', label: 'Google Pay', icon: Sparkles },
                  { id: 'cod', label: 'Cash on Delivery', icon: Truck },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPaymentMethod(id as PaymentMethod)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === id
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>

              {/* Payment Details Input Mock */}
              {paymentMethod === 'card' && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-mono"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">CVC / CVV</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'gpay' && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                  ⚡ Express Google Pay authenticated. Touch ID / Face ID enabled.
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                  💵 Cash on Delivery selected. Please hand ${cartTotal.toFixed(2)} to our farm driver upon refrigerated delivery.
                </div>
              )}
            </div>

            {/* Order Total Breakdown */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal ({cart.length} items)</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-${cartDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Farm Delivery</span>
                <span>{cartDeliveryFee === 0 ? 'FREE' : `$${cartDeliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Grand Total</span>
                <span className="text-emerald-700 dark:text-emerald-400">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-xl shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>{isSubmitting ? 'Processing Payment...' : `Complete Order • $${cartTotal.toFixed(2)}`}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
