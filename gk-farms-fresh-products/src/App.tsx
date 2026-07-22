import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CustomerHome } from './components/CustomerPortal/CustomerHome';
import { ProductGrid } from './components/CustomerPortal/ProductGrid';
import { CustomerDashboard } from './components/CustomerPortal/CustomerDashboard';
import { ProductDetailModal } from './components/CustomerPortal/ProductDetailModal';
import { CartDrawer } from './components/CustomerPortal/CartDrawer';
import { CheckoutModal } from './components/CustomerPortal/CheckoutModal';
import { VendorRegistration } from './components/VendorPortal/VendorRegistration';
import { VendorDashboard } from './components/VendorPortal/VendorDashboard';
import { AdminDashboard } from './components/AdminPortal/AdminDashboard';
import { NotificationToast } from './components/NotificationToast';

const MainAppContent: React.FC = () => {
  const { role, activeTab, loading } = useApp();

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [vendorRegOpen, setVendorRegOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">
          Loading GK Farms Fresh Produce Marketplace...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FBF9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-600 selection:text-white transition-colors">
      {/* Main Agriculture Navigation Header */}
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenVendorReg={() => setVendorRegOpen(true)}
      />

      {/* Dynamic View Body */}
      <main className="flex-1">
        {role === 'customer' && (
          <>
            {(activeTab === 'home' || activeTab === '') && (
              <CustomerHome onOpenVendorReg={() => setVendorRegOpen(true)} />
            )}
            {activeTab === 'products' && <ProductGrid />}
            {(activeTab === 'customer-orders' || activeTab === 'wishlist') && (
              <CustomerDashboard />
            )}
          </>
        )}

        {role === 'vendor' && <VendorDashboard />}

        {role === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Overlays & Drawers */}
      <ProductDetailModal />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onProceedToCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
      <VendorRegistration
        isOpen={vendorRegOpen}
        onClose={() => setVendorRegOpen(false)}
      />

      {/* Floating Notifications */}
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
