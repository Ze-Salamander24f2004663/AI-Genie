import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Send, Volume2, Video, Download, Clock, TrendingUp } from 'lucide-react';
import { OneShotService, OneShotResponse } from '../services/oneShot';
import InteractiveButton from './InteractiveButton';
import AnimatedCard from './AnimatedCard';
import toast from 'react-hot-toast';

export default function OneShotMode() {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<OneShotResponse | null>(null);
  const [includeVoice, setIncludeVoice] = useState(false);
  const [includeVideo, setIncludeVideo] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const oneShotService = new OneShotService('your-api-key');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsProcessing(true);
    setResponse(null);

    try {
      const result = await oneShotService.processOneShot({
        prompt: prompt.trim(),
        includeVoice,
        includeVideo,
      });

      setResponse(result);
      toast.success(`One-shot complete in ${(result.processingTime / 1000).toFixed(1)}s! ⚡`);
      
      // Update stats
      const newStats = await oneShotService.getOneShotStats();
      setStats(newStats);
    } catch (error: any) {
      toast.error(error.message || 'One-shot processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const loadStats = async () => {
    const statsData = await oneShotService.getOneShotStats();
    setStats(statsData);
  };

  // Load stats on component mount
  useState(() => {
    loadStats();
  });

  return (
    <div className="h-full overflow-y-auto relative">
      {/* Dynamic header */}
      <motion.div 
        className="relative bg-gradient-to-br from-accent-500/10 via-primary-500/10 to-secondary-500/10 backdrop-blur-xl border-b border-white/20 p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="relative"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center shadow-xl">
                <Zap className="text-white" size={24} />
              </div>
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-accent-400 to-primary-400 rounded-full opacity-30"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <motion.h2 
                className="text-xl font-bold bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                One-Shot Mode
              </motion.h2>
              <motion.p 
                className="text-gray-600"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Instant AI wisdom in a single response
              </motion.p>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-4">
            <motion.div
              className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-lg font-bold text-accent-600">{stats.totalRequests}</div>
              <div className="text-xs text-gray-600">Total Shots</div>
            </motion.div>
            
            <motion.div
              className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-lg font-bold text-green-600">
                {stats.averageProcessingTime ? `${(stats.averageProcessingTime / 1000).toFixed(1)}s` : '0s'}
              </div>
              <div className="text-xs text-gray-600">Avg Speed</div>
            </motion.div>
            
            <motion.div
              className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-lg font-bold text-primary-600">{stats.voiceRequests}</div>
              <div className="text-xs text-gray-600">Voice</div>
            </motion.div>
            
            <motion.div
              className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-lg font-bold text-secondary-600">{stats.videoRequests}</div>
              <div className="text-xs text-gray-600">Video</div>
            </motion.div>
          </div>
        )}
      </motion.div>

      <div className="p-6 space-y-6">
        {/* Input Form */}
        <AnimatedCard glowColor="rgba(14, 165, 233, 0.2)">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎯 What do you need instant guidance on?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Should I quit my job? How do I ask someone out? What should I do this weekend? Ask anything for instant wisdom..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none transition-all"
                rows={4}
                disabled={isProcessing}
              />
            </div>

            {/* Options */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeVoice}
                  onChange={(e) => setIncludeVoice(e.target.checked)}
                  className="rounded text-accent-600 focus:ring-accent-500"
                  disabled={isProcessing}
                />
                <Volume2 size={16} className="text-gray-600" />
                <span className="text-sm text-gray-700">Include Voice Response</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeVideo}
                  onChange={(e) => setIncludeVideo(e.target.checked)}
                  className="rounded text-accent-600 focus:ring-accent-500"
                  disabled={isProcessing}
                />
                <Video size={16} className="text-gray-600" />
                <span className="text-sm text-gray-700">Include Video Response</span>
              </label>
            </div>

            <InteractiveButton
              onClick={handleSubmit}
              disabled={!prompt.trim() || isProcessing}
              variant="accent"
              className="w-full"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing One-Shot...</span>
                </div>
              ) : (
                <>
                  <Zap size={20} className="mr-2" />
                  Fire One-Shot
                </>
              )}
            </InteractiveButton>
          </form>
        </AnimatedCard>

        {/* Processing Animation */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12"
            >
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full mx-auto mb-6 flex items-center justify-center"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity }
                }}
              >
                <Zap className="text-white" size={32} />
              </motion.div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Your One-Shot</h3>
              <p className="text-gray-600">
                AI Genie is analyzing your request and generating instant wisdom...
              </p>
              
              {/* Processing steps */}
              <div className="mt-6 space-y-2 max-w-md mx-auto">
                {[
                  'Analyzing your prompt...',
                  'Accessing wisdom database...',
                  includeVoice && 'Generating voice response...',
                  includeVideo && 'Creating video avatar...',
                  'Finalizing response...'
                ].filter(Boolean).map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2 text-sm text-gray-600"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.5 }}
                  >
                    <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
                    <span>{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Response */}
        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-4"
            >
              {/* Response Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Zap className="text-accent-600" size={20} />
                  <span>One-Shot Response</span>
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>{(response.processingTime / 1000).toFixed(1)}s</span>
                </div>
              </div>

              {/* Main Response */}
              <AnimatedCard glowColor="rgba(245, 158, 11, 0.2)">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                    {response.response}
                  </div>
                </div>
              </AnimatedCard>

              {/* Media Responses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {response.audioUrl && (
                  <AnimatedCard>
                    <div className="flex items-center space-x-3 mb-3">
                      <Volume2 className="text-primary-600" size={20} />
                      <h4 className="font-semibold text-gray-900">Voice Response</h4>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-2">Voice response generated!</p>
                      <InteractiveButton size="sm">
                        <Volume2 size={16} className="mr-2" />
                        Play Audio
                      </InteractiveButton>
                    </div>
                  </AnimatedCard>
                )}

                {response.videoUrl && (
                  <AnimatedCard>
                    <div className="flex items-center space-x-3 mb-3">
                      <Video className="text-secondary-600" size={20} />
                      <h4 className="font-semibold text-gray-900">Video Response</h4>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-2">Video avatar ready!</p>
                      <InteractiveButton variant="secondary" size="sm">
                        <Video size={16} className="mr-2" />
                        Watch Video
                      </InteractiveButton>
                    </div>
                  </AnimatedCard>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-center space-x-3">
                <InteractiveButton
                  onClick={() => {
                    setPrompt('');
                    setResponse(null);
                  }}
                  variant="accent"
                >
                  <Zap size={16} className="mr-2" />
                  Fire Another Shot
                </InteractiveButton>
                
                <InteractiveButton>
                  <Download size={16} className="mr-2" />
                  Export Response
                </InteractiveButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!isProcessing && !response && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Zap className="mx-auto text-gray-400 mb-6" size={64} />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Ready for Instant Wisdom?</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              One-Shot Mode delivers immediate, comprehensive AI guidance in a single powerful response. 
              No back-and-forth needed - just pure, instant insight.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm">
              <div className="bg-white/60 rounded-lg p-4">
                <TrendingUp className="text-accent-600 mx-auto mb-2" size={24} />
                <div className="font-semibold text-gray-900">Lightning Fast</div>
                <div className="text-gray-600">Get answers in seconds</div>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <Volume2 className="text-primary-600 mx-auto mb-2" size={24} />
                <div className="font-semibold text-gray-900">Multi-Modal</div>
                <div className="text-gray-600">Text, voice, and video</div>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <Zap className="text-secondary-600 mx-auto mb-2" size={24} />
                <div className="font-semibold text-gray-900">Comprehensive</div>
                <div className="text-gray-600">Complete guidance in one shot</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}