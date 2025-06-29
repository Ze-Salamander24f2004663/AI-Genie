import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, TrendingUp, Calendar, Edit, Trash2, Award, Zap } from 'lucide-react';
import { Goal } from '../types';
import InteractiveButton from './InteractiveButton';
import AnimatedCard from './AnimatedCard';

interface GoalsTrackerProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void;
  onDeleteGoal: (id: string) => void;
}

export default function GoalsTracker({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }: GoalsTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal' as Goal['category'],
    progress: 0,
    deadline: '',
  });

  const categories = [
    { id: 'career', label: 'Career', color: 'from-blue-500 to-blue-600', icon: '💼' },
    { id: 'health', label: 'Health', color: 'from-green-500 to-green-600', icon: '🏃' },
    { id: 'finance', label: 'Finance', color: 'from-yellow-500 to-yellow-600', icon: '💰' },
    { id: 'personal', label: 'Personal', color: 'from-purple-500 to-purple-600', icon: '🌟' },
    { id: 'learning', label: 'Learning', color: 'from-red-500 to-red-600', icon: '📚' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.title.trim()) {
      onAddGoal({
        ...newGoal,
        deadline: newGoal.deadline ? new Date(newGoal.deadline) : undefined,
      });
      setNewGoal({
        title: '',
        description: '',
        category: 'personal',
        progress: 0,
        deadline: '',
      });
      setShowAddForm(false);
    }
  };

  const getCategoryData = (category: Goal['category']) => {
    return categories.find(c => c.id === category) || categories[3];
  };

  const overallProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
    : 0;

  const completedGoals = goals.filter(goal => goal.progress === 100).length;

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
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center shadow-xl">
                <Target className="text-white" size={24} />
              </div>
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-accent-400 to-primary-400 rounded-full opacity-30"
                animate={{ scale: [1, 1.3, 1] }}
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
                Goals Tracker
              </motion.h2>
              <motion.p 
                className="text-gray-600"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Transform dreams into achievements
              </motion.p>
            </div>
          </div>
          
          <InteractiveButton
            onClick={() => setShowAddForm(true)}
            variant="accent"
            className="p-3 rounded-full"
          >
            <Plus size={20} />
          </InteractiveButton>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl font-bold text-accent-600">{goals.length}</div>
            <div className="text-xs text-gray-600">Total Goals</div>
          </motion.div>
          
          <motion.div
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </motion.div>
          
          <motion.div
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl font-bold text-primary-600">{overallProgress}%</div>
            <div className="text-xs text-gray-600">Average</div>
          </motion.div>
        </div>
      </motion.div>

      <div className="p-6 space-y-6">
        {/* Overall Progress */}
        <AnimatedCard glowColor="rgba(14, 165, 233, 0.2)">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center space-x-2">
              <TrendingUp className="text-accent-600" size={20} />
              <span>Overall Progress</span>
            </h3>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Award className="text-secondary-500" size={20} />
            </motion.div>
          </div>
          
          <div className="relative mb-4">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-accent-500 to-primary-500 h-4 rounded-full relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
            <motion.span 
              className="absolute right-0 -top-8 text-sm font-bold text-accent-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {overallProgress}% Complete
            </motion.span>
          </div>
        </AnimatedCard>

        {/* Goals List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {goals.map((goal, index) => {
              const categoryData = getCategoryData(goal.category);
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.9 }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.1,
                    type: "spring"
                  }}
                  layout
                >
                  <AnimatedCard 
                    className="relative overflow-hidden"
                    glowColor={`rgba(${goal.progress === 100 ? '34, 197, 94' : '168, 85, 247'}, 0.2)`}
                  >
                    {/* Completion celebration */}
                    {goal.progress === 100 && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <motion.div 
                            className={`w-10 h-10 bg-gradient-to-r ${categoryData.color} rounded-xl flex items-center justify-center text-white shadow-lg`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <span className="text-lg">{categoryData.icon}</span>
                          </motion.div>
                          <div>
                            <h4 className="font-bold text-gray-900">{goal.title}</h4>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              {categoryData.label}
                            </span>
                          </div>
                        </div>
                        
                        {goal.description && (
                          <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                        )}
                        
                        {goal.deadline && (
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                            <Calendar size={12} />
                            <span>Due: {goal.deadline.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <motion.button
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          onClick={() => onDeleteGoal(goal.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Progress section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <div className="flex items-center space-x-2">
                          {goal.progress === 100 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            >
                              <Award className="text-green-500" size={16} />
                            </motion.div>
                          )}
                          <span className="text-sm font-bold text-gray-900">{goal.progress}%</span>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className={`h-3 rounded-full bg-gradient-to-r ${categoryData.color} relative overflow-hidden`}
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                          >
                            {/* Progress shimmer */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity, 
                                ease: "linear",
                                delay: Math.random() * 2
                              }}
                            />
                          </motion.div>
                        </div>
                      </div>
                      
                      {/* Interactive progress slider */}
                      <motion.input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => onUpdateGoal(goal.id, { progress: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        whileHover={{ scale: 1.02 }}
                      />
                    </div>
                  </AnimatedCard>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Empty state */}
          {goals.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Target className="mx-auto text-gray-400 mb-6" size={64} />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ready to achieve greatness?</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Transform your dreams into reality by setting your first goal. Every journey begins with a single step.
              </p>
              <InteractiveButton
                onClick={() => setShowAddForm(true)}
                variant="accent"
                size="lg"
              >
                <Zap size={20} className="mr-2" />
                Create Your First Goal
              </InteractiveButton>
            </motion.div>
          )}
        </div>
      </div>

      {/* Enhanced Add Goal Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center">
                  <Target className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent">
                  Create New Goal
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Goal Title</label>
                  <motion.input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    placeholder="What do you want to achieve?"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <motion.textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                    placeholder="Add more details about your goal..."
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <motion.select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    whileFocus={{ scale: 1.02 }}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </motion.select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Deadline (optional)</label>
                  <motion.input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <InteractiveButton
                    onClick={handleSubmit}
                    variant="accent"
                    className="flex-1"
                  >
                    Create Goal
                  </InteractiveButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}