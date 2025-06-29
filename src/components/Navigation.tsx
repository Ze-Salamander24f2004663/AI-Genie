import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Target, 
  BookOpen, 
  Shuffle, 
  Settings, 
  Sparkles,
  Crown,
  Zap
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isPremium: boolean;
}

export default function Navigation({ activeTab, onTabChange, isPremium }: NavigationProps) {
  const tabs = [
    { id: 'chat', label: 'AI Genie', icon: MessageCircle },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'wisdom', label: 'Wisdom', icon: BookOpen },
    { id: 'chaos', label: 'Chaos', icon: Shuffle },
    { id: 'oneshot', label: 'One-Shot', icon: Zap },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 px-4 py-2 fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors relative ${
                  isActive 
                    ? 'text-primary-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <Icon size={20} />
                  {isActive && (
                    <motion.div
                      className="absolute -inset-1 bg-primary-100 rounded-full -z-10"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Special indicator for One-Shot mode */}
                  {tab.id === 'oneshot' && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-accent-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {isPremium && (
        <motion.div
          className="absolute top-2 right-4 flex items-center space-x-1 bg-gradient-to-r from-secondary-400 to-secondary-500 text-white px-2 py-1 rounded-full text-xs font-medium"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Crown size={12} />
          <span>Premium</span>
        </motion.div>
      )}
    </nav>
  );
}