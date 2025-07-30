
import React from 'react';
import { motion } from 'framer-motion';
import { RocketLaunchIcon, MagnifyingGlassIcon, CogIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AssistantPowerTools: React.FC = () => {
  const powerTools = [
    { icon: RocketLaunchIcon, label: 'Generate Ideas', badge: 'NEW', badgeColor: 'purple' },
    { icon: MagnifyingGlassIcon, label: 'Research Topic', badge: 'PRO', badgeColor: 'blue' },
    { icon: CogIcon, label: 'Tone Adjustment', badge: 'AI', badgeColor: 'pink' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="glass shadow-large">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
            >
              <SparklesIcon className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h3 className="font-bold text-purple-800 dark:text-purple-300">AI Power Tools</h3>
              <p className="text-xs text-purple-600 dark:text-purple-400">Next-generation features</p>
            </div>
          </div>
          <div className="space-y-3">
            {powerTools.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="outline" size="sm" className="w-full justify-start border-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 dark:bg-slate-600/20 dark:hover:bg-slate-600/30 dark:text-slate-200">
                  <item.icon className={`w-4 h-4 mr-2 ${item.badgeColor === 'purple' ? 'text-purple-600 dark:text-purple-400' : item.badgeColor === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-pink-600 dark:text-pink-400'}`} />
                  {item.label}
                  <Badge className={`ml-auto bg-${item.badgeColor}-100/20 backdrop-blur-sm text-${item.badgeColor}-700 border-0 dark:bg-${item.badgeColor}-900/30 dark:text-${item.badgeColor}-300`}>
                    {item.badge}
                  </Badge>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AssistantPowerTools;
