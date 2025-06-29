import { motion } from 'framer-motion';
import { Sparkles, Star, Zap, Crown, Heart, Target } from 'lucide-react';

const floatingIcons = [
  { Icon: Sparkles, color: 'text-primary-400', delay: 0 },
  { Icon: Star, color: 'text-secondary-400', delay: 0.5 },
  { Icon: Zap, color: 'text-accent-400', delay: 1 },
  { Icon: Crown, color: 'text-secondary-500', delay: 1.5 },
  { Icon: Heart, color: 'text-red-400', delay: 2 },
  { Icon: Target, color: 'text-green-400', delay: 2.5 },
];

export default function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {floatingIcons.map(({ Icon, color, delay }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color} opacity-20`}
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            rotate: 0,
            scale: 0.5
          }}
          animate={{
            y: -50,
            rotate: 360,
            scale: [0.5, 1, 0.5],
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: delay + Math.random() * 5,
            ease: "linear"
          }}
        >
          <Icon size={24 + Math.random() * 16} />
        </motion.div>
      ))}
    </div>
  );
}