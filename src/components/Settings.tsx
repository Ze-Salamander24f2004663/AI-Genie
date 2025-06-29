import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Crown, 
  Volume2, 
  Video, 
  Bell, 
  Shield, 
  Zap,
  Download,
  ExternalLink
} from 'lucide-react';

interface SettingsProps {
  isPremium: boolean;
  onUpgrade: () => void;
}

export default function Settings({ isPremium, onUpgrade }: SettingsProps) {
  const premiumFeatures = [
    'Unlimited AI conversations',
    'Voice responses with ElevenLabs',
    'Video avatar interactions',
    'Advanced goal tracking & analytics',
    'Export detailed life plans',
    'Priority support',
    'Custom voice personalities',
    'Mood trend analysis',
  ];

  const settingsOptions = [
    {
      category: 'AI Preferences',
      options: [
        { id: 'voice_responses', label: 'Voice Responses', icon: Volume2, premium: true },
        { id: 'video_avatar', label: 'Video Avatar', icon: Video, premium: true },
        { id: 'personality', label: 'AI Personality', icon: Zap, premium: false },
      ]
    },
    {
      category: 'Notifications',
      options: [
        { id: 'daily_checkin', label: 'Daily Check-ins', icon: Bell, premium: false },
        { id: 'goal_reminders', label: 'Goal Reminders', icon: Bell, premium: false },
        { id: 'wisdom_updates', label: 'New Wisdom', icon: Bell, premium: false },
      ]
    },
    {
      category: 'Privacy & Data',
      options: [
        { id: 'anonymous_mode', label: 'Anonymous Mode', icon: Shield, premium: false },
        { id: 'data_export', label: 'Export Data', icon: Download, premium: true },
        { id: 'blockchain_sync', label: 'Blockchain Sync', icon: ExternalLink, premium: true },
      ]
    }
  ];

  return (
    <div className="h-full bg-gradient-to-b from-gray-50 to-white overflow-y-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
            <SettingsIcon className="text-white" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Settings</h2>
            <p className="text-sm text-gray-500">Customize your experience</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Premium Upgrade Card */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Crown size={24} />
              <h3 className="text-lg font-bold">Upgrade to Premium</h3>
            </div>
            <p className="text-secondary-100 mb-4">
              Unlock the full power of AI Genie with premium features
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-secondary-200 rounded-full" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <motion.button
              onClick={onUpgrade}
              className="w-full bg-white text-secondary-600 font-semibold py-3 rounded-lg hover:bg-secondary-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Upgrade Now - $9.99/month
            </motion.button>
          </motion.div>
        )}

        {/* Settings Categories */}
        {settingsOptions.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">{category.category}</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {category.options.map((option) => {
                const Icon = option.icon;
                const isDisabled = option.premium && !isPremium;
                
                return (
                  <div
                    key={option.id}
                    className={`flex items-center justify-between p-4 ${
                      isDisabled ? 'opacity-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={20} className="text-gray-600" />
                      <div>
                        <span className="font-medium text-gray-900">{option.label}</span>
                        {option.premium && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Crown size={12} className="text-secondary-500" />
                            <span className="text-xs text-secondary-600">Premium</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isDisabled && (
                        <motion.button
                          onClick={onUpgrade}
                          className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full hover:bg-secondary-200 transition-colors"
                          whileTap={{ scale: 0.95 }}
                        >
                          Upgrade
                        </motion.button>
                      )}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          disabled={isDisabled}
                        />
                        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                          !isDisabled ? 'peer-checked:bg-primary-600' : ''
                        }`} />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* User Status */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Account Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className={`font-medium ${isPremium ? 'text-secondary-600' : 'text-gray-900'}`}>
                {isPremium ? 'Premium' : 'Free'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Member since:</span>
              <span className="text-gray-900">January 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Conversations:</span>
              <span className="text-gray-900">47</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Goals created:</span>
              <span className="text-gray-900">8</span>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center text-xs text-gray-500 py-4">
          <p>AI Genie v1.0.0</p>
          <p>Powered by GPT-4, ElevenLabs & Tavus</p>
        </div>
      </div>
    </div>
  );
}