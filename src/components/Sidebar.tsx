import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Package, Wallet, Bell, User, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    description: 'Dashboard & Quick Actions'
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: Package,
    description: 'Track Your Deliveries'
  },
  {
    id: 'wallet',
    label: 'Wallet',
    icon: Wallet,
    description: 'Payments & Balance'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Alerts & Updates'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    description: 'Account Settings'
  }
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Hamburger Menu Button - Always visible */}
      <div className="fixed top-4 left-4 z-50 hidden md:block">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-10 h-10 p-0 bg-white shadow-md hover:bg-gray-50 border border-gray-200"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isExpanded ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </motion.div>
        </Button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 hidden md:block"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 z-50 flex flex-col shadow-2xl hidden md:flex"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Spedocity</h1>
                  <p className="text-sm text-gray-500">Speed. Safety. Spedocity.</p>
                </div>
              </motion.div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 py-6">
              <nav className="space-y-2 px-4">
                {navItems.map((item, index) => {
                  const isActive = activeTab === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: 0.1 + (index * 0.05)
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={() => {
                          onTabChange(item.id);
                          setIsExpanded(false); // Close sidebar after selection
                        }}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                          isActive 
                            ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        
                        {/* Icon */}
                        <motion.div
                          animate={{
                            scale: isActive ? 1.1 : 1,
                            color: isActive ? '#2563eb' : undefined
                          }}
                          transition={{ duration: 0.2 }}
                          className="flex-shrink-0 relative"
                        >
                          <item.icon className="w-6 h-6" />
                          
                          {/* Notification badges */}
                          {item.id === 'orders' && (
                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                              2
                            </div>
                          )}
                          {item.id === 'notifications' && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                              5
                            </div>
                          )}
                        </motion.div>

                        {/* Label and description */}
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-base font-medium truncate">
                            {item.label}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {item.description}
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Bottom section */}
            <div className="p-6 border-t border-gray-200">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4"
              >
                <div className="text-center">
                  <div className="text-base font-medium text-blue-900 mb-1">
                    Get Premium
                  </div>
                  <div className="text-sm text-blue-700 mb-3">
                    Unlock exclusive features
                  </div>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Upgrade Now
                  </Button>
                </div>
              </motion.div>

              {/* Version info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="text-center text-sm text-gray-400 mt-4"
              >
                Spedocity v1.0.0
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}