import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import gkFarmsLogo from '../assets/images/gk_farms_logo_1784660126235.jpg';
import {
  Sprout,
  Search,
  ShoppingBag,
  Heart,
  User,
  Store,
  Shield,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  KeyRound,
  UserCheck,
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenVendorReg: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, onOpenVendorReg }) => {
  const {
    role,
    setRole,
    currentUser,
    setCurrentUser,
    cart,
    wishlist,
    filters,
    setFilters,
    activeTab,
    setActiveTab,
    products,
    setSelectedProductForModal,
    isDarkMode,
    toggleDarkMode,
    addNotification,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Account & Login State
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedRoleForLogin, setSelectedRoleForLogin] = useState<UserRole>('customer');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchQuery }));
    setActiveTab('products');
    setShowSearchDropdown(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedRoleForLogin);
    if (selectedRoleForLogin === 'customer') {
      setCurrentUser({
        id: 'u_' + Date.now(),
        name: emailInput ? emailInput.split('@')[0] : 'Member',
        email: emailInput || 'user@gkfarmsfresh.com',
        role: 'customer',
      });
    }
    setShowLoginModal(false);
    setEmailInput('');
    setPasswordInput('');
    addNotification(`Signed in successfully as ${selectedRoleForLogin}`);
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-emerald-100 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab(role === 'customer' ? 'home' : role === 'vendor' ? 'vendor-dashboard' : 'admin-dashboard');
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-11 h-11 rounded-2xl overflow-hidden bg-[#2E7D32] flex items-center justify-center text-white shadow-md shadow-emerald-800/20 group-hover:scale-105 transition-transform border border-emerald-600/30">
                <img src={gkFarmsLogo} alt="GK Farms Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="block text-xl font-black tracking-tight text-[#1B5E20] dark:text-white leading-none">
                  GK <span className="text-[#2E7D32] dark:text-emerald-400">FARMS</span>
                </span>
                <span className="text-[11px] font-bold text-[#2E7D32] dark:text-emerald-400 uppercase tracking-widest leading-none mt-0.5 block">
                  Fresh Products
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar - Customer & Mobile friendly */}
          <div className="hidden md:block flex-1 max-w-lg relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search fresh vegetables, organic fruits, dairy, herbs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full pl-11 pr-24 py-2.5 rounded-full border border-green-200/80 dark:border-slate-700 bg-[#F1F8E9] dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
              <Search className="w-4 h-4 text-[#2E7D32] dark:text-emerald-400 absolute left-4 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs rounded-full shadow-xs transition-colors"
              >
                Search
              </button>
            </form>

            {/* Auto-complete Search Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-emerald-100 dark:border-slate-800 overflow-hidden z-50">
                <div className="p-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
                  Quick Matching Produce
                </div>
                {searchResults.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      setSelectedProductForModal(prod);
                      setShowSearchDropdown(false);
                    }}
                    className="w-full p-2.5 hover:bg-emerald-50 dark:hover:bg-slate-800/80 flex items-center gap-3 text-left transition-colors border-t border-slate-100 dark:border-slate-800/50"
                  >
                    <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {prod.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {prod.category} • {prod.vendorName}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      ${prod.price.toFixed(2)}/{prod.unit}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center gap-6 font-medium text-sm">
            {role === 'customer' && (
              <>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors ${
                    activeTab === 'home' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors ${
                    activeTab === 'products' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Products Catalog
                </button>
                <button
                  onClick={() => setActiveTab('customer-orders')}
                  className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors ${
                    activeTab === 'customer-orders' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  My Orders
                </button>
                <button
                  onClick={onOpenVendorReg}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 transition-all"
                >
                  <Store className="w-3.5 h-3.5" />
                  Become a Vendor
                </button>
              </>
            )}

            {role === 'vendor' && (
              <>
                <button
                  onClick={() => setActiveTab('vendor-dashboard')}
                  className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors ${
                    activeTab === 'vendor-dashboard' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Vendor Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('vendor-products')}
                  className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors ${
                    activeTab === 'vendor-products' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  My Products
                </button>
                <button
                  onClick={() => setActiveTab('vendor-orders')}
                  className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors ${
                    activeTab === 'vendor-orders' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Track Sales & Orders
                </button>
              </>
            )}

            {role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('admin-dashboard')}
                  className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors ${
                    activeTab === 'admin-dashboard' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Executive Portal
                </button>
                <button
                  onClick={() => setActiveTab('admin-vendors')}
                  className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors ${
                    activeTab === 'admin-vendors' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Vendors
                </button>
                <button
                  onClick={() => setActiveTab('admin-products')}
                  className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors ${
                    activeTab === 'admin-products' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  All Products
                </button>
                <button
                  onClick={() => setActiveTab('admin-orders')}
                  className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors ${
                    activeTab === 'admin-orders' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Orders & Dispatch
                </button>
                <button
                  onClick={() => setActiveTab('admin-reports')}
                  className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors ${
                    activeTab === 'admin-reports' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Reports & Analytics
                </button>
              </>
            )}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2.5">
            {role === 'customer' && (
              <>
                {/* Wishlist Button */}
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className="relative p-2.5 rounded-full hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* Cart Button */}
                <button
                  id="open-cart-drawer-btn"
                  onClick={onOpenCart}
                  className="relative p-2.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white transition-all shadow-md flex items-center gap-2 px-4"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-bold text-sm hidden sm:inline">Cart</span>
                  {cartItemCount > 0 && (
                    <span className="bg-[#C8E6C9] text-[#1B5E20] font-black text-xs px-2 py-0.5 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Account Profile / Sign In Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-xs font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold hidden md:inline truncate max-w-[100px]">
                  {currentUser.name}
                </span>
              </button>

              {/* Account Dropdown Menu */}
              {showAccountMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-[#2E7D32] dark:text-emerald-400">
                      {role} Account
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-medium">
                    <button
                      onClick={() => {
                        setRole('customer');
                        setActiveTab('home');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-200"
                    >
                      <span>Customer Portal</span>
                      {role === 'customer' && <span className="w-2 h-2 rounded-full bg-[#2E7D32]"></span>}
                    </button>

                    <button
                      onClick={() => {
                        setRole('vendor');
                        setActiveTab('vendor-dashboard');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-200"
                    >
                      <span>Vendor Portal</span>
                      {role === 'vendor' && <span className="w-2 h-2 rounded-full bg-[#2E7D32]"></span>}
                    </button>

                    <button
                      onClick={() => {
                        setRole('admin');
                        setActiveTab('admin-dashboard');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-200"
                    >
                      <span>Admin Portal</span>
                      {role === 'admin' && <span className="w-2 h-2 rounded-full bg-[#2E7D32]"></span>}
                    </button>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                    <button
                      onClick={() => {
                        setShowAccountMenu(false);
                        setShowLoginModal(true);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Clean Sign In Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Store className="w-6 h-6 text-[#2E7D32]" />
                Sign In to GK Farms
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Portal Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['customer', 'vendor', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRoleForLogin(r)}
                      className={`py-2 text-xs font-medium rounded-lg capitalize border transition-all ${
                        selectedRoleForLogin === r
                          ? 'border-[#2E7D32] bg-green-50 text-[#2E7D32] dark:bg-emerald-950 dark:text-emerald-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold text-sm shadow-md transition-all"
              >
                Sign In as {selectedRoleForLogin}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-emerald-100 dark:border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search produce..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="flex flex-col gap-2 font-medium text-sm">
            {role === 'customer' && (
              <>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setActiveTab('products');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800"
                >
                  Products Catalog
                </button>
                <button
                  onClick={() => {
                    setActiveTab('customer-orders');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800"
                >
                  My Orders & Invoices
                </button>
                <button
                  onClick={() => {
                    onOpenVendorReg();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold"
                >
                  Become a Vendor Partner
                </button>
              </>
            )}

            {role === 'vendor' && (
              <>
                <button
                  onClick={() => {
                    setActiveTab('vendor-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800"
                >
                  Vendor Overview
                </button>
                <button
                  onClick={() => {
                    setActiveTab('vendor-products');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800"
                >
                  Manage Products
                </button>
                <button
                  onClick={() => {
                    setActiveTab('vendor-orders');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800"
                >
                  Vendor Orders
                </button>
              </>
            )}

            {role === 'admin' && (
              <>
                <button
                  onClick={() => {
                    setActiveTab('admin-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800"
                >
                  Executive Portal
                </button>
                <button
                  onClick={() => {
                    setActiveTab('admin-vendors');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800"
                >
                  Vendors Management
                </button>
                <button
                  onClick={() => {
                    setActiveTab('admin-products');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800"
                >
                  Product Approvals
                </button>
                <button
                  onClick={() => {
                    setActiveTab('admin-orders');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800"
                >
                  Orders Dispatch
                </button>
                <button
                  onClick={() => {
                    setActiveTab('admin-reports');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800"
                >
                  Reports & Analytics
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
