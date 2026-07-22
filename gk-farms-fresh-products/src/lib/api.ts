import { Product, Vendor, Order, Coupon, Review, SystemStats, User, VendorStatus } from '../types';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(err.message || `HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`[API] fetch failed for ${url}, using mock response if fallback exists.`, error);
    throw error;
  }
}

export const api = {
  // Products
  async getProducts(params?: { category?: string; search?: string; grade?: string; organicOnly?: boolean; vendorId?: string }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.grade && params.grade !== 'All') query.set('grade', params.grade);
    if (params?.organicOnly) query.set('organicOnly', 'true');
    if (params?.vendorId) query.set('vendorId', params.vendorId);

    return fetchJson<Product[]>(`/api/products?${query.toString()}`);
  },

  async getProductById(id: string): Promise<Product> {
    return fetchJson<Product>(`/api/products/${id}`);
  },

  async createProduct(data: Omit<Product, 'id' | 'rating' | 'reviewCount'>): Promise<Product> {
    return fetchJson<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    return fetchJson<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return fetchJson<{ success: boolean }>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Vendors
  async getVendors(): Promise<Vendor[]> {
    return fetchJson<Vendor[]>('/api/vendors');
  },

  async registerVendor(data: Omit<Vendor, 'id' | 'status' | 'membershipPaid' | 'rating' | 'totalSales' | 'joinedDate'>): Promise<Vendor> {
    return fetchJson<Vendor>('/api/vendors/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async payVendorMembership(vendorId: string): Promise<Vendor> {
    return fetchJson<Vendor>(`/api/vendors/${vendorId}/pay-membership`, {
      method: 'POST',
    });
  },

  async updateVendorStatus(vendorId: string, status: VendorStatus): Promise<Vendor> {
    return fetchJson<Vendor>(`/api/vendors/${vendorId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    return fetchJson<Order[]>('/api/orders');
  },

  async createOrder(orderData: Omit<Order, 'id' | 'invoiceNumber' | 'createdAt' | 'trackingNumber'>): Promise<Order> {
    return fetchJson<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async updateOrderStatus(orderId: string, status: Order['orderStatus']): Promise<Order> {
    return fetchJson<Order>(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Stats
  async getStats(): Promise<SystemStats> {
    return fetchJson<SystemStats>('/api/stats');
  },

  // Coupon
  async validateCoupon(code: string): Promise<Coupon> {
    return fetchJson<Coupon>(`/api/coupons/validate?code=${encodeURIComponent(code)}`);
  },

  // Reviews
  async addReview(productId: string, review: Omit<Review, 'id' | 'date'>): Promise<Review> {
    return fetchJson<Review>(`/api/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  },
};
