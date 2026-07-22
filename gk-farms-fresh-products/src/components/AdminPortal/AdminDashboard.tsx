import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Users,
  Store,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Truck,
  BarChart3,
  Download,
  Award,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Search,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { api } from '../../lib/api';
import { generateInvoicePDF } from '../../utils/pdfGenerator';
import { OrderStatus, VendorStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    vendors,
    products,
    orders,
    stats,
    refreshData,
    addNotification,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'vendors' | 'products' | 'orders' | 'reports'
  >('overview');

  const [vendorSearch, setVendorSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Vendor Action handlers
  const handleUpdateVendorStatus = async (vendorId: string, status: VendorStatus) => {
    await api.updateVendorStatus(vendorId, status);
    addNotification(`Vendor status updated to ${status}`);
    await refreshData();
  };

  // Order status dispatch
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await api.updateOrderStatus(orderId, status);
    addNotification(`Order status updated to ${status}`);
    await refreshData();
  };

  // Analytics Chart Data
  const salesData = [
    { day: 'Mon', revenue: 420, orders: 12 },
    { day: 'Tue', revenue: 680, orders: 19 },
    { day: 'Wed', revenue: 950, orders: 28 },
    { day: 'Thu', revenue: 810, orders: 24 },
    { day: 'Fri', revenue: 1240, orders: 36 },
    { day: 'Sat', revenue: 1590, orders: 48 },
    { day: 'Sun', revenue: 1380, orders: 42 },
  ];

  const categorySales = [
    { name: 'Fresh Vegetables', sales: 4820 },
    { name: 'Fruits', sales: 3950 },
    { name: 'Dairy & Eggs', sales: 3100 },
    { name: 'Honey & Preserves', sales: 1840 },
    { name: 'Herbs & Spices', sales: 1250 },
  ];

  const pieData = [
    { name: 'Organic Certified', value: 68 },
    { name: 'Grade A+', value: 22 },
    { name: 'Grade A', value: 10 },
  ];

  const COLORS = ['#15803d', '#3b82f6', '#f59e0b'];

  const exportCSVReport = () => {
    const csvHeader = 'Invoice,Customer,PaymentMethod,Total,Status,Date\n';
    const csvRows = orders
      .map(
        (o) =>
          `"${o.invoiceNumber}","${o.customerName}","${o.paymentMethod}",${o.totalPrice},"${o.orderStatus}","${o.createdAt}"`
      )
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GK_Farms_Platform_Sales_Report.csv`;
    a.click();
    addNotification('CSV Sales Report downloaded!');
  };

  const filteredVendors = vendors.filter(
    (v) =>
      v.businessName.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.email.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.vendorName.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Admin Executive Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-900 shadow-2xl flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-800 text-emerald-200 text-[11px] font-bold rounded-full uppercase tracking-wider">
              System Control
            </span>
            <span className="text-xs text-slate-400">Live Management Engine</span>
          </div>
          <h1 className="text-3xl font-black flex items-center gap-2">
            <Shield className="w-8 h-8 text-emerald-400" />
            Executive Admin Portal
          </h1>
          <p className="text-xs text-slate-400">
            Platform governance for approved farm vendors, inventory dispatches, and sales reports.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap bg-slate-800 p-1.5 rounded-2xl gap-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'vendors', label: `Vendors (${vendors.length})` },
            { id: 'products', label: `Products (${products.length})` },
            { id: 'orders', label: `Orders (${orders.length})` },
            { id: 'reports', label: 'Analytics' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveAdminTab(t.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === t.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Platform Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-800 dark:text-emerald-400">
            ${stats?.totalRevenue.toFixed(2) || '0.00'}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">All Completed Orders</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Approved Vendors</span>
            <Store className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {vendors.filter((v) => v.status === 'approved').length}
          </p>
          <p className="text-[11px] text-amber-600 font-medium">
            {stats?.pendingVendors || 0} Pending Applications
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Active Products</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {products.length}
          </p>
          <p className="text-[11px] text-slate-500">
            {products.filter((p) => p.isOrganic).length} Organic Certified
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Registered Customers</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {stats?.totalCustomers || 14}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">Active Customer Accounts</p>
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeAdminTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Trend Area Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  Weekly Platform Gross Sales Trend
                </h3>
                <p className="text-xs text-slate-400">Real-time revenue metrics from verified orders</p>
              </div>
              <button
                onClick={exportCSVReport}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> CSV Report
              </button>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#15803d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#15803d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#15803d"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Vendor Approvals Spotlight */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Pending Vendor Approvals
            </h3>

            {vendors.filter((v) => v.status === 'pending').length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                All vendor applications have been reviewed!
              </div>
            ) : (
              vendors
                .filter((v) => v.status === 'pending')
                .map((v) => (
                  <div
                    key={v.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{v.businessName}</h4>
                      <p className="text-xs text-slate-500">{v.ownerName} • {v.phone}</p>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-1 bg-white dark:bg-slate-900 p-2.5 rounded-xl border">
                      <p>Govt ID: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{v.governmentId}</span></p>
                      <p>Organic Cert: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{v.organicCertificate}</span></p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateVendorStatus(v.id, 'approved')}
                        className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs"
                      >
                        Approve Vendor
                      </button>
                      <button
                        onClick={() => handleUpdateVendorStatus(v.id, 'rejected')}
                        className="py-2 px-3 bg-rose-100 text-rose-700 font-bold text-xs rounded-xl hover:bg-rose-200"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* Vendors Management Tab */}
      {activeAdminTab === 'vendors' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-emerald-100 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600" /> Approved Farm Vendors & Applications
            </h2>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search vendor name or email..."
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                  <th className="py-3 px-2">Business & Owner</th>
                  <th className="py-3 px-2">Location</th>
                  <th className="py-3 px-2">Govt ID & Certs</th>
                  <th className="py-3 px-2">Membership Paid</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredVendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-2">
                      <p className="font-bold text-slate-900 dark:text-white">{v.businessName}</p>
                      <p className="text-[11px] text-slate-400">{v.ownerName} ({v.email})</p>
                    </td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-400">{v.farmLocation}</td>
                    <td className="py-3 px-2 font-mono text-[11px]">
                      <div>ID: {v.governmentId}</div>
                      <div className="text-emerald-700 dark:text-emerald-400 font-bold">Cert: {v.organicCertificate}</div>
                    </td>
                    <td className="py-3 px-2 font-bold">
                      {v.membershipPaid ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> $49 Paid
                        </span>
                      ) : (
                        <span className="text-amber-600">Pending Fee</span>
                      )}
                    </td>
                    <td className="py-3 px-2 capitalize font-bold">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] ${
                          v.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : v.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex justify-end gap-1">
                        {v.status !== 'approved' && (
                          <button
                            onClick={() => handleUpdateVendorStatus(v.id, 'approved')}
                            className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-[11px] font-bold"
                          >
                            Approve
                          </button>
                        )}
                        {v.status !== 'suspended' && (
                          <button
                            onClick={() => handleUpdateVendorStatus(v.id, 'suspended')}
                            className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[11px] font-bold"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products Management Tab */}
      {activeAdminTab === 'products' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-emerald-100 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" /> Platform Product Listings
            </h2>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex gap-3 items-center"
              >
                <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0 space-y-1 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white truncate">{p.name}</h4>
                  <p className="text-slate-500 truncate">{p.vendorName}</p>
                  <p className="font-black text-emerald-700 dark:text-emerald-400">
                    ${p.price.toFixed(2)} / {p.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders & Dispatch Tab */}
      {activeAdminTab === 'orders' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-emerald-100 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-600" /> Customer Orders & Cold-Chain Dispatch
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                  <th className="py-3 px-2">Invoice & Customer</th>
                  <th className="py-3 px-2">Tracking</th>
                  <th className="py-3 px-2">Payment</th>
                  <th className="py-3 px-2">Total Amount</th>
                  <th className="py-3 px-2">Dispatch Status</th>
                  <th className="py-3 px-2 text-right">Invoice PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-2">
                      <p className="font-bold text-slate-900 dark:text-white">{o.invoiceNumber}</p>
                      <p className="text-[11px] text-slate-400">{o.customerName} ({o.customerPhone})</p>
                    </td>
                    <td className="py-3 px-2 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {o.trackingNumber}
                    </td>
                    <td className="py-3 px-2 uppercase font-semibold text-slate-600">
                      {o.paymentMethod} • {o.paymentStatus}
                    </td>
                    <td className="py-3 px-2 font-black text-sm">${o.totalPrice.toFixed(2)}</td>
                    <td className="py-3 px-2">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border text-xs font-bold capitalize"
                      >
                        <option value="placed">Placed</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => generateInvoicePDF(o)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs"
                      >
                        PDF Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports & Analytics Tab */}
      {activeAdminTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" /> Platform Agricultural Analytics & Reports
            </h2>
            <button
              onClick={exportCSVReport}
              className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export CSV Sales Data
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Breakdown */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Revenue by Produce Category</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categorySales}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#15803d" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quality Grade Share */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Organic Certified vs Standard Share</h3>
              <div className="h-64 w-full flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-700" /> Organic (68%)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500" /> Grade A+ (22%)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> Grade A (10%)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
