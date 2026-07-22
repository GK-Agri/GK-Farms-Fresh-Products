import React from 'react';
import { Sprout, ShieldCheck, Truck, RefreshCw, Award, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import gkFarmsLogo from '../assets/images/gk_farms_logo_1784660126235.jpg';

export const Footer: React.FC = () => {
  const { setRole, setActiveTab, addNotification } = useApp();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification('Subscribed to GK Farms Fresh Harvest Weekly Digest!');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-emerald-950 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/50">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Farm Direct</h4>
              <p className="text-xs text-slate-400">Harvested fresh daily from certified organic local growers.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/50">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Organic Certified</h4>
              <p className="text-xs text-slate-400">Strictly verified USDA & State organic compliance certificates.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/50">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Temperature Controlled Delivery</h4>
              <p className="text-xs text-slate-400">Refrigerated farm dispatch straight to your doorstep.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/50">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Guaranteed Freshness</h4>
              <p className="text-xs text-slate-400">100% refund guarantee if produce does not meet Grade standards.</p>
            </div>
          </div>
        </div>

        {/* Footer Content Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-emerald-700 flex items-center justify-center text-white border border-emerald-600/40 shrink-0">
                <img src={gkFarmsLogo} alt="GK Farms Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-black text-white">
                GK <span className="text-emerald-400">FARMS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              GK Farms Fresh Products is a premier agricultural eCommerce marketplace connecting conscious consumers directly with certified organic local farmers, dairies, and orchards.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-semibold text-slate-400">Accepted Payments:</span>
              <span className="px-2 py-1 bg-slate-800 rounded text-[11px] font-bold text-emerald-400 border border-slate-700">
                Cards
              </span>
              <span className="px-2 py-1 bg-slate-800 rounded text-[11px] font-bold text-sky-400 border border-slate-700">
                PayPal
              </span>
              <span className="px-2 py-1 bg-slate-800 rounded text-[11px] font-bold text-amber-400 border border-slate-700">
                GPay
              </span>
              <span className="px-2 py-1 bg-slate-800 rounded text-[11px] font-bold text-emerald-300 border border-slate-700">
                COD
              </span>
            </div>
          </div>

          {/* Customer Portal Links */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4">Customer Portal</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setRole('customer');
                    setActiveTab('home');
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Featured Organic Produce
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRole('customer');
                    setActiveTab('products');
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Fresh Produce Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRole('customer');
                    setActiveTab('customer-orders');
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  My Orders & Invoice Downloads
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRole('customer');
                    setActiveTab('wishlist');
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Saved Wishlist Items
                </button>
              </li>
            </ul>
          </div>

          {/* Vendor Portal Links */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4">Vendor Portal</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setRole('vendor');
                    setActiveTab('vendor-dashboard');
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Vendor Overview Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRole('vendor');
                    setActiveTab('vendor-products');
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Add & Manage Harvest Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRole('vendor');
                    setActiveTab('vendor-orders');
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Track Vendor Sales
                </button>
              </li>
              <li>
                <span className="text-emerald-400 font-semibold">$49 Verified Partnership Fee</span>
              </li>
            </ul>
          </div>

          {/* Admin Portal & Newsletter */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4">Admin & Updates</h5>
            <ul className="space-y-2 text-xs text-slate-400 mb-4">
              <li>
                <button
                  onClick={() => {
                    setRole('admin');
                    setActiveTab('admin-dashboard');
                  }}
                  className="hover:text-emerald-400 font-medium text-emerald-400 transition-colors"
                >
                  ⚡ Admin Executive Control
                </button>
              </li>
            </ul>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <label className="text-xs font-medium text-slate-400 block">Weekly Harvest Deals:</label>
              <div className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg text-xs border border-slate-700 focus:outline-none focus:border-emerald-500"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 GK Farms Fresh Products Inc. All rights reserved.</p>
          <p>Verified Agriculture & Farm Products Marketplace Platform.</p>
        </div>
      </div>
    </footer>
  );
};
