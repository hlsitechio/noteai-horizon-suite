import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollTrailStarsProps {
  mousePosition: { x: number; y: number };
}

interface Star {
  id: number;
  x: number;
  y: number;
  scrollY: number;
  opacity: number;
  size: number;
  color: string;
  timestamp: number;
}

const ScrollTrailStars: React.FC<ScrollTrailStarsProps> = ({ mousePosition }) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const starIdRef = useRef(0);

  const colors = [
    'hsl(200, 80%, 70%)',  // Cyan
    'hsl(280, 80%, 75%)',  // Purple  
    'hsl(320, 80%, 70%)',  // Pink
    'hsl(180, 90%, 65%)',  // Turquoise
    'hsl(240, 85%, 70%)',  // Blue
    'hsl(60, 85%, 75%)',   // Yellow
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      
      // Only create stars if we're actively scrolling
      if (scrollDelta > 5) {
        setIsScrolling(true);
        
        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Create new stars along the scroll path
        const newStars: Star[] = [];
        const starsToCreate = Math.min(Math.floor(scrollDelta / 10), 3);
        
        for (let i = 0; i < starsToCreate; i++) {
          const star: Star = {
            id: starIdRef.current++,
            x: mousePosition.x + (Math.random() - 0.5) * 100,
            y: mousePosition.y + (Math.random() - 0.5) * 100,
            scrollY: currentScrollY,
            opacity: 0.8 + Math.random() * 0.2,
            size: 3 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            timestamp: Date.now()
          };
          newStars.push(star);
        }

        setStars(prevStars => {
          // Add new stars and remove old ones
          const updatedStars = [...prevStars, ...newStars].filter(
            star => Date.now() - star.timestamp < 3000 // Keep stars for 3 seconds
          );
          return updatedStars.slice(-50); // Limit to 50 stars maximum
        });

        setLastScrollY(currentScrollY);

        // Set timeout to stop creating stars
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 100);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Update mouse position for scroll-based star creation
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [mousePosition, lastScrollY]);

  // Clean up old stars periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setStars(prevStars => 
        prevStars.filter(star => Date.now() - star.timestamp < 3000)
      );
    }, 2000); // Increased from 1000ms to 2000ms for better performance

    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute"
            style={{
              left: star.x,
              top: star.y,
            }}
            initial={{ 
              scale: 0, 
              opacity: 0,
              rotate: 0,
              filter: 'blur(2px)'
            }}
            animate={{ 
              scale: [0, 1.5, 1],
              opacity: [0, star.opacity, 0],
              rotate: [0, 180, 360],
              filter: ['blur(2px)', 'blur(0px)', 'blur(1px)'],
              y: [0, -30, -60],
              x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 40]
            }}
            exit={{ 
              scale: 0, 
              opacity: 0,
              filter: 'blur(3px)'
            }}
            transition={{
              duration: 2.5,
              ease: [0.25, 0.46, 0.45, 0.94],
              times: [0, 0.3, 1]
            }}
          >
            {/* Main star shape */}
            <div
              className="relative"
              style={{
                width: star.size * 2,
                height: star.size * 2,
              }}
            >
              {/* Star core */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${star.color}, ${star.color.replace(')', ', 0.3)')}`,
                  boxShadow: `0 0 ${star.size * 3}px ${star.color.replace(')', ', 0.6)')}`,
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  boxShadow: [
                    `0 0 ${star.size * 3}px ${star.color.replace(')', ', 0.6)')}`,
                    `0 0 ${star.size * 6}px ${star.color.replace(')', ', 0.8)')}`,
                    `0 0 ${star.size * 3}px ${star.color.replace(')', ', 0.4)')}`,
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Star points */}
              <div className="absolute inset-0">
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 origin-bottom"
                    style={{
                      width: 1,
                      height: star.size,
                      background: star.color,
                      transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                      filter: `drop-shadow(0 0 2px ${star.color})`,
                    }}
                    animate={{
                      scaleY: [0.5, 1.2, 0.8],
                      opacity: [0.7, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              {/* Sparkle effect */}
              <motion.div
                className="absolute -inset-2"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 h-0.5 rounded-full"
                    style={{
                      background: star.color,
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, -50%) rotate(${i * 120}deg) translateY(-${star.size * 1.5}px)`,
                      filter: `drop-shadow(0 0 1px ${star.color})`,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Scroll indicator trail */}
      {isScrolling && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: mousePosition.x - 2,
            top: mousePosition.y - 2,
            width: 4,
            height: 4,
            background: 'hsl(200, 80%, 70%)',
            boxShadow: '0 0 10px hsl(200, 80%, 70%)',
          }}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Connecting lines between recent stars */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="trail-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(200, 80%, 70%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(280, 80%, 70%)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {stars.slice(-5).map((star, index, array) => {
          if (index === 0) return null;
          const prevStar = array[index - 1];
          const age = (Date.now() - star.timestamp) / 3000;
          const opacity = Math.max(0, 0.4 - age * 0.4);
          
          return (
            <motion.line
              key={`${prevStar.id}-${star.id}`}
              x1={prevStar.x}
              y1={prevStar.y}
              x2={star.x}
              y2={star.y}
              stroke="url(#trail-gradient)"
              strokeWidth="1"
              opacity={opacity}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default ScrollTrailStars;