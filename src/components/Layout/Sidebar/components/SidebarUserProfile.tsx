// Unified user profile component for sidebar
import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileData } from '../types';
import { sidebarAnimations } from '../animations';

interface SidebarUserProfileProps {
  variant?: 'full' | 'compact' | 'minimal';
  showRole?: boolean;
  showStatus?: boolean;
  className?: string;
  onClick?: () => void;
}

export function SidebarUserProfile({ 
  variant = 'full',
  showRole = false,
  showStatus = false,
  className = '',
  onClick
}: SidebarUserProfileProps) {
  const { user } = useAuth();

  if (!user) return null;

  const profileData: UserProfileData = {
    id: user.id || '',
    name: user.name || '',
    email: user.email || '',
    avatar: user.avatar || '',
    role: 'user' // Default role since it's not available in user object
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const getAvatarSize = () => {
    switch (variant) {
      case 'minimal':
        return 'w-8 h-8';
      case 'compact':
        return 'w-10 h-10';
      case 'full':
      default:
        return 'w-12 h-12';
    }
  };

  const renderFullProfile = () => (
    <motion.div
      className={`flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-accent/50 transition-colors cursor-pointer ${className}`}
      onClick={handleClick}
      variants={sidebarAnimations.buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
      <Avatar className={getAvatarSize()}>
        <AvatarImage src={profileData.avatar} alt={profileData.name || profileData.email} />
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
          {(profileData.name || profileData.email)[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        {profileData.name && (
          <p className="font-semibold text-sm text-sidebar-foreground truncate">
            {profileData.name}
          </p>
        )}
        <p className="text-xs text-sidebar-foreground/70 truncate">
          {profileData.email}
        </p>
        {showRole && profileData.role && (
          <Badge variant="secondary" className="mt-1 text-xs">
            {profileData.role}
          </Badge>
        )}
      </div>
      
      {showStatus && (
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      )}
    </motion.div>
  );

  const renderCompactProfile = () => (
    <motion.div
      className={`flex items-center gap-2 p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors cursor-pointer ${className}`}
      onClick={handleClick}
      variants={sidebarAnimations.buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
      <Avatar className={getAvatarSize()}>
        <AvatarImage src={profileData.avatar} alt={profileData.name || profileData.email} />
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
          {(profileData.name || profileData.email)[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-xs text-sidebar-foreground truncate">
          {profileData.name || profileData.email}
        </p>
        {showRole && profileData.role && (
          <p className="text-xs text-sidebar-foreground/60">
            {profileData.role}
          </p>
        )}
      </div>
    </motion.div>
  );

  const renderMinimalProfile = () => (
    <motion.div
      className={`flex items-center justify-center p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors cursor-pointer ${className}`}
      onClick={handleClick}
      variants={sidebarAnimations.buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
      <Avatar className={getAvatarSize()}>
        <AvatarImage src={profileData.avatar} alt={profileData.name || profileData.email} />
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
          {(profileData.name || profileData.email)[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {showStatus && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>
      )}
    </motion.div>
  );

  switch (variant) {
    case 'minimal':
      return renderMinimalProfile();
    case 'compact':
      return renderCompactProfile();
    case 'full':
    default:
      return renderFullProfile();
  }
}