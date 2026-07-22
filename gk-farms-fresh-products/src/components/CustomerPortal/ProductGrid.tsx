import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Heart,
  ShoppingBag,
  Star,
  Store,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { CategoryName, Product, ProductGrade } from '../../types';

export const ProductGrid: React.FC = () => {
  const {
    products,
    filters,
    setFilters,
    resetFilters,
    addToCart,
    wishlist,
    toggleWishlist,
    setSelectedProductForModal,
  } = useApp();

  const categories: ('All' | CategoryName)[] = [
    'All',
    'Fresh Vegetables',
    'Fruits',
    'Dairy & Eggs',
    'Grains & Pulses',
    'Herbs & Spices',
    'Honey & Preserves',
  ];

  const grades: ('All' | ProductGrade)[] = [
    'All',
    'Organic Certified',
    'Grade A+',
    'Grade A',
  ];

  // Filter & Sort Logic
  const filteredProducts = products.filter((p) => {
    if (filters.category !== 'All' && p.category !== filters.category) return false;
    if (filters.grade !== 'All' && p.grade !== filters.grade) return false;
    if (filters.organicOnly && !p.isOrganic) return false;
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
    if (
      filters.search &&
      !p.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !p.description.toLowerCase().includes(filters.search.toLowerCase()) &&
      !p.vendorName.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === 'price-low') return a.price - b.price;
    if (filters.sortBy === 'price-high') return b.price - a.price;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    if (filters.sortBy === 'newest') return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            Fresh Farm Products Catalog
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Showing {sortedProducts.length} certified organic & fresh farm produce items
          </p>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">Sort By:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="featured">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Fresh Harvest Date</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-xs h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              Filter Products
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Categories
            </label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    filters.category === cat
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{cat}</span>
                  {filters.category === cat && <span className="w-1.5 h-1.5 rounded-full bg-lime-300" />}
                </button>
              ))}
            </div>
          </div>

          {/* Organic Only Checkbox */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2.5 cursor-pointer p-2.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/50">
              <input
                type="checkbox"
                checked={filters.organicOnly}
                onChange={(e) => setFilters((prev) => ({ ...prev, organicOnly: e.target.checked }))}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Organic Certified Only
              </span>
            </label>
          </div>

          {/* Product Grade */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Product Quality Grade
            </label>
            <div className="grid grid-cols-1 gap-1">
              {grades.map((grd) => (
                <button
                  key={grd}
                  onClick={() => setFilters((prev) => ({ ...prev, grade: grd }))}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    filters.grade === grd
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold'
                      : 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {grd}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Max Price</span>
              <span className="text-emerald-700 dark:text-emerald-400">${filters.maxPrice.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={filters.maxPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3">
          {sortedProducts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your filters, adjusting the price slider, or resetting search keywords.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:bg-emerald-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((product) => {
                const isWishlisted = wishlist.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Top Image area */}
                    <div className="relative aspect-4/3 bg-[#F1F8E9] dark:bg-slate-800 rounded-xl overflow-hidden mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {product.isOrganic && (
                        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs text-[#2E7D32] text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs border border-green-100 uppercase tracking-wider">
                          <Award className="w-3 h-3 text-[#2E7D32]" />
                          <span>Organic Certified</span>
                        </div>
                      )}

                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-transform active:scale-90 ${
                          isWishlisted
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-white'
                        }`}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>

                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Store className="w-3 h-3 text-emerald-300" />
                        <span className="truncate max-w-[140px]">{product.vendorName}</span>
                      </div>
                    </div>

                    {/* Content area */}
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                          <span>{product.category}</span>
                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                            <Star className="w-3 h-3 fill-current" /> {product.rating}
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedProductForModal(product)}
                          className="text-left w-full text-base font-bold text-slate-900 dark:text-white hover:text-[#2E7D32] dark:hover:text-emerald-400 line-clamp-1 transition-colors"
                        >
                          {product.name}
                        </button>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Price & Action */}
                      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-lg font-black text-[#2E7D32] dark:text-emerald-400">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">/{product.unit}</span>
                        </div>

                        <button
                          onClick={() => addToCart(product, 1)}
                          className="w-9 h-9 rounded-lg bg-[#2E7D32] hover:bg-[#1B5E20] text-white flex items-center justify-center font-bold shadow-xs transition-all active:scale-95"
                          title="Add to Cart"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
