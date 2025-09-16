import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  ArrowRight, 
  Package, 
  Truck, 
  Bike, 
  Mail,
  Gift,
  Users,
  MapPin,
  Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const serviceCards = [
  {
    id: 'packers',
    title: 'Packers & Movers',
    subtitle: 'Home shifting made easy',
    icon: Package,
    color: 'from-blue-500 to-blue-600',
    price: 'Starting ₹999'
  },
  {
    id: 'mini-truck',
    title: 'Mini Truck',
    subtitle: 'For heavy items',
    icon: Truck,
    color: 'from-green-500 to-green-600',
    price: 'Starting ₹599'
  },
  {
    id: 'bike',
    title: 'Bike Delivery',
    subtitle: 'Quick & affordable',
    icon: Bike,
    color: 'from-orange-500 to-orange-600',
    price: 'Starting ₹49'
  },
  {
    id: 'courier',
    title: 'Courier',
    subtitle: 'Documents & parcels',
    icon: Mail,
    color: 'from-purple-500 to-purple-600',
    price: 'Starting ₹29'
  }
];

const offers = [
  {
    title: 'FIRST50',
    description: '50% off on your first delivery',
    type: 'promo',
    validity: 'Valid till Dec 31'
  },
  {
    title: 'Refer & Earn',
    description: 'Get ₹100 for each friend you refer',
    type: 'referral',
    validity: 'No expiry'
  }
];

interface DashboardProps {
  userName?: string;
  onStartBooking: () => void;
  onTrackOrder?: (orderId: string) => void;
}

export function Dashboard({ userName = "John", onStartBooking, onTrackOrder }: DashboardProps) {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');

  // Mock active orders
  const activeOrders = [
    {
      id: 'SPD002',
      status: 'in-transit',
      pickup: 'Whitefield, Bangalore',
      dropoff: 'Electronic City, Bangalore',
      service: 'Mini Truck',
      eta: '25 mins'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-6 pb-4 shadow-sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl">Hello, {userName}! 👋</h1>
              <p className="text-gray-600 text-sm">Where do you want to deliver today?</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">{userName.charAt(0)}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="space-y-3" onClick={onStartBooking}>
            <div className="relative cursor-pointer">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Pickup location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 cursor-pointer"
                readOnly
              />
            </div>
            
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </div>
            </div>

            <div className="relative cursor-pointer">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-red-400" />
              <Input
                placeholder="Drop location"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 cursor-pointer"
                readOnly
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div className="px-6 pt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-lg mb-4">Active Deliveries</h2>
              <div className="space-y-3">
                {activeOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Truck className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium">#{order.id}</h3>
                              <p className="text-xs text-gray-600">{order.service}</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            Live Tracking
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-500">From</p>
                              <p className="text-sm">{order.pickup}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-500">To</p>
                              <p className="text-sm">{order.dropoff}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-orange-600">ETA: {order.eta}</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 h-7 text-xs"
                            onClick={() => onTrackOrder && onTrackOrder(order.id)}
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            Track
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Quick Services */}
        <div className="px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg mb-4">Quick Services</h2>
            <div className="grid grid-cols-2 gap-4">
              {serviceCards.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Card 
                    className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={onStartBooking}
                  >
                    <CardContent className="p-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-3`}>
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-sm mb-1">{service.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">{service.subtitle}</p>
                      <p className="text-xs text-green-600">{service.price}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Offers Banner */}
        <div className="px-6 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-lg mb-4">Offers & Rewards</h2>
            <div className="space-y-3">
              {offers.map((offer, index) => (
                <Card 
                  key={index}
                  className={`border-0 shadow-sm cursor-pointer ${
                    offer.type === 'promo' 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500' 
                      : 'bg-gradient-to-r from-purple-50 to-violet-50 border-l-4 border-l-purple-500'
                  }`}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        offer.type === 'promo' ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        {offer.type === 'promo' ? (
                          <Gift className={`w-5 h-5 ${offer.type === 'promo' ? 'text-green-600' : 'text-purple-600'}`} />
                        ) : (
                          <Users className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{offer.title}</span>
                          <Badge variant="secondary" className="text-xs px-2 py-0">
                            {offer.type === 'promo' ? 'PROMO' : 'REFERRAL'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{offer.description}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{offer.validity}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="px-6 pb-24 md:pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-lg mb-4">Recent Activity</h2>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-sm mb-2">No recent deliveries</h3>
                <p className="text-xs text-gray-600 mb-4">Start your first delivery to see activity here</p>
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={onStartBooking}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}