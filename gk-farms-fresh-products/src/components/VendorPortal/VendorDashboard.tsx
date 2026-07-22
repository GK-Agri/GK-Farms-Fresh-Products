import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Package,
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  X,
} from 'lucide-react';
import { CategoryName, Product, ProductGrade } from '../../types';
import { api } from '../../lib/api';

export const VendorDashboard: React.FC = () => {
  const { currentVendor, products, orders, refreshData, addNotification } = useApp();

  const vendorId = currentVendor?.id || 'v1';
  const vendorProducts = products.filter((p) => p.vendorId === vendorId);

  // Filter orders containing vendor's products
  const vendorOrders = orders.filter((o) =>
    o.items.some((item) => item.vendorId === vendorId)
  );

  const totalSalesRevenue = vendorOrders.reduce((sum, order) => {
    const vendorItemsSub = order.items
      .filter((i) => i.vendorId === vendorId)
      .reduce((sub, i) => sub + i.price * i.quantity, 0);
    return sum + vendorItemsSub;
  }, 0);

  const lowStockProducts = vendorProducts.filter((p) => p.quantity < 15);

  // Add / Edit Product Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<CategoryName>('Fresh Vegetables');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState(3.5);
  const [prodUnit, setProdUnit] = useState('kg');
  const [prodQty, setProdQty] = useState(50);
  const [prodGrade, setProdGrade] = useState<ProductGrade>('Grade A+');
  const [prodIsOrganic, setProdIsOrganic] = useState(true);
  const [prodImage, setProdImage] = useState(
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
  );
  const [prodHarvest, setProdHarvest] = useState('2026-07-21');
  const [prodExpiry, setProdExpiry] = useState('2026-08-15');

  const openAddModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('Fresh Vegetables');
    setProdDesc('Fresh organic harvest sourced directly from our farm pastures.');
    setProdPrice(3.5);
    setProdUnit('kg');
    setProdQty(50);
    setProdGrade('Grade A+');
    setProdIsOrganic(true);
    setProdHarvest('2026-07-21');
    setProdExpiry('2026-08-15');
    setShowAddModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdDesc(p.description);
    setProdPrice(p.price);
    setProdUnit(p.unit);
    setProdQty(p.quantity);
    setProdGrade(p.grade);
    setProdIsOrganic(p.isOrganic);
    setProdImage(p.image);
    setProdHarvest(p.harvestDate);
    setProdExpiry(p.expiryDate);
    setShowAddModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, {
          name: prodName,
          category: prodCategory,
          description: prodDesc,
          price: prodPrice,
          unit: prodUnit,
          quantity: prodQty,
          grade: prodGrade,
          isOrganic: prodIsOrganic,
          image: prodImage,
          harvestDate: prodHarvest,
          expiryDate: prodExpiry,
        });
        addNotification('Product updated successfully!');
      } else {
        await api.createProduct({
          vendorId: currentVendor?.id || 'v1',
          vendorName: currentVendor?.businessName || 'Green Leaf Organic Farm',
          name: prodName,
          category: prodCategory,
          description: prodDesc,
          price: prodPrice,
          unit: prodUnit,
          quantity: prodQty,
          grade: prodGrade,
          isOrganic: prodIsOrganic,
          organicCertNumber: currentVendor?.organicCertificate || 'USDA-ORG-88310',
          image: prodImage,
          harvestDate: prodHarvest,
          expiryDate: prodExpiry,
          status: 'active',
          isFeatured: true,
        });
        addNotification('New harvest product listed successfully!');
      }

      setShowAddModal(false);
      await refreshData();
    } catch {
      addNotification('Could not save product.', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product listing?')) {
      await api.deleteProduct(id);
      addNotification('Product listing deleted.', 'info');
      await refreshData();
    }
  };

  const handleToggleHideProduct = async (p: Product) => {
    const newStatus = p.status === 'active' ? 'hidden' : 'active';
    await api.updateProduct(p.id, { status: newStatus });
    addNotification(`Product is now ${newStatus}`);
    await refreshData();
  };

  const sampleImages = [
    { label: 'Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
    { label: 'Apples', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80' },
    { label: 'Milk', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80' },
    { label: 'Avocados', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80' },
    { label: 'Kale', url: 'https://images.unsplash.com/photo-1524179091875-bf98a9a6ae52?auto=format&fit=crop&w=600&q=80' },
    { label: 'Cheese', url: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-6 border border-emerald-800/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-700 text-lime-300 font-bold text-[11px] rounded-full uppercase tracking-wider">
              {currentVendor?.status === 'approved' ? 'Active Approved Vendor' : 'Pending Review'}
            </span>
            <span className="text-xs text-emerald-300">
              Joined {currentVendor?.joinedDate || '2024'}
            </span>
          </div>

          <h1 className="text-3xl font-black">{currentVendor?.businessName || 'Green Leaf Organic Farm'}</h1>
          <p className="text-xs text-emerald-200">
            Owner: {currentVendor?.ownerName} • Location: {currentVendor?.farmLocation}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-6 py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-emerald-950 font-black text-xs shadow-lg flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Harvest Product
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-800 dark:text-emerald-400">
            ${totalSalesRevenue.toFixed(2)}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">Verified Vendor Earnings</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Listed Products</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {vendorProducts.length}
          </p>
          <p className="text-[11px] text-slate-500">{vendorProducts.filter((p) => p.isOrganic).length} Organic Certified</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Vendor Orders</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {vendorOrders.length}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">Customer Dispatches</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Low Stock Alert</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600">
            {lowStockProducts.length}
          </p>
          <p className="text-[11px] text-rose-500 font-medium">Products &lt; 15 units</p>
        </div>
      </div>

      {/* Listed Products Table / Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-emerald-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-600" />
            Vendor Inventory & Product Management
          </h2>
          <span className="text-xs text-slate-400">Manage pricing, harvest dates, and stock</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Product</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Grade</th>
                <th className="py-3 px-2">Price</th>
                <th className="py-3 px-2">Stock</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {vendorProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-2 flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-xs">{p.name}</p>
                      <p className="text-[11px] text-slate-400">Harvest: {p.harvestDate}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2 font-medium">{p.category}</td>
                  <td className="py-3 px-2 font-bold text-emerald-700 dark:text-emerald-400">{p.grade}</td>
                  <td className="py-3 px-2 font-bold">${p.price.toFixed(2)} / {p.unit}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        p.quantity < 15
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {p.quantity} {p.unit}
                    </span>
                  </td>
                  <td className="py-3 px-2 capitalize font-semibold">{p.status}</td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleHideProduct(p)}
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
                        title={p.status === 'active' ? 'Hide Product' : 'Show Product'}
                      >
                        {p.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-950 rounded-lg text-rose-600"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full my-8 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {editingProduct ? 'Edit Harvest Product' : 'Add New Harvest Product'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Organic Honeycrisp Apples"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as CategoryName)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Fresh Vegetables">Fresh Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Grains & Pulses">Grains & Pulses</option>
                    <option value="Herbs & Spices">Herbs & Spices</option>
                    <option value="Honey & Preserves">Honey & Preserves</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Quality Grade</label>
                  <select
                    value={prodGrade}
                    onChange={(e) => setProdGrade(e.target.value as ProductGrade)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Grade A+">Grade A+</option>
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Organic Certified">Organic Certified</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Unit</label>
                  <input
                    type="text"
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    placeholder="kg, lb, bottle..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={prodQty}
                    onChange={(e) => setProdQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Harvest Date</label>
                  <input
                    type="date"
                    value={prodHarvest}
                    onChange={(e) => setProdHarvest(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={prodExpiry}
                    onChange={(e) => setProdExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Sample Preset Image Selection */}
              <div>
                <label className="block font-semibold mb-1">Product Image URL or Select Preset</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 mb-2"
                  required
                />
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {sampleImages.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setProdImage(img.url)}
                      className="shrink-0 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg border text-[11px] font-semibold hover:border-emerald-500"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={prodIsOrganic}
                  onChange={(e) => setProdIsOrganic(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600"
                />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Organic Certified Product (Include Organic Badge)
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-md text-sm mt-4"
              >
                Save & Publish Harvest Listing
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
