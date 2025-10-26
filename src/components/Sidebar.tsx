import { Bell, Home, Package, User, Wallet } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  expanded: boolean;
  onToggle: () => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home, description: 'Dashboard & quick booking' },
  { id: 'orders', label: 'Orders', icon: Package, description: 'Track your deliveries' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, description: 'Payments & transactions' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alerts & updates' },
  { id: 'profile', label: 'Profile', icon: User, description: 'Account settings' }
];

export function Sidebar({ activeTab, onTabChange, expanded, onToggle }: SidebarProps) {
  return (
    <motion.div
      initial={{ width: 80 }}
      animate={{ width: expanded ? 256 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full bg-white/95 backdrop-blur-md border-r border-gray-200/50 z-40 hidden md:flex flex-col shadow-sm overflow-hidden"
    >
      {/* Logo/Brand Section */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200/50 min-h-[88px]">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center cursor-pointer shadow-lg flex-shrink-0"
          >
            <span className="text-white font-bold text-xl">S</span>
          </motion.div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="flex flex-col"
              >
                {/*<span className="font-bold text-lg text-gray-900">Spedocity</span>
                <span className="text-xs text-gray-500">Speed. Safety. Spedocity.</span>*/}
              </motion.div>
            )}
          </AnimatePresence>
        </div>


      </div>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col justify-center py-8">
        <nav className="space-y-2 px-4">
          {navItems.map((item, index) => {
            const isActive = activeTab === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <motion.button
                  onClick={() => {
                    onTabChange(item.id);      // change tab
                    if (!expanded) onToggle(); // ✅ auto-expand when collapsed
                  }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative w-full rounded-2xl flex items-center transition-all duration-300 cursor-pointer group ${expanded ? 'p-4 h-16' : 'p-3 h-12 justify-center'
                    } ${isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  {/* Active background */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveBackground"
                      className="absolute inset-0 bg-blue-600 rounded-2xl"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}

                  {/* Hover background */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gray-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}

                  {/* Icon */}
                  <motion.div
                    className="relative z-10 flex-shrink-0"
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />

                    {/* Badges */}
                    {item.id === 'orders' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium shadow-sm"
                      >
                        2
                      </motion.div>
                    )}
                    {item.id === 'notifications' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium shadow-sm"
                      >
                        5
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Label + Description */}
                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                        className="ml-4 flex-1 text-left relative z-10"
                      >
                        <div className={`text-sm  font-medium ${isActive ? 'text-black' : 'text-gray-900'}`}>
                          {item.label}
                        </div>
                        <div className={`text-xs ${isActive ? 'text-gray-200' : 'text-gray-500'}`}>
                          {item.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.button>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-center py-6 border-t border-gray-200/50">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center cursor-pointer group flex-shrink-0"
          >

          </motion.div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-gray-600 cursor-pointer hover:text-gray-900"
              >
                Settings
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative indicator line */}
      <motion.div
        className="absolute right-0 top-0 w-1 bg-blue-600 rounded-l-full"
        animate={{ height: '100%', opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
