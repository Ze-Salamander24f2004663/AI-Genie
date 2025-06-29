import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Zap, Volume2, Video, Download, Shield } from 'lucide-react';
import { RevenueCatService, PurchasePackage } from '../services/revenueCat';
import toast from 'react-hot-toast';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
}

export default function PremiumModal({ isOpen, onClose, onUpgradeSuccess }: PremiumModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('premium_monthly');

  const revenueCatService = new RevenueCatService('your-revenuecat-api-key');

  const packages: PurchasePackage[] = [
    {
      identifier: 'premium_monthly',
      packageType: 'MONTHLY',
      product: {
        identifier: 'ai_genie_premium_monthly',
        description: 'Unlock unlimited AI conversations, voice responses, and premium features',
        title: 'AI Genie Premium Monthly',
        price: '9.99',
        priceString: '$9.99',
        currencyCode: 'USD',
      },
    },
    {
      identifier: 'premium_yearly',
      packageType: 'ANNUAL',
      product: {
        identifier: 'ai_genie_premium_yearly',
        description: 'Best value! Full access to all premium features',
        title: 'AI Genie Premium Yearly',
        price: '99.99',
        priceString: '$99.99',
        currencyCode: 'USD',
      },
    },
  ];

  const premiumFeatures = [
    { icon: Zap, title: 'Unlimited AI Conversations', description: 'No daily limits on AI Genie interactions' },
    { icon: Volume2, title: 'ElevenLabs Voice Responses', description: 'Hear your genie speak with realistic AI voice' },
    { icon: Video, title: 'Tavus Video Avatar', description: 'See your AI Genie in personalized video responses' },
    { icon: Download, title: 'Export Life Plans', description: 'Download beautiful PDFs and shareable images' },
    { icon: Shield, title: 'Blockchain Wisdom Vault', description: 'Secure, permanent storage of your insights' },
    { icon: Crown, title: 'Priority Support', description: 'Get help faster with premium support' },
  ];

  const handlePurchase = async () => {
    setIsLoading(true);
    
    try {
      await revenueCatService.purchasePackage(selectedPackage);
      toast.success('🎉 Welcome to Premium! All features unlocked!');
      onUpgradeSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Purchase failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-white/20 relative overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/10 via-primary-500/10 to-accent-500/10" />
            
            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Crown className="text-white" size={32} />
                </motion.div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">
                  Upgrade to Premium
                </h2>
                <p className="text-gray-600 mt-2 text-lg">
                  Unlock the full power of AI Genie
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {premiumFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-4 bg-white/60 rounded-xl border border-white/30"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="text-white" size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pricing Options */}
              <div className="space-y-4 mb-8">
                {packages.map((pkg) => (
                  <motion.div
                    key={pkg.identifier}
                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPackage === pkg.identifier
                        ? 'border-secondary-500 bg-secondary-50'
                        : 'border-gray-200 bg-white/60 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPackage(pkg.identifier)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {pkg.packageType === 'ANNUAL' && (
                      <div className="absolute -top-3 left-6 bg-gradient-to-r from-secondary-500 to-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Best Value - Save 17%
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{pkg.product.title}</h3>
                        <p className="text-gray-600 text-sm">{pkg.product.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{pkg.product.priceString}</div>
                        <div className="text-sm text-gray-500">
                          {pkg.packageType === 'MONTHLY' ? 'per month' : 'per year'}
                        </div>
                        {pkg.packageType === 'ANNUAL' && (
                          <div className="text-xs text-secondary-600 font-semibold">
                            $8.33/month
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className={`absolute right-4 top-4 w-6 h-6 rounded-full border-2 ${
                      selectedPackage === pkg.identifier
                        ? 'border-secondary-500 bg-secondary-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedPackage === pkg.identifier && (
                        <Check className="text-white w-4 h-4 absolute top-0.5 left-0.5" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Purchase Button */}
              <motion.button
                onClick={handlePurchase}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-secondary-500 to-primary-500 text-white font-semibold py-4 rounded-xl hover:from-secondary-600 hover:to-primary-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Purchase...</span>
                  </div>
                ) : (
                  `Upgrade Now - ${packages.find(p => p.identifier === selectedPackage)?.product.priceString}`
                )}
              </motion.button>

              {/* Footer */}
              <div className="text-center mt-6 text-sm text-gray-500">
                <p>✓ Cancel anytime • ✓ 7-day free trial • ✓ Secure payment via RevenueCat</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}