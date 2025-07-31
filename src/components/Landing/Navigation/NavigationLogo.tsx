import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const NavigationLogo: React.FC = () => {
  const navigate = useNavigate();
  return <motion.div initial={{
    opacity: 0,
    x: -20
  }} animate={{
    opacity: 1,
    x: 0
  }} className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
      
      <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
        OnlineNote AI
      </span>
    </motion.div>;
};
export default NavigationLogo;