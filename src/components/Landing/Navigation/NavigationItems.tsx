import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Explorer', href: '/explorer' },
  { name: 'Editor', href: '/editor' },
  { name: 'AI Chat', href: '/ai-chat' },
];

const NavigationItems: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <nav 
      onMouseLeave={() => setHoveredItem(null)}
      className="hidden md:flex items-center space-x-2"
    >
      {navigationItems.map((item) => (
        <motion.a
          key={item.name}
          href={item.href}
          onMouseEnter={() => setHoveredItem(item.name)}
          onClick={(e) => {
            e.preventDefault();
            navigate(item.href);
          }}
          className="relative px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300 rounded-full"
        >
          {hoveredItem === item.name && (
            <motion.div
              layoutId="active-nav-pill"
              className="absolute inset-0 bg-white/10"
              style={{ borderRadius: 9999 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10 font-medium">{item.name}</span>
        </motion.a>
      ))}
    </nav>
  );
};

export default NavigationItems;