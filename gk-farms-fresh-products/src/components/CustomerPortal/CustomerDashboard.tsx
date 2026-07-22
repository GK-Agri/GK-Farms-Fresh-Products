import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  FileText,
  Truck,
  Heart,
  User,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { generateInvoicePDF } from '../../utils/pdfGenerator';
import { OrderStatus } from '../../types';

export const CustomerDashboard: React.FC = () => {
  const { orders, wishlist, products, currentUser, setCurrentUser, addToCart, toggleWishlist, addNotification } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');

  const customerOrders = orders.filter((o) => o.customerEmail === currentUser.email || o.customerId === currentUser.id);

  const [profileName, setProfileName] = useState(currentUser.name);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || '');
  const [profileAddress, setProfileAddress] = useState(currentUser.address || '');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name: profileName,
      phone: profilePhone,
      address: profileAddress,
    });
    addNotification('Profile settings saved successfully!');
  };

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const statusSteps: OrderStatus[] = ['placed', 'packed', 'shipped', 'delivered'];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'placed') return 0;
    if (status === 'packed') return 1;
    if (status === 'shipped') return 2;
    if (status === 'delivered') return 3;
    return -1;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-100 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-700/20">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{currentUser.name}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentUser.email} • {currentUser.phone || 'No phone provided'}
            </p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold rounded-full">
              Verified Farm Customer
            </span>
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'orders'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({customerOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('wishlist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'wishlist'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlistedProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'profile'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>
        </div>
      </div>

      {/* Orders Tab */}
      {activeSubTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" /> My Orders & Live Dispatch Tracking
          </h2>

          {customerOrders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 dark:text-white">No orders placed yet</h3>
              <p className="text-xs text-slate-500">Your fresh produce orders will appear here once placed.</p>
            </div>
          ) : (
            customerOrders.map((order) => {
              const currentStepIdx = getStepIndex(order.orderStatus);

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 p-6 shadow-xs space-y-6"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 dark:text-white text-base">
                          Invoice: {order.invoiceNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase">
                          {order.paymentMethod} • {order.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Placed on {new Date(order.createdAt).toLocaleString()} • Tracking: <span className="font-bold text-emerald-700 dark:text-emerald-400">{order.trackingNumber}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => generateInvoicePDF(order)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Download PDF Invoice</span>
                    </button>
                  </div>

                  {/* Order Live Status Tracking Stepper */}
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Live Delivery Progress
                    </span>

                    <div className="grid grid-cols-4 gap-2 text-center relative">
                      {statusSteps.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={step} className="flex flex-col items-center gap-1.5 relative z-10">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                isDone
                                  ? 'bg-emerald-700 text-white shadow-md'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                              }`}
                            >
                              {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                            </div>
                            <span
                              className={`text-[11px] capitalize font-bold ${
                                isCurrent ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-400">Order Produce Items</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800"
                        >
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                              {item.productName}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">{item.vendorName}</p>
                            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                              {item.quantity} {item.unit} x ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping & Notes */}
                  <div className="flex flex-wrap justify-between text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Address:</span> {order.shippingAddress}
                    </div>
                    <div className="font-black text-slate-900 dark:text-white text-sm">
                      Total: ${order.totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Wishlist Tab */}
      {activeSubTab === 'wishlist' && (
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" /> My Saved Wishlist Produce
          </h2>

          {wishlistedProducts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 dark:text-white">No items saved to wishlist</h3>
              <p className="text-xs text-slate-500">Click the heart icon on any product to save it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex gap-4 items-center shadow-xs"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{product.vendorName}</p>
                    <p className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                      ${product.price.toFixed(2)} / {product.unit}
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" /> Add
                      </button>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="px-2 py-1 text-slate-400 hover:text-rose-500 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Settings Tab */}
      {activeSubTab === 'profile' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 max-w-xl mx-auto space-y-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" /> Customer Account Profile
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Default Shipping & Delivery Address
              </label>
              <input
                type="text"
                value={profileAddress}
                onChange={(e) => setProfileAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-colors shadow-md"
            >
              Save Profile Settings
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
