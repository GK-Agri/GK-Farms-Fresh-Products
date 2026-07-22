import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  FileCheck,
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { api } from '../../lib/api';

interface VendorRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VendorRegistration: React.FC<VendorRegistrationProps> = ({
  isOpen,
  onClose,
}) => {
  const { addNotification, refreshData, setRole } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [businessName, setBusinessName] = useState('Highland Botanical & Herb Farm');
  const [ownerName, setOwnerName] = useState('Clara Hughes');
  const [email, setEmail] = useState('clara@highlandherbs.com');
  const [phone, setPhone] = useState('+1 (555) 901-2345');
  const [address, setAddress] = useState('12 Highland Meadow, Napa, CA 94558');

  // Document numbers
  const [governmentId, setGovernmentId] = useState('GOV-CA-334991');
  const [businessLicense, setBusinessLicense] = useState('BL-2024-4419');
  const [organicCertificate, setOrganicCertificate] = useState('USDA-ORG-33100');
  const [farmRegistration, setFarmRegistration] = useState('FARM-REG-7711');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdVendorId, setCreatedVendorId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const newVendor = await api.registerVendor({
        businessName,
        ownerName,
        email,
        phone,
        address,
        governmentId,
        businessLicense,
        organicCertificate,
        farmRegistration,
        membershipAmount: 49,
        farmLocation: address,
      });

      // Process membership payment simulation
      await api.payVendorMembership(newVendor.id);

      setCreatedVendorId(newVendor.id);
      await refreshData();
      addNotification('Vendor application & $49 membership payment submitted! Pending Admin Verification.');
    } catch {
      addNotification('Registration failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl border border-emerald-100 dark:border-slate-800">
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Farm Vendor Partnership Application
              </h3>
              <p className="text-xs text-slate-500">Step {step} of 3 • GK Farms Approval Workflow</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="bg-slate-100 dark:bg-slate-800 h-1.5">
          <div
            className="bg-emerald-600 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        {createdVendorId ? (
          /* Confirmation View */
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-full">
                Application Pending Admin Review
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Application Received!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Thank you, <span className="font-bold text-slate-800 dark:text-slate-200">{ownerName}</span> ({businessName}). Your $49 membership payment is verified. GK Farms administrators will review your organic certificates and farm registration within 24 hours.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border text-xs text-left space-y-1">
              <p className="font-bold text-slate-800 dark:text-slate-200">Next Steps:</p>
              <p className="text-slate-500">1. Admin verifies Government ID & USDA Organic Cert.</p>
              <p className="text-slate-500">2. Account transitions from Pending → Approved.</p>
              <p className="text-slate-500">3. Vendor Portal activates for product listings.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  setRole('vendor');
                }}
                className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md"
              >
                Go To Vendor Portal Demo
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-600" />
                  1. Farm & Business Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Business / Farm Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Owner / Operator Full Name
                    </label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Business Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Farm Location & Dispatch Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 mt-4"
                >
                  <span>Continue to Documents</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  2. Business Documents & Organic Verification
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Government Issued ID No.
                    </label>
                    <input
                      type="text"
                      value={governmentId}
                      onChange={(e) => setGovernmentId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      State Business License No.
                    </label>
                    <input
                      type="text"
                      value={businessLicense}
                      onChange={(e) => setBusinessLicense(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      USDA Organic Certificate No.
                    </label>
                    <input
                      type="text"
                      value={organicCertificate}
                      onChange={(e) => setOrganicCertificate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Farm Land Registration No.
                    </label>
                    <input
                      type="text"
                      value={farmRegistration}
                      onChange={(e) => setFarmRegistration(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>Documents will be verified by GK Farms compliance team prior to product listing approval.</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-4 rounded-xl border text-xs font-bold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Partnership Fee</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  3. Vendor Partnership Fee Payment ($49)
                </h4>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span>Annual Vendor Membership Fee:</span>
                    <span className="text-emerald-700 dark:text-emerald-400">$49.00 / year</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Includes farm marketplace listing, cold-chain log routing, vendor dashboard, and order processing capabilities.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="block font-semibold text-slate-600">Simulated Payment Method</label>
                  <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 font-semibold flex items-center justify-between">
                    <span>Credit Card / PayPal (Pre-verified)</span>
                    <span className="font-bold text-emerald-700">$49.00 USD</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-3 px-4 rounded-xl border text-xs font-bold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? 'Submitting Application...' : 'Pay $49 & Submit Application'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
