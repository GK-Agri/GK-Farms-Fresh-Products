import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Calendar,
  Check,
  Heart,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  X,
  Plus,
  Minus,
} from 'lucide-react';
import { api } from '../../lib/api';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForModal,
    setSelectedProductForModal,
    addToCart,
    wishlist,
    toggleWishlist,
    addNotification,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('Satisfied Farm Customer');
  const [submittingReview, setSubmittingReview] = useState(false);

  if (!selectedProductForModal) return null;

  const product = selectedProductForModal;
  const isWishlisted = wishlist.includes(product.id);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      setSubmittingReview(true);
      await api.addReview(product.id, {
        productId: product.id,
        customerName: reviewerName,
        rating: newRating,
        comment: newComment,
      });
      addNotification('Thank you! Your verified product review has been published.');
      setNewComment('');
      // refresh product details
      const updated = await api.getProductById(product.id);
      setSelectedProductForModal(updated);
    } catch {
      addNotification('Could not submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full my-8 overflow-hidden shadow-2xl border border-emerald-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        {/* Header bar */}
        <div className="relative bg-slate-50 dark:bg-slate-800/60 p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {product.category}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Grade: {product.grade}
            </span>
          </div>

          <button
            onClick={() => setSelectedProductForModal(null)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Column */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-100 dark:bg-slate-800 shadow-inner">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {product.isOrganic && (
                <div className="absolute top-3 left-3 bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-emerald-500/30">
                  <Award className="w-4 h-4 text-lime-300" />
                  <span>Organic Certified</span>
                </div>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg transition-transform active:scale-90 ${
                  isWishlisted
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-white'
                }`}
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>

            {/* Farm Certification Details */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/50 space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Fresh Agriculture Standard</span>
              </div>
              <p>Organic Certificate No: {product.organicCertNumber || 'USDA-ORG-88310'}</p>
              <div className="flex justify-between pt-1 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Harvested: {product.harvestDate}
                </span>
                <span>Expiry: {product.expiryDate}</span>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Store className="w-3.5 h-3.5" /> Sold by: {product.vendorName}
                </p>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {product.name}
                </h2>
              </div>

              {/* Rating & Stock */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewCount} reviews)</span>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    product.quantity < 15
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {product.quantity < 15 ? `Low Stock (${product.quantity} left)` : `In Stock (${product.quantity} ${product.unit})`}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-3xl font-black text-emerald-800 dark:text-emerald-400">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-slate-500">per {product.unit}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Add to Cart Actions */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Quantity ({product.unit}):
                </label>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    addToCart(product, quantity);
                    setSelectedProductForModal(null);
                  }}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add To Cart • ${(product.price * quantity).toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h4 className="font-bold text-slate-900 dark:text-white text-base">Verified Harvest Reviews</h4>

          {/* Add Review Form */}
          <form onSubmit={handleAddReview} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Your Name"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                required
              />
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              placeholder="Write your review on product quality, freshness, or flavor..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
              required
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors"
            >
              {submittingReview ? 'Publishing...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
