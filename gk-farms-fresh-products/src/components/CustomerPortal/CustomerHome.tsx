import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sprout,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Star,
  Store,
  Apple,
  Milk,
  Wheat,
  Flower2,
} from 'lucide-react';
import { ProductGrid } from './ProductGrid';

interface CustomerHomeProps {
  onOpenVendorReg: () => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({ onOpenVendorReg }) => {
  const { products, setFilters, setActiveTab, setSelectedProductForModal } = useApp();

  const featuredOrganic = products.filter((p) => p.isOrganic).slice(0, 4);

  const categoryHighlights = [
    { name: 'Fresh Vegetables', icon: Sprout, count: '45+ Items', bg: 'bg-emerald-100 text-emerald-800' },
    { name: 'Fruits', icon: Apple, count: '30+ Items', bg: 'bg-amber-100 text-amber-800' },
    { name: 'Dairy & Eggs', icon: Milk, count: '18+ Items', bg: 'bg-sky-100 text-sky-800' },
    { name: 'Grains & Pulses', icon: Wheat, count: '25+ Items', bg: 'bg-orange-100 text-orange-800' },
    { name: 'Herbs & Spices', icon: Flower2, count: '20+ Items', bg: 'bg-lime-100 text-lime-800' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-800 via-[#2E7D32] to-[#1B5E20] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 shadow-xl rounded-b-[32px] sm:rounded-b-[40px]">
        {/* Geometric Background Shapes */}
        <div className="w-64 h-64 bg-[#4CAF50] rounded-full opacity-20 absolute -right-12 -top-12 pointer-events-none" />
        <div className="w-32 h-32 bg-white opacity-5 absolute right-48 bottom-4 rounded-2xl rotate-12 pointer-events-none" />
        <div className="w-40 h-40 bg-[#C8E6C9] opacity-15 rounded-full absolute -left-12 -bottom-12 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B5E20]/80 border border-green-300/30 text-[#C8E6C9] text-xs font-bold tracking-wider uppercase backdrop-blur-xs">
              <Award className="w-4 h-4 text-emerald-300" /> 100% Certified Organic Farm Produce
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Fresh Harvested Farm Products <br />
              <span className="text-[#C8E6C9]">Direct From Local Growers.</span>
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl">
              Buy fresh organic vegetables, fruits, grass-fed dairy, herbs, and grains directly from verified, approved family farms in your region.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setActiveTab('products')}
                className="px-7 py-3.5 rounded-full bg-white text-[#2E7D32] hover:bg-emerald-50 font-black text-sm shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>Shop Fresh Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenVendorReg}
                className="px-6 py-3.5 rounded-full bg-[#1B5E20]/80 hover:bg-[#1B5E20] text-emerald-100 font-bold text-sm border border-emerald-500/40 transition-all"
              >
                Become a Farm Vendor
              </button>
            </div>

            <div className="flex items-center gap-6 pt-6 border-t border-emerald-700/50 text-xs text-emerald-200/80">
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-lime-400" /> Temperature Dispatch
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-lime-400" /> USDA Organic Verified
              </span>
            </div>
          </div>

          {/* Hero Visual Collage */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-700/40 aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1000&q=80"
                alt="GK Organic Fresh Farm Produce"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-xs font-bold text-lime-300 uppercase tracking-widest">Featured Vendor</span>
                <h3 className="text-xl font-extrabold">Green Leaf Organic Farm</h3>
                <p className="text-xs text-slate-300">Sonoma Valley • Harvested Fresh Daily</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Explore Farm Categories
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a category to browse hand-picked agricultural produce from local vendors.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categoryHighlights.map(({ name, icon: Icon, count, bg }) => (
            <button
              key={name}
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: name as any }));
                setActiveTab('products');
              }}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all text-center space-y-3 group"
            >
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  {name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{count}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Organic Spotlight Carousel/Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-3xl border border-emerald-100 dark:border-emerald-900/40">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1">
              <Award className="w-4 h-4" /> Verified Organic Harvest
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Organic Certified Spotlight
            </h2>
          </div>
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, organicOnly: true }));
              setActiveTab('products');
            }}
            className="text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:underline flex items-center gap-1"
          >
            <span>View All Organic ({products.filter((p) => p.isOrganic).length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredOrganic.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProductForModal(product)}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-200/70 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all cursor-pointer space-y-3 group"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2 left-2 bg-emerald-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Organic Certified
                </span>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-400">{product.vendorName}</p>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-700 dark:hover:text-emerald-400">
                  {product.name}
                </h4>
                <p className="text-sm font-black text-emerald-700 dark:text-emerald-400 mt-1">
                  ${product.price.toFixed(2)} / {product.unit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Catalog View */}
      <ProductGrid />
    </div>
  );
};
