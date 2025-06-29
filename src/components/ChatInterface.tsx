import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Volume2, Sparkles, Bot, Zap, Star } from 'lucide-react';
import { Message } from '../types';
import InteractiveButton from './InteractiveButton';
import AnimatedCard from './AnimatedCard';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isTyping: boolean;
}

export default function ChatInterface({ messages, onSendMessage, isTyping }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length > 0) {
      setShowSuggestions(false);
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestions = [
    "Should I change careers?",
    "How can I improve my relationships?",
    "What should I learn next?",
    "Help me make a tough decision",
    "I'm feeling stuck in life",
    "How do I find my passion?"
  ];

  const genieResponses = [
    "✨ Channeling cosmic wisdom for you...",
    "🔮 The universe is aligning your answer...",
    "🌟 Consulting the stars for guidance...",
    "💫 Weaving together threads of insight...",
    "⚡ Downloading universal knowledge...",
  ];

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Dynamic header with floating elements */}
      <motion.div 
        className="relative bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10 backdrop-blur-xl border-b border-white/20 p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-4">
          <motion.div 
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-30"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <div>
            <motion.h2 
              className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              AI Genie
            </motion.h2>
            <motion.p 
              className="text-gray-600"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Your Universal Life Copilot
            </motion.p>
          </div>
        </div>

        {/* Floating sparkles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-400 rounded-full"
            style={{
              top: `${20 + Math.random() * 60}%`,
              right: `${10 + Math.random() * 30}%`,
            }}
            animate={{
              y: [-10, -30, -10],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
            }}
          />
        ))}
      </motion.div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {/* Welcome state with dynamic suggestions */}
          {showSuggestions && messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="text-white" size={32} />
              </motion.div>
              
              <motion.h3 
                className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Welcome to AI Genie
              </motion.h3>
              
              <motion.p 
                className="text-gray-600 mb-8 text-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                I'm here to help you make smarter life decisions. Ask me anything!
              </motion.p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="group relative p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover:border-primary-300 transition-all duration-300 text-left shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 10px 30px rgba(168, 85, 247, 0.2)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Star size={16} className="text-white" />
                      </div>
                      <span className="text-gray-800 font-medium">{suggestion}</span>
                    </div>
                    
                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      layoutId={`suggestion-glow-${index}`}
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ 
                duration: 0.4,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md relative ${
                message.sender === 'user' ? 'ml-12' : 'mr-12'
              }`}>
                {message.sender === 'genie' && (
                  <motion.div 
                    className="flex items-center space-x-2 mb-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <Bot size={16} className="text-primary-600" />
                    </motion.div>
                    <span className="text-xs font-semibold text-primary-600">AI Genie</span>
                  </motion.div>
                )}
                
                <AnimatedCard
                  className={`p-4 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                      : 'bg-white/90 text-gray-900'
                  }`}
                  glowColor={message.sender === 'user' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(245, 158, 11, 0.2)'}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.type === 'voice' && (
                    <motion.button 
                      className="mt-3 flex items-center space-x-2 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Volume2 size={12} />
                      <span>Play voice response</span>
                    </motion.button>
                  )}
                </AnimatedCard>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start mr-12"
            >
              <AnimatedCard className="p-4 bg-white/90">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Bot size={16} className="text-primary-600" />
                  </motion.div>
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((dot) => (
                      <motion.div
                        key={dot}
                        className="w-2 h-2 bg-primary-400 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: dot * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">
                    {genieResponses[Math.floor(Math.random() * genieResponses.length)]}
                  </span>
                </div>
              </AnimatedCard>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced input area */}
      <motion.div 
        className="p-6 bg-white/80 backdrop-blur-xl border-t border-white/20"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <motion.textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your genie anything..."
              className="w-full px-6 py-4 pr-14 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none max-h-32 transition-all duration-300 shadow-lg"
              rows={1}
              whileFocus={{ scale: 1.02 }}
            />
            
            <motion.button
              type="button"
              onClick={() => setIsVoiceMode(!isVoiceMode)}
              className={`absolute right-4 top-4 p-2 rounded-full transition-all duration-300 ${
                isVoiceMode 
                  ? 'text-primary-600 bg-primary-100 shadow-lg' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mic size={16} />
            </motion.button>
          </div>
          
          <InteractiveButton
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="p-4 rounded-2xl"
          >
            <Send size={20} />
          </InteractiveButton>
        </form>
      </motion.div>
    </div>
  );
}