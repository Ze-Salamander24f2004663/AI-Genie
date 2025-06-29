import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, ThumbsUp, Clock, Filter, Search } from 'lucide-react';
import { WisdomEntry } from '../types';

interface WisdomVaultProps {
  wisdomEntries: WisdomEntry[];
  onAddWisdom: (wisdom: Omit<WisdomEntry, 'id' | 'timestamp' | 'votes'>) => void;
  onVoteWisdom: (id: string) => void;
}

export default function WisdomVault({ wisdomEntries, onAddWisdom, onVoteWisdom }: WisdomVaultProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newWisdom, setNewWisdom] = useState({
    content: '',
    category: 'Life Lessons',
    anonymous: true,
  });

  const categories = [
    'Life Lessons',
    'Career Advice',
    'Relationships',
    'Financial Wisdom',
    'Health & Wellness',
    'Personal Growth',
    'Learning & Skills',
    'Travel & Adventure',
  ];

  const filteredWisdom = wisdomEntries.filter((entry) => {
    const matchesSearch = entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWisdom.content.trim()) {
      onAddWisdom(newWisdom);
      setNewWisdom({
        content: '',
        category: 'Life Lessons',
        anonymous: true,
      });
      setShowAddForm(false);
    }
  };

  const sortedWisdom = [...filteredWisdom].sort((a, b) => b.votes - a.votes);

  return (
    <div className="h-full bg-gradient-to-b from-secondary-50 to-white overflow-y-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center">
              <BookOpen className="text-white" size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Wisdom Vault</h2>
              <p className="text-sm text-gray-500">Share & discover life wisdom</p>
            </div>
          </div>
          <motion.button
            onClick={() => setShowAddForm(true)}
            className="p-2 bg-secondary-600 text-white rounded-full"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <Plus size={20} />
          </motion.button>
        </div>

        {/* Search and Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wisdom..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Wisdom Cards */}
        <AnimatePresence>
          {sortedWisdom.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium">
                      {entry.category}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock size={12} />
                      <span>{entry.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-gray-900 leading-relaxed">{entry.content}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  {entry.anonymous ? 'Anonymous' : 'Community Member'}
                </div>
                <motion.button
                  onClick={() => onVoteWisdom(entry.id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-secondary-50 hover:bg-secondary-100 text-secondary-700 rounded-full transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <ThumbsUp size={14} />
                  <span className="text-sm font-medium">{entry.votes}</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {sortedWisdom.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No wisdom found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter' 
                : 'Be the first to share your life wisdom'}
            </p>
            {!searchQuery && selectedCategory === 'all' && (
              <motion.button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Share Your Wisdom
              </motion.button>
            )}
          </motion.div>
        )}
      </div>

      {/* Add Wisdom Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Wisdom</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your wisdom or life lesson
                  </label>
                  <textarea
                    value={newWisdom.content}
                    onChange={(e) => setNewWisdom({ ...newWisdom, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    rows={4}
                    placeholder="Share something you've learned that might help others..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newWisdom.category}
                    onChange={(e) => setNewWisdom({ ...newWisdom, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={newWisdom.anonymous}
                    onChange={(e) => setNewWisdom({ ...newWisdom, anonymous: e.target.checked })}
                    className="rounded text-secondary-600 focus:ring-secondary-500"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700">
                    Share anonymously
                  </label>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                  >
                    Share Wisdom
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}