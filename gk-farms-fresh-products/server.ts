import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_PRODUCTS,
  INITIAL_VENDORS,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
} from './src/data/mockData.js';
import { Product, Vendor, Order, Coupon, Review, SystemStats } from './src/types.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data state
  let products: Product[] = [...INITIAL_PRODUCTS];
  let vendors: Vendor[] = [...INITIAL_VENDORS];
  let orders: Order[] = [...INITIAL_ORDERS];
  let coupons: Coupon[] = [...INITIAL_COUPONS];
  let reviews: Review[] = [...INITIAL_REVIEWS];

  // Helper function to update system stats
  function calculateStats(): SystemStats {
    const totalCustomers = new Set(orders.map((o) => o.customerEmail)).size || 14;
    const totalVendors = vendors.length;
    const pendingVendors = vendors.filter((v) => v.status === 'pending').length;
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const lowStockCount = products.filter((p) => p.quantity < 15).length;

    return {
      totalCustomers,
      totalVendors,
      pendingVendors,
      totalProducts,
      totalOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      lowStockCount,
    };
  }

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // System Stats
  app.get('/api/stats', (req, res) => {
    res.json(calculateStats());
  });

  // Get Products (with filters)
  app.get('/api/products', (req, res) => {
    let result = [...products];

    const { category, search, grade, organicOnly, vendorId } = req.query;

    if (category && typeof category === 'string' && category !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.vendorName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (grade && typeof grade === 'string' && grade !== 'All') {
      result = result.filter((p) => p.grade === grade);
    }

    if (organicOnly === 'true') {
      result = result.filter((p) => p.isOrganic);
    }

    if (vendorId && typeof vendorId === 'string') {
      result = result.filter((p) => p.vendorId === vendorId);
    }

    res.json(result);
  });

  // Get Product by ID
  app.get('/api/products/:id', (req, res) => {
    const prod = products.find((p) => p.id === req.params.id);
    if (!prod) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(prod);
  });

  // Create Product
  app.post('/api/products', (req, res) => {
    const newProduct: Product = {
      id: `p_${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      status: 'active',
      ...req.body,
    };
    products.unshift(newProduct);
    res.status(201).json(newProduct);
  });

  // Update Product
  app.put('/api/products/:id', (req, res) => {
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
  });

  // Delete Product
  app.delete('/api/products/:id', (req, res) => {
    const initialLen = products.length;
    products = products.filter((p) => p.id !== req.params.id);
    if (products.length === initialLen) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ success: true });
  });

  // Get Vendors
  app.get('/api/vendors', (req, res) => {
    res.json(vendors);
  });

  // Register Vendor
  app.post('/api/vendors/register', (req, res) => {
    const newVendor: Vendor = {
      id: `v_${Date.now()}`,
      status: 'pending',
      membershipPaid: false,
      membershipAmount: 49,
      rating: 5.0,
      totalSales: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      ...req.body,
    };
    vendors.unshift(newVendor);
    res.status(201).json(newVendor);
  });

  // Pay Vendor Membership
  app.post('/api/vendors/:id/pay-membership', (req, res) => {
    const vendor = vendors.find((v) => v.id === req.params.id);
    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }
    vendor.membershipPaid = true;
    res.json(vendor);
  });

  // Update Vendor Status (Approve / Reject / Suspend)
  app.put('/api/vendors/:id/status', (req, res) => {
    const { status } = req.body;
    const vendor = vendors.find((v) => v.id === req.params.id);
    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }
    vendor.status = status;
    res.json(vendor);
  });

  // Get Orders
  app.get('/api/orders', (req, res) => {
    res.json(orders);
  });

  // Create Order
  app.post('/api/orders', (req, res) => {
    const orderCount = orders.length + 1001;
    const invNum = `INV-2026-${String(orderCount).padStart(3, '0')}`;
    const trkNum = `GK-TRK-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      invoiceNumber: invNum,
      trackingNumber: trkNum,
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      orderStatus: 'placed',
      paymentStatus: req.body.paymentMethod === 'cod' ? 'pending' : 'completed',
      ...req.body,
    };

    // Update stock quantity for purchased items
    newOrder.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        prod.quantity = Math.max(0, prod.quantity - item.quantity);
      }
    });

    orders.unshift(newOrder);
    res.status(201).json(newOrder);
  });

  // Update Order Status
  app.put('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    const order = orders.find((o) => o.id === req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    order.orderStatus = status;
    if (status === 'delivered') {
      order.paymentStatus = 'completed';
    } else if (status === 'refunded') {
      order.paymentStatus = 'refunded';
    }
    res.json(order);
  });

  // Validate Coupon
  app.get('/api/coupons/validate', (req, res) => {
    const code = (req.query.code as string || '').trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === code);
    if (!coupon) {
      res.status(404).json({ message: 'Invalid or expired coupon code.' });
      return;
    }
    res.json(coupon);
  });

  // Add Review
  app.post('/api/products/:id/reviews', (req, res) => {
    const prod = products.find((p) => p.id === req.params.id);
    if (!prod) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const newReview: Review = {
      id: `r_${Date.now()}`,
      productId: req.params.id,
      date: new Date().toISOString().split('T')[0],
      ...req.body,
    };

    reviews.unshift(newReview);

    // Recalculate rating
    const prodReviews = reviews.filter((r) => r.productId === req.params.id);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    prod.rating = Number(avg.toFixed(1));
    prod.reviewCount = prodReviews.length;

    res.status(201).json(newReview);
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GK Farms Fresh Products server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
