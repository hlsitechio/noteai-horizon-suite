
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderIcon, FileText, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar';
import { useNotes } from '../../../contexts/NotesContext';
import { useFolders } from '../../../contexts/FoldersContext';
import { useNavigate } from 'react-router-dom';

export function CollapsedSummary() {
  const { state } = useSidebar();
  const { notes } = useNotes();
  const { folders } = useFolders();
  const navigate = useNavigate();
  const isCollapsed = state === 'collapsed';

  const summaryItems = [
    {
      icon: FolderIcon,
      count: folders.length,
      label: 'Folders',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      badgeColor: 'bg-blue-500 text-white text-xs font-semibold',
      onClick: () => navigate('/app/notes')
    },
    {
      icon: FileText,
      count: notes.length,
      label: 'Notes',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      badgeColor: 'bg-emerald-500 text-white text-xs font-semibold',
      onClick: () => navigate('/app/notes')
    }
  ];

  return (
    <AnimatePresence>
      {isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.2 }}
          className="relative px-4 py-6 space-y-6 flex flex-col items-center z-50" // Increased padding and spacing
        >
          {/* Border element */}
          <div 
            className="absolute left-0 top-0 bottom-0 bg-white/20 dark:bg-white/10"
            style={{ width: '6%' }} // Adjusted for wider sidebar
          />
          
          {summaryItems.map((item, index) => (
            item.count > 0 && (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={item.onClick}
                    className={`w-14 h-14 ${item.bgColor} rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:shadow-lg relative z-50`} // Increased size further
                  >
                    <item.icon className={`w-5 h-5 ${item.color} mb-1`} /> {/* Larger icon */}
                    <Badge className={`${item.badgeColor} px-1.5 py-0 min-w-0 h-4 text-[10px] rounded-full absolute -top-1 -right-1 shadow-sm flex items-center justify-center z-60`}>
                      {item.count}
                    </Badge>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.count} {item.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
