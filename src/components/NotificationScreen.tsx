import {
  AlertCircle,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Gift,
  Info,
  Package,
  Settings,
  Trash2,
  Truck
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Switch } from './ui/switch';

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'payment';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: any;
  color: string;
  actionRequired?: boolean;
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Delivered Successfully',
    message: 'Your order #SPD001 has been delivered to Electronic City, Bangalore. Rate your experience!',
    time: '2 minutes ago',
    isRead: false,
    icon: CheckCircle2,
    color: 'text-green-600 bg-green-100',
    actionRequired: true
  },
  {
    id: '2',
    type: 'order',
    title: 'Driver Assigned',
    message: 'Rajesh Kumar is on the way to pickup your items. ETA: 15 minutes.',
    time: '1 hour ago',
    isRead: false,
    icon: Truck,
    color: 'text-blue-600 bg-blue-100',
    actionRequired: false
  },
  {
    id: '3',
    type: 'promotion',
    title: 'Special Offer - 50% Off',
    message: 'Get 50% off on your next delivery! Use code SAVE50. Valid till tomorrow.',
    time: '3 hours ago',
    isRead: true,
    icon: Gift,
    color: 'text-purple-600 bg-purple-100',
    actionRequired: false
  },
  {
    id: '4',
    type: 'payment',
    title: 'Payment Successful',
    message: '₹150 has been charged to your UPI account for order #SPD001.',
    time: '5 hours ago',
    isRead: true,
    icon: CreditCard,
    color: 'text-emerald-600 bg-emerald-100',
    actionRequired: false
  },
  {
    id: '5',
    type: 'system',
    title: 'App Update Available',
    message: 'Spedocity v1.1.0 is now available with new features and bug fixes.',
    time: '1 day ago',
    isRead: false,
    icon: Info,
    color: 'text-orange-600 bg-orange-100',
    actionRequired: false
  },
  {
    id: '6',
    type: 'order',
    title: 'Booking Confirmed',
    message: 'Your delivery is scheduled for today 3:00 PM - 5:00 PM. Track your order anytime.',
    time: '1 day ago',
    isRead: true,
    icon: Package,
    color: 'text-blue-600 bg-blue-100',
    actionRequired: false
  },
  {
    id: '7',
    type: 'system',
    title: 'Service Area Expanded',
    message: 'We now deliver to HSR Layout and Koramangala! Book your next delivery.',
    time: '2 days ago',
    isRead: true,
    icon: AlertCircle,
    color: 'text-indigo-600 bg-indigo-100',
    actionRequired: false
  },
  {
    id: '8',
    type: 'promotion',
    title: 'Refer & Earn ₹100',
    message: 'Invite your friends and earn ₹100 wallet credit for each successful referral.',
    time: '3 days ago',
    isRead: true,
    icon: Gift,
    color: 'text-purple-600 bg-purple-100',
    actionRequired: false
  }
];

const notificationSettings = [
  {
    id: 'order_updates',
    title: 'Order Updates',
    description: 'Get notified about your order status',
    enabled: true
  },
  {
    id: 'promotions',
    title: 'Promotions & Offers',
    description: 'Receive updates about deals and offers',
    enabled: true
  },
  {
    id: 'payment_alerts',
    title: 'Payment Alerts',
    description: 'Get notified about payment transactions',
    enabled: true
  },
  {
    id: 'app_updates',
    title: 'App Updates',
    description: 'Stay informed about new features',
    enabled: false
  }
];

export function NotificationScreen() {
  const [notificationList, setNotificationList] = useState(notifications);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'order' | 'promotion' | 'system' | 'payment'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(notificationSettings);

  const unreadCount = notificationList.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotificationList(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotificationList(prev => prev.filter(notification => notification.id !== id));
  };

  const toggleSetting = (id: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const filteredNotifications = notificationList.filter(notification => {
    switch (activeFilter) {
      case 'unread':
        return !notification.isRead;
      case 'order':
      case 'promotion':
      case 'system':
      case 'payment':
        return notification.type === activeFilter;
      default:
        return true;
    }
  });

  const filterOptions = [
    { key: 'all', label: 'All', count: notificationList.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'order', label: 'Orders', count: notificationList.filter(n => n.type === 'order').length },
    { key: 'promotion', label: 'Offers', count: notificationList.filter(n => n.type === 'promotion').length },
    { key: 'system', label: 'System', count: notificationList.filter(n => n.type === 'system').length },
    { key: 'payment', label: 'Payment', count: notificationList.filter(n => n.type === 'payment').length }
  ];

  if (showSettings) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Settings Header */}
        <div className="bg-white px-6 pt-6 pb-4 shadow-sm flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4 ">
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}   className="cursor-pointer" >
                <ChevronDown className="w-4 h-4 mr-2 rotate-90" />
                Back
              </Button>
              <h1 className="text-xl">Notification Settings</h1>
              <div className="w-16" />
            </div>
            <p className="text-gray-600 text-sm">Manage your notification preferences</p>
          </motion.div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {settings.map((setting, index) => (
              <motion.div
                key={setting.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm mb-1">{setting.title}</h3>
                        <p className="text-xs text-gray-600">{setting.description}</p>
                      </div>
                      <Switch
                        checked={setting.enabled}
                        onCheckedChange={() => toggleSetting(setting.id)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Push Notification Info */}
            <Card className="bg-blue-50 border-blue-200 mt-6">
              <CardContent className="p-4">
                <h3 className="text-sm mb-2">📱 Push Notifications</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Make sure to enable push notifications in your device settings to receive real-time updates.
                </p>
                <Button variant="outline" size="sm" className="text-xs cursor-pointer">
                  Open Device Settings
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-6 pb-4 shadow-sm flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl mb-1">Notifications</h1>
              <p className="text-gray-600 text-sm">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className='cursor-pointer'  onClick={markAllAsRead}>
                  <Check className="w-4 h-4 mr-2 " />
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}   className="cursor-pointer">
                <Settings className="w-4 h-4 " />
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterOptions.map((filter) => (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeFilter === filter.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                onClick={() => setActiveFilter(filter.key as any)}
              >
                {filter.label}
                {filter.count > 0 && (
                  <Badge
                    variant="secondary"
                    className={`text-xs px-1.5 py-0 cursor-pointer ${activeFilter === filter.key
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-600'
                      }`}
                  >
                    {filter.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg mb-2">No notifications</h3>
            <p className="text-gray-600 text-center text-sm">
              {activeFilter === 'unread'
                ? 'All notifications have been read'
                : 'You\'ll see notifications here when they arrive'
              }
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-3 pb-24 md:pb-6">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${!notification.isRead
                      ? 'bg-blue-50 border-blue-200 shadow-sm'
                      : 'bg-white border-gray-200'
                    }`}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Notification Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.color}`}>
                        <notification.icon className="w-5 h-5" />
                      </div>

                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className={`text-sm ${!notification.isRead ? 'font-medium' : ''}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2 ml-2">
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3 cursor-pointer" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          {notification.actionRequired && (
                            <Badge className="bg-orange-100 text-orange-700 text-xs">
                              Action Required
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}