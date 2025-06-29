import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  glowColor?: string;
}

export default function AnimatedCard({ 
  children, 
  className = '', 
  hoverScale = 1.02,
  glowColor = 'rgba(168, 85, 247, 0.2)'
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: hoverScale,
        boxShadow: `0 25px 50px ${glowColor}`,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(45deg, 
            ${glowColor}, 
            transparent, 
            ${glowColor})`,
          padding: '1px',
        }}
        animate={isHovered ? {
          background: [
            `linear-gradient(0deg, ${glowColor}, transparent, ${glowColor})`,
            `linear-gradient(90deg, ${glowColor}, transparent, ${glowColor})`,
            `linear-gradient(180deg, ${glowColor}, transparent, ${glowColor})`,
            `linear-gradient(270deg, ${glowColor}, transparent, ${glowColor})`,
            `linear-gradient(360deg, ${glowColor}, transparent, ${glowColor})`,
          ]
        } : {}}
        transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
      >
        <div className="w-full h-full bg-white/80 backdrop-blur-md rounded-2xl" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>

      {/* Sparkle effects */}
      {isHovered && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary-400 rounded-full"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0], 
                opacity: [0, 1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}