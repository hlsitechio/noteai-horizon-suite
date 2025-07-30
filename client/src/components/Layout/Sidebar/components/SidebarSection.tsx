// Unified section component for sidebar
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu
} from '@/components/ui/sidebar';
import { 
  ChevronRight, 
  ChevronDown,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarSectionProps, SidebarListItem } from '../types';
import { SidebarListItem as SidebarListItemComponent } from './SidebarListItem';
import { sidebarAnimations } from '../animations';

export function SidebarSection({
  title,
  items,
  isExpanded,
  onToggle,
  onCreateNew,
  createLabel = 'Add New',
  emptyStateMessage = 'No items yet'
}: SidebarSectionProps) {

  const handleCreateNew = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCreateNew) {
      onCreateNew();
    }
  };

  return (
    <SidebarGroup className="group">
      <div className="flex items-center justify-between px-2">
        <SidebarGroupLabel 
          className="flex items-center cursor-pointer text-xs font-medium text-sidebar-foreground/70 hover:text-accent transition-colors flex-1"
          onClick={onToggle}
        >
          <motion.div
            variants={sidebarAnimations.iconVariants}
            animate={isExpanded ? 'expanded' : 'collapsed'}
            className="mr-1"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </motion.div>
          {title}
        </SidebarGroupLabel>
        
        {onCreateNew && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateNew}
            className="h-6 w-6 p-0 hover:bg-sidebar-accent rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            title={createLabel}
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={sidebarAnimations.sectionVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="overflow-hidden"
          >
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div
                  variants={sidebarAnimations.containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {items.length > 0 ? (
                    items.map((item) => (
                      <SidebarListItemComponent
                        key={item.id}
                        item={item}
                        variant="default"
                      />
                    ))
                  ) : (
                    <motion.div
                      variants={sidebarAnimations.listItemVariants}
                      className="px-2 py-1"
                    >
                      <span className="text-xs text-sidebar-foreground/40">
                        {emptyStateMessage}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              </SidebarMenu>
            </SidebarGroupContent>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarGroup>
  );
}