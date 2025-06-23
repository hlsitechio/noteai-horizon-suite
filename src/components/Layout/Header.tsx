
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Moon, Sun, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { toggleTheme, isDarkMode } from '@/utils/themeUtils';

const badgeVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
};

const iconVariants = {
  hover: {
    scale: 1.1,
    rotate: 360,
    transition: {
      duration: 0.3
    }
  }
};

const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleThemeToggle = () => {
    const newTheme = toggleTheme(theme);
    setTheme(newTheme);
  };

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have 3 new notifications",
    });
  };

  const handleProfileClick = () => {
    navigate('/settings');
  };

  const handleLogout = () => {
    logout();
  };

  const isCurrentlyDark = isDarkMode(theme);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 md:left-[var(--sidebar-width)]"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <motion.div variants={badgeVariants} animate="animate">
              <Badge variant="secondary" className="bg-green-100/20 backdrop-blur-sm text-green-700 border-0 dark:bg-green-900/30 dark:text-green-300">
                ✨ AI-Powered
              </Badge>
            </motion.div>
            <motion.div 
              variants={badgeVariants} 
              animate="animate"
              transition={{ delay: 0.5 }}
            >
              <Badge variant="outline" className="border-0 bg-blue-100/20 backdrop-blur-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                🚀 Next-Gen
              </Badge>
            </motion.div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationClick}
              className="relative glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, 0, -10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse" as const
                }}
              >
                <Bell className="w-5 h-5" />
              </motion.div>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse" as const
                }}
              >
                <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500 border-0" />
              </motion.div>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              className="glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30"
            >
              <AnimatePresence mode="wait">
                {isCurrentlyDark ? (
                  <motion.div
                    key="sun"
                    variants={iconVariants}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    whileHover="hover"
                  >
                    <Sun className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    variants={iconVariants}
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -180 }}
                    whileHover="hover"
                  >
                    <Moon className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="sr-only">Toggle theme</span>
            </Button>
          </motion.div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-10 rounded-full glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 glass border-0 shadow-large dark:text-slate-200" 
              align="end"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-start gap-2 p-2"
              >
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.name}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </motion.div>
              <DropdownMenuSeparator />
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <DropdownMenuItem 
                  className="hover:bg-white/20 dark:hover:bg-slate-700/30 cursor-pointer"
                  onClick={handleProfileClick}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </motion.div>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <DropdownMenuItem 
                  className="hover:bg-white/20 dark:hover:bg-slate-700/30 cursor-pointer"
                  onClick={handleLogout}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </motion.div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
