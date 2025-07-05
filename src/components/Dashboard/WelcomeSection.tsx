import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const WelcomeSection: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get user name safely
  const getUserFirstName = () => {
    if (!user?.name) return 'User';
    return user.name.split(' ')[0] || 'User';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <motion.div
      className="flex items-center justify-between px-4 py-3 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 shadow-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Welcome back, {getUserFirstName()}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {formatDate(currentTime)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 text-right">
        <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Current time</span>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-foreground tabular-nums">
            {formatTime(currentTime)}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {currentTime.getHours() >= 12 ? 'PM' : 'AM'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeSection;