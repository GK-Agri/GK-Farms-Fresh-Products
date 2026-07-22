import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Vendor, Order, CartItem, User, UserRole, Coupon, SystemStats } from '../types';
import { api } from '../lib/api';

interface FilterState {
  category: string;
  search: string;
  grade: string;
  organicOnly: boolean;
  minPrice: number;
  maxPrice: number;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  currentVendor: Vendor | null;
  setCurrentVendor: (vendor: Vendor | null) => void;

  products: Product[];
  vendors: Vendor[];
  orders: Order[];
  stats: SystemStats | null;
  loading: boolean;
  refreshData: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  updateCartQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // Dark Mode
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (message: string, type?: Notification['type']) => void;
  removeNotification: (id: string) => void;

  // Modals & Active View
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
}

const defaultFilters: FilterState = {
  category: 'All',
  search: '',
  grade: 'All',
  organicOnly: false,
  minPrice: 0,
  maxPrice: 20,
  sortBy: 'featured',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('customer');
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'u1',
    name: 'Jennifer Miller',
    email: 'jennifer.m@example.com',
    role: 'customer',
    phone: '+1 (555) 441-2099',
    address: '742 Evergreen Terrace, Springfield, OR 97477',
  });

  const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['p1', 'p7']);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [prodsData, vendsData, ordsData, statsData] = await Promise.all([
        api.getProducts(),
        api.getVendors(),
        api.getOrders(),
        api.getStats(),
      ]);
      setProducts(prodsData);
      setVendors(vendsData);
      setOrders(ordsData);
      setStats(statsData);

      // Link current vendor if role is vendor
      const greenFarm = vendsData.find((v) => v.id === 'v1');
      if (greenFarm) setCurrentVendor(greenFarm);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addNotification = (message: string, type: Notification['type'] = 'success') => {
    const id = `notif_${Date.now()}_${Math.random()}`;
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'customer') {
      setCurrentUser({
        id: 'u1',
        name: 'Jennifer Miller',
        email: 'jennifer.m@example.com',
        role: 'customer',
        phone: '+1 (555) 441-2099',
        address: '742 Evergreen Terrace, Springfield, OR 97477',
      });
      setActiveTab('home');
      addNotification('Switched to Customer View', 'info');
    } else if (newRole === 'vendor') {
      setCurrentUser({
        id: 'u_v1',
        name: 'Samuel Green',
        email: 'samuel@greenleaffarm.com',
        role: 'vendor',
        vendorId: 'v1',
      });
      const vendor = vendors.find((v) => v.id === 'v1') || vendors[0] || null;
      setCurrentVendor(vendor);
      setActiveTab('vendor-dashboard');
      addNotification('Switched to Vendor Portal (Green Leaf Farm)', 'info');
    } else if (newRole === 'admin') {
      setCurrentUser({
        id: 'u_admin',
        name: 'GK Farms Platform Admin',
        email: 'admin@gkfarmsfresh.com',
        role: 'admin',
      });
      setActiveTab('admin-dashboard');
      addNotification('Switched to Admin Executive Portal', 'info');
    }
  };

  // Cart operations
  const addToCart = (product: Product, qty: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    addNotification(`Added ${product.name} to cart`);
  };

  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addNotification('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      const coupon = await api.validateCoupon(code);
      setAppliedCoupon(coupon);
      addNotification(`Coupon ${coupon.code} applied! (${coupon.discountPercent}% off)`);
      return true;
    } catch {
      addNotification('Invalid coupon code.', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addNotification('Coupon removed', 'info');
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartDiscount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercent) / 100 : 0;
  const cartDeliveryFee = cartSubtotal > 35 || cart.length === 0 ? 0 : 3.5;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartDeliveryFee);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addNotification('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addNotification('Added to wishlist');
        return [...prev, productId];
      }
    });
  };

  const resetFilters = () => setFilters(defaultFilters);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        setCurrentUser,
        currentVendor,
        setCurrentVendor,

        products,
        vendors,
        orders,
        stats,
        loading,
        refreshData,

        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartDiscount,
        cartDeliveryFee,
        cartTotal,

        wishlist,
        toggleWishlist,

        filters,
        setFilters,
        resetFilters,

        isDarkMode,
        toggleDarkMode,

        notifications,
        addNotification,
        removeNotification,

        activeTab,
        setActiveTab,
        selectedProductForModal,
        setSelectedProductForModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
