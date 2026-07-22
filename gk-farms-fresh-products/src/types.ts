export type UserRole = 'customer' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  avatar?: string;
  vendorId?: string; // linked if role is vendor
}

export type VendorStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Vendor {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  status: VendorStatus;
  membershipPaid: boolean;
  membershipAmount: number;
  governmentId?: string;
  businessLicense?: string;
  organicCertificate?: string;
  farmRegistration?: string;
  taxNumber?: string;
  rating: number;
  totalSales: number;
  joinedDate: string;
  farmLocation: string;
  avatarUrl?: string;
}

export type ProductGrade = 'Grade A+' | 'Grade A' | 'Grade B' | 'Organic Certified';

export type CategoryName =
  | 'Fresh Vegetables'
  | 'Fruits'
  | 'Dairy & Eggs'
  | 'Grains & Pulses'
  | 'Herbs & Spices'
  | 'Farm Products'
  | 'Honey & Preserves';

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  name: string;
  category: CategoryName;
  description: string;
  price: number; // in $
  unit: string; // e.g., 'kg', 'lb', 'bunch', 'bottle', 'box'
  quantity: number; // available stock
  grade: ProductGrade;
  isOrganic: boolean;
  organicCertNumber?: string;
  image: string;
  harvestDate: string;
  expiryDate: string;
  status: 'active' | 'hidden' | 'pending_approval' | 'rejected';
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isSeasonal?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'card' | 'paypal' | 'gpay' | 'cod';
export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';
export type OrderStatus = 'placed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  vendorId: string;
  vendorName: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  deliveryNotes?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  invoiceNumber: string;
  customerName: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minSpend: number;
  description: string;
}

export interface SystemStats {
  totalCustomers: number;
  totalVendors: number;
  pendingVendors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockCount: number;
}
