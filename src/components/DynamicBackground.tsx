import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function DynamicBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(168, 85, 247, 0.3) 0%, 
            rgba(245, 158, 11, 0.2) 25%, 
            rgba(14, 165, 233, 0.1) 50%, 
            transparent 70%)`
        }}
        animate={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(168, 85, 247, 0.4) 0%, 
            rgba(245, 158, 11, 0.3) 25%, 
            rgba(14, 165, 233, 0.2) 50%, 
            transparent 70%)`
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Floating orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-xl"
          style={{
            width: 200 + Math.random() * 300,
            height: 200 + Math.random() * 300,
            background: `linear-gradient(45deg, 
              ${i % 3 === 0 ? 'rgba(168, 85, 247, 0.1)' : 
                i % 3 === 1 ? 'rgba(245, 158, 11, 0.1)' : 
                'rgba(14, 165, 233, 0.1)'} 0%, 
              transparent 70%)`,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2,
          }}
        />
      ))}
    </div>
  );
}