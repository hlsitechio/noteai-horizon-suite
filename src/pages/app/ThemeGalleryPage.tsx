import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ThemeGallery from '@/components/ThemeGallery/ThemeGallery';
const ThemeGalleryPage: React.FC = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-background">
      {/* Header */}
      

      {/* Main Content */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.2
    }} className="py-8">
        <ThemeGallery onThemeSelect={themeId => {
        console.log('Theme selected:', themeId);
      }} />
      </motion.div>
    </div>;
};
export default ThemeGalleryPage;