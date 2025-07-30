import React, { useState } from 'react';
import { motion } from 'framer-motion';

const navigationItems = [
  { name: 'Dashboard', sectionId: 'dashboard-section' },
  { name: 'Explorer', sectionId: 'explorer-section' },
  { name: 'Editor', sectionId: 'editor-section' },
  { name: 'AI Chat', sectionId: 'ai-chat-section' },
];

const NavigationItems: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav 
      onMouseLeave={() => setHoveredItem(null)}
      className="hidden md:flex items-center space-x-2"
    >
      {navigationItems.map((item) => (
        <motion.button
          key={item.name}
          onMouseEnter={() => setHoveredItem(item.name)}
          onClick={() => scrollToSection(item.sectionId)}
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
        </motion.button>
      ))}
    </nav>
  );
};

export default NavigationItems;