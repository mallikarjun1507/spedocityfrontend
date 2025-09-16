import { motion } from 'motion/react';
import { Home, Package, Wallet, Bell, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  {
    id: 'home',
    label: 'Home',
    icon: Home
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: Package
  },
  {
    id: 'wallet',
    label: 'Wallet',
    icon: Wallet
  },
  {
    id: 'notifications',
    label: 'Alerts',
    icon: Bell
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User
  }
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center justify-center py-2 px-3 relative min-w-0 flex-1"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? '#2563eb' : '#6b7280'
                }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </motion.div>
              
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-0.5 left-1/2 w-1 h-1 bg-blue-600 rounded-full"
                  style={{ translateX: '-50%' }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}