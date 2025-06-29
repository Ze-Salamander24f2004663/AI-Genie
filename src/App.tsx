import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import ChatInterface from './components/ChatInterface';
import GoalsTracker from './components/GoalsTracker';
import WisdomVault from './components/WisdomVault';
import RedditChaos from './components/RedditChaos';
import Settings from './components/Settings';
import OneShotMode from './components/OneShotMode';
import AuthModal from './components/AuthModal';
import PremiumModal from './components/PremiumModal';
import ExportModal from './components/ExportModal';
import ParticleBackground from './components/ParticleBackground';
import DynamicBackground from './components/DynamicBackground';
import FloatingElements from './components/FloatingElements';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Message, Goal, WisdomEntry } from './types';
import { Sparkles, Star, Zap, User, Crown, LogOut } from 'lucide-react';
import { AuthService } from './services/auth';
import { RevenueCatService } from './services/revenueCat';
import { AlgorandService } from './services/algorand';
import { ElevenLabsService } from './services/elevenLabs';
import { TavusService } from './services/tavus';
import { ExportService, LifePlan } from './services/export';
import toast from 'react-hot-toast';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useLocalStorage<Message[]>('ai-genie-messages', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('ai-genie-goals', []);
  const [wisdomEntries, setWisdomEntries] = useLocalStorage<WisdomEntry[]>('ai-genie-wisdom', []);
  const [isPremium, setIsPremium] = useLocalStorage('ai-genie-premium', false);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentLifePlan, setCurrentLifePlan] = useState<LifePlan | null>(null);

  // Initialize services
  const authService = new AuthService();
  const revenueCatService = new RevenueCatService('your-revenuecat-api-key');
  const algorandService = new AlgorandService();
  const elevenLabsService = new ElevenLabsService('your-elevenlabs-api-key');
  const tavusService = new TavusService('your-tavus-api-key');
  const exportService = new ExportService();

  useEffect(() => {
    if (messages.length > 0 || activeTab !== 'chat') {
      setShowWelcome(false);
    }
  }, [messages, activeTab]);

  useEffect(() => {
    // Check authentication status
    checkAuthStatus();
    // Load blockchain wisdom
    loadBlockchainWisdom();
    // Check premium status
    checkPremiumStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        console.log('User authenticated:', user.email);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const loadBlockchainWisdom = async () => {
    try {
      const blockchainWisdom = await algorandService.getWisdomEntries();
      // Merge with local wisdom
      const localWisdom = JSON.parse(localStorage.getItem('ai-genie-wisdom') || '[]');
      const allWisdom = [...localWisdom, ...blockchainWisdom];
      setWisdomEntries(allWisdom);
    } catch (error) {
      console.error('Failed to load blockchain wisdom:', error);
    }
  };

  const checkPremiumStatus = async () => {
    try {
      const customerInfo = await revenueCatService.getCustomerInfo();
      if (customerInfo?.entitlements.active.premium) {
        setIsPremium(true);
      }
    } catch (error) {
      console.error('Failed to check premium status:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setCurrentUser(null);
      toast.success('👋 Signed out successfully!');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setShowWelcome(false);

    // Simulate AI response with more realistic delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

    const aiResponses = [
      "✨ I sense great wisdom in your question. Based on my understanding of life's patterns, here's what I see: This situation presents both challenge and opportunity. Consider taking small, deliberate steps forward while staying true to your core values.",
      "🔮 The cosmic energies suggest this is a moment for bold action! Your intuition is trying to tell you something important. Trust the process and remember that growth often comes disguised as discomfort.",
      "🌟 I've analyzed thousands of similar situations, and here's what consistently leads to fulfillment: Focus on what you can control, embrace uncertainty as a teacher, and remember that every expert was once a beginner.",
      "💫 Your path is becoming clearer to me. This challenge is actually preparing you for something greater. Consider this: What would you do if you knew you couldn't fail? That's your answer.",
      "⚡ Drawing from the collective wisdom of countless life experiences, I see that you're at a crossroads that many have faced. The key is to align your actions with your deeper purpose and values.",
      "🎯 The universe has a funny way of presenting us with exactly what we need to grow. This situation is your invitation to step into a more authentic version of yourself. What would your future self advise you to do?",
    ];

    let responseContent = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    let messageType: 'text' | 'voice' | 'video' = 'text';

    // Generate voice response for premium users
    if (isPremium && Math.random() > 0.7) {
      try {
        messageType = 'voice';
        // In a real app, this would generate actual audio
        console.log('Generating voice response with ElevenLabs...');
      } catch (error) {
        console.error('Voice generation failed:', error);
      }
    }

    // Generate video response for premium users (less frequent)
    if (isPremium && Math.random() > 0.9) {
      try {
        messageType = 'video';
        // In a real app, this would generate actual video
        console.log('Generating video response with Tavus...');
      } catch (error) {
        console.error('Video generation failed:', error);
      }
    }

    const genieMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: responseContent,
      sender: 'genie',
      timestamp: new Date(),
      type: messageType,
    };

    setIsTyping(false);
    setMessages(prev => [...prev, genieMessage]);
  };

  const handleAddGoal = (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const handleUpdateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const handleAddWisdom = async (wisdomData: Omit<WisdomEntry, 'id' | 'timestamp' | 'votes'>) => {
    const newWisdom: WisdomEntry = {
      ...wisdomData,
      id: Date.now().toString(),
      timestamp: new Date(),
      votes: 0,
    };

    // Store locally first
    setWisdomEntries(prev => [...prev, newWisdom]);

    // Store on blockchain for premium users
    if (isPremium) {
      try {
        await algorandService.storeWisdom({
          content: newWisdom.content,
          category: newWisdom.category,
          votes: 0,
          anonymous: newWisdom.anonymous,
        });
        console.log('Wisdom stored on Algorand blockchain');
      } catch (error) {
        console.error('Failed to store wisdom on blockchain:', error);
      }
    }
  };

  const handleVoteWisdom = async (id: string) => {
    setWisdomEntries(prev => prev.map(entry =>
      entry.id === id ? { ...entry, votes: entry.votes + 1 } : entry
    ));

    // Update vote on blockchain if applicable
    if (isPremium) {
      try {
        await algorandService.voteOnWisdom(id);
      } catch (error) {
        console.error('Failed to vote on blockchain:', error);
      }
    }
  };

  const handleUpgrade = async () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setShowPremiumModal(true);
  };

  const handleAuthSuccess = () => {
    checkAuthStatus();
  };

  const handleUpgradeSuccess = () => {
    setIsPremium(true);
    checkPremiumStatus();
  };

  const handleExportLifePlan = () => {
    // Generate life plan from current data
    const lifePlan: LifePlan = {
      id: Date.now().toString(),
      title: 'My AI Genie Life Plan',
      description: 'A comprehensive guide to achieving my goals and living my best life, created with AI-powered insights.',
      goals: goals.map(goal => ({
        title: goal.title,
        description: goal.description,
        progress: goal.progress,
        category: goal.category,
      })),
      insights: [
        'Focus on consistent daily actions rather than perfect outcomes',
        'Your biggest growth happens outside your comfort zone',
        'Progress is more important than perfection',
        'Small wins compound into major achievements',
      ],
      recommendations: [
        'Set aside 30 minutes daily for goal-focused activities',
        'Track your progress weekly to maintain momentum',
        'Celebrate small wins to build positive reinforcement',
        'Review and adjust your goals monthly based on new insights',
      ],
      createdAt: new Date(),
      userId: currentUser?.id,
    };

    setCurrentLifePlan(lifePlan);
    setShowExportModal(true);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        );
      case 'goals':
        return (
          <GoalsTracker
            goals={goals}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        );
      case 'wisdom':
        return (
          <WisdomVault
            wisdomEntries={wisdomEntries}
            onAddWisdom={handleAddWisdom}
            onVoteWisdom={handleVoteWisdom}
          />
        );
      case 'chaos':
        return <RedditChaos />;
      case 'oneshot':
        return <OneShotMode />;
      case 'settings':
        return <Settings isPremium={isPremium} onUpgrade={handleUpgrade} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col overflow-hidden relative">
      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: '#1f2937',
          },
        }}
      />

      {/* Dynamic backgrounds */}
      <DynamicBackground />
      <ParticleBackground />
      <FloatingElements />

      {/* Top bar with user info and export */}
      <motion.div
        className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-white/20 z-30"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="text-primary-600" size={24} />
          </motion.div>
          <div>
            <h1 className="font-bold text-gray-900">AI Genie</h1>
            <p className="text-xs text-gray-600">Universal Life Copilot</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {goals.length > 0 && (
            <motion.button
              onClick={handleExportLifePlan}
              className="px-3 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Export Plan
            </motion.button>
          )}

          {currentUser ? (
            <div className="flex items-center space-x-2">
              {isPremium && (
                <Crown className="text-secondary-500" size={16} />
              )}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <User className="text-white" size={16} />
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-medium text-gray-900">{currentUser.full_name || 'User'}</div>
                  <div className="text-xs text-gray-500">{currentUser.email}</div>
                </div>
              </div>
              <motion.button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Sign Out"
              >
                <LogOut size={16} />
              </motion.button>
            </div>
          ) : (
            <motion.button
              onClick={() => setShowAuthModal(true)}
              className="px-3 py-2 bg-white/60 border border-white/30 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/80"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Epic Welcome Animation */}
      <AnimatePresence>
        {showWelcome && activeTab === 'chat' && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 flex items-center justify-center z-50 overflow-hidden"
          >
            {/* Animated background elements */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center text-white relative z-10"
            >
              {/* Main genie lamp/icon */}
              <motion.div
                className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-8 flex items-center justify-center relative overflow-hidden"
                animate={{ 
                  rotate: 360,
                  boxShadow: [
                    '0 0 20px rgba(255,255,255,0.3)',
                    '0 0 60px rgba(255,255,255,0.5)',
                    '0 0 20px rgba(255,255,255,0.3)',
                  ]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  boxShadow: { duration: 2, repeat: Infinity }
                }}
              >
                <Sparkles size={48} className="text-white" />
                
                {/* Orbiting elements */}
                {[Star, Zap, Sparkles].map((Icon, index) => (
                  <motion.div
                    key={index}
                    className="absolute w-8 h-8 text-white/60"
                    style={{
                      top: '50%',
                      left: '50%',
                      transformOrigin: '0 0',
                    }}
                    animate={{
                      rotate: 360,
                      x: Math.cos((index * 120) * Math.PI / 180) * 60,
                      y: Math.sin((index * 120) * Math.PI / 180) * 60,
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.5,
                    }}
                  >
                    <Icon size={20} />
                  </motion.div>
                ))}
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text"
              >
                Welcome to AI Genie
              </motion.h1>
              
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-2xl text-primary-100 mb-8 font-light"
              >
                Your Universal Life Copilot
              </motion.p>
              
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="space-y-3 text-primary-200 text-lg max-w-md mx-auto"
              >
                {[
                  { icon: "✨", text: "AI-powered life guidance" },
                  { icon: "🎯", text: "Smart goal tracking" },
                  { icon: "🔮", text: "Blockchain wisdom vault" },
                  { icon: "🎲", text: "Reddit chaos mode" },
                  { icon: "⚡", text: "One-shot instant wisdom" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-center space-x-3"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <span>{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="mt-12"
              >
                <motion.button
                  onClick={() => setShowWelcome(false)}
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white font-semibold text-lg hover:bg-white/30 transition-all duration-300"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(255,255,255,0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Begin Your Journey
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with enhanced transitions */}
      <div className="flex-1 pb-20 relative z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.4,
              type: "spring",
              stiffness: 100
            }}
            className="h-full"
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isPremium={isPremium}
      />

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
      />

      {currentLifePlan && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          lifePlan={currentLifePlan}
        />
      )}
    </div>
  );
}

export default App;