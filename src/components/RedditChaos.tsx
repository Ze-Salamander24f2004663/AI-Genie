import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Zap, Dice1, RefreshCw, ExternalLink } from 'lucide-react';

interface RedditPost {
  id: string;
  title: string;
  content: string;
  subreddit: string;
  upvotes: number;
  url: string;
}

export default function RedditChaos() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentDecision, setCurrentDecision] = useState('');
  const [redditPosts, setRedditPosts] = useState<RedditPost[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState('');

  // Mock Reddit posts (in a real app, these would come from Reddit API)
  const mockPosts: RedditPost[] = [
    {
      id: '1',
      title: 'Life is too short to worry about what others think',
      content: 'Just went bungee jumping at 60. Best decision ever!',
      subreddit: 'r/GetMotivated',
      upvotes: 15420,
      url: 'https://reddit.com/r/getmotivated/example1'
    },
    {
      id: '2',
      title: 'Quit my job to travel the world',
      content: 'No regrets, seeing amazing places and meeting incredible people.',
      subreddit: 'r/solotravel',
      upvotes: 8934,
      url: 'https://reddit.com/r/solotravel/example2'
    },
    {
      id: '3',
      title: 'Started learning guitar at 45',
      content: 'Never too late to pick up a new hobby. Playing my first song now!',
      subreddit: 'r/Guitar',
      upvotes: 12567,
      url: 'https://reddit.com/r/guitar/example3'
    },
    {
      id: '4',
      title: 'Adopted a rescue dog and it changed my life',
      content: 'The companionship and joy they bring is incredible.',
      subreddit: 'r/dogs',
      upvotes: 23891,
      url: 'https://reddit.com/r/dogs/example4'
    },
  ];

  const handleChaosMode = async () => {
    if (!currentDecision.trim()) return;

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get random posts
    const shuffled = [...mockPosts].sort(() => 0.5 - Math.random());
    const selectedPosts = shuffled.slice(0, 3);
    setRedditPosts(selectedPosts);
    
    // Generate AI suggestion based on posts
    const suggestions = [
      `Based on Reddit's wisdom, it seems like taking bold action leads to great stories. The community suggests embracing change and new experiences!`,
      `The Reddit hive mind is saying: life's too short for overthinking. Multiple posts emphasize the importance of just going for it!`,
      `According to the collective Reddit experience, trying new things (even when scary) often leads to the best memories and personal growth.`,
      `The Reddit consensus appears to be: regret from not trying something is worse than failing at it. The community encourages taking the leap!`,
    ];
    
    setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
    setIsLoading(false);
  };

  const reset = () => {
    setRedditPosts([]);
    setAiSuggestion('');
    setCurrentDecision('');
  };

  return (
    <div className="h-full bg-gradient-to-b from-red-50 to-white overflow-y-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <Shuffle className="text-white" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Reddit Chaos Mode</h2>
            <p className="text-sm text-gray-500">Let Reddit decide your fate</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="text-red-600" size={20} />
            <h3 className="font-semibold text-gray-900">What decision are you struggling with?</h3>
          </div>
          <textarea
            value={currentDecision}
            onChange={(e) => setCurrentDecision(e.target.value)}
            placeholder="Should I quit my job? Move to a new city? Try something completely new? Ask Reddit!"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            rows={3}
          />
          <div className="flex space-x-3 mt-4">
            <motion.button
              onClick={handleChaosMode}
              disabled={!currentDecision.trim() || isLoading}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  <span>Consulting Reddit...</span>
                </>
              ) : (
                <>
                  <Dice1 size={18} />
                  <span>Activate Chaos Mode</span>
                </>
              )}
            </motion.button>
            {(redditPosts.length > 0 || aiSuggestion) && (
              <motion.button
                onClick={reset}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                whileTap={{ scale: 0.95 }}
              >
                Reset
              </motion.button>
            )}
          </div>
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center"
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-red-500 rounded-full animate-bounce" />
                <div className="w-6 h-6 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-6 h-6 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <p className="text-gray-600">Scanning Reddit for wisdom and chaos...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Suggestion */}
        <AnimatePresence>
          {aiSuggestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center space-x-2 mb-3">
                <Zap size={20} />
                <h3 className="font-semibold">AI Genie's Reddit Interpretation</h3>
              </div>
              <p className="leading-relaxed">{aiSuggestion}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reddit Posts */}
        <AnimatePresence>
          {redditPosts.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Shuffle size={18} className="text-red-600" />
                <span>Reddit's Collective Wisdom</span>
              </h3>
              {redditPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          {post.subreddit}
                        </span>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <span>↑ {post.upvotes.toLocaleString()}</span>
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{post.title}</h4>
                      <p className="text-gray-700 text-sm">{post.content}</p>
                    </div>
                  </div>
                  <div className="flex justify-end pt-3 border-t border-gray-100">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-xs text-red-600 hover:text-red-700"
                    >
                      <span>View on Reddit</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!isLoading && redditPosts.length === 0 && !aiSuggestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Shuffle className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for some chaos?</h3>
            <p className="text-gray-600">
              Enter a decision you're struggling with and let Reddit's collective wisdom guide you to unexpected insights!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}