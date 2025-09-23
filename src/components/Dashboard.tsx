import {
  ArrowRight,
  Bike,
  Clock,
  Gift,
  Mail,
  MapPin,
  Package,
  Plus,
  Truck,
  Users,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { LocationPicker } from './LocationPicker';
import { TruckAnimation } from './TruckAnimation';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
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
  onStartBooking: (data?: {
    pickup?: string;
    dropoff?: string;
    viaLocations?: Array<{ id: string, title: string, address: string }>;
  }) => void;
  onTrackOrder?: (orderId: string) => void;
  currentOrderId?: string;
}

export function Dashboard({ onStartBooking, onTrackOrder, currentOrderId }: DashboardProps) {
  const userData = useMemo(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : {};
  }, [])
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [viaLocations, setViaLocations] = useState<Array<{ id: string, title: string, address: string }>>([]);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [locationPickerType, setLocationPickerType] = useState<'pickup' | 'dropoff' | 'via'>('pickup');
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [orderOTP, setOrderOTP] = useState<string>('');
  const navigate = useNavigate();

  // Generate pickup OTP for active orders (stable across renders)
  const generatePickupOTP = () => {
    if (!orderOTP && currentOrderId) {
      const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
      setOrderOTP(newOTP);
      return newOTP;
    }
    return orderOTP;
  };

  // Mock active orders
  const activeOrders = currentOrderId ? [
    {
      id: currentOrderId,
      status: 'in-transit',
      pickup: 'Whitefield, Bangalore',
      dropoff: 'Electronic City, Bangalore',
      service: 'Mini Truck',
      eta: '25 mins',
      pickupOTP: generatePickupOTP()
    }
  ] : [];

  const handleLocationPicker = (type: 'pickup' | 'dropoff' | 'via') => {
    setLocationPickerType(type);
    setLocationPickerOpen(true);
  };

  const handleLocationSelect = (location: any) => {
    if (locationPickerType === 'pickup') {
      setPickup(location.title);
    } else if (locationPickerType === 'dropoff') {
      setDropoff(location.title);
    } else if (locationPickerType === 'via') {
      setViaLocations(prev => [...prev, {
        id: Date.now().toString(),
        title: location.title,
        address: location.address
      }]);
    }
    // Close the location picker after selection
    setLocationPickerOpen(false);
  };

  const removeViaLocation = (id: string) => {
    setViaLocations(prev => prev.filter(loc => loc.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white px-6 pt-6 pb-4 shadow-sm">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl">Hello, {userData?.name}! 👋</h1>
              <p className="text-gray-600 text-sm">Where do you want to deliver today?</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">
                {userData?.name ? userData.name.charAt(0) : "U"}
              </span>

            </div>
          </div>

          {/* Search Bar */}
          <div className="space-y-3">
            {/* Pickup Location */}
            <div
              className="relative cursor-pointer"
              onClick={() => handleLocationPicker('pickup')}
            >
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-green-500" />
              <Input
                placeholder="Pickup location"
                value={pickup}
                className="pl-10 bg-gray-50 border-gray-200 cursor-pointer"
                readOnly
              />
            </div>

            {/* Via Locations */}
            {viaLocations.map((viaLocation, index) => (
              <motion.div
                key={viaLocation.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative"
              >
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-orange-500" />
                    <Input
                      value={viaLocation.title}
                      className="pl-10 pr-10 bg-orange-50 border-orange-200"
                      readOnly
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 w-6 h-6 p-0 hover:bg-red-100"
                      onClick={() => removeViaLocation(viaLocation.id)}
                    >
                      <X className="w-3 h-3 text-gray-500" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add Via Location Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 cursor-pointer"
              onClick={() => handleLocationPicker('via')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add via location (optional)
            </Button>

            <div className="flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </div>
            </div>

            {/* Drop Location */}
            <div
              className="relative cursor-pointer"
              onClick={() => handleLocationPicker('dropoff')}
            >
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-red-500" />
              <Input
                placeholder="Drop location"
                value={dropoff}
                className="pl-10 bg-gray-50 border-gray-200 cursor-pointer"
                readOnly
              />
            </div>

            {/* Book Now Button */}
            {(pickup && dropoff) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-4 group relative overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onStartBooking({
                      pickup,
                      dropoff,
                      viaLocations
                    });
                    navigate("/services");
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="relative z-10 flex items-center justify-center">
                    <TruckAnimation
                      serviceType="mini-truck"
                      isHovered={true}
                      size="sm"
                    />
                    <span className="ml-2">Book Now</span>
                  </div>
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Pickup OTP Display */}
      {currentOrderId && activeOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Pickup Confirmation OTP</p>
                <p className="text-green-100 text-xs">Share this with delivery partner</p>
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2"
            >
              <p className="text-white font-mono text-xl font-bold tracking-wider">
                {activeOrders[0].pickupOTP}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 scroll-container">
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
                    className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => onStartBooking()}
                    onMouseEnter={() => setHoveredService(service.id)}
                    onMouseLeave={() => setHoveredService(null)}
                  >
                    <CardContent className="p-4">
                      <motion.div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-3 relative overflow-hidden`}
                        animate={{
                          scale: hoveredService === service.id ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <TruckAnimation
                          serviceType={service.id as 'packers' | 'mini-truck' | 'bike' | 'courier'}
                          isHovered={hoveredService === service.id}
                          size="md"
                        />
                      </motion.div>
                      <h3 className="text-sm mb-1">{service.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">{service.subtitle}</p>
                      <motion.p
                        className="text-xs text-green-600"
                        animate={{
                          scale: hoveredService === service.id ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {service.price}
                      </motion.p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Premium Services Ad */}
        <div className="px-6 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 shadow-lg cursor-pointer overflow-hidden">
              <CardContent className="p-4 relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-xs">⭐</span>
                        </div>
                        <Badge className="bg-white/20 text-white text-xs border-0">
                          PREMIUM
                        </Badge>
                      </div>
                      <h3 className="text-white text-sm mb-1">Enterprise Delivery</h3>
                      <p className="text-white/90 text-xs mb-2">24/7 priority support & tracking</p>
                      <p className="text-yellow-300 text-xs">Starting ₹299</p>
                    </div>
                    <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                  className={`border-0 shadow-sm cursor-pointer ${offer.type === 'promo'
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500'
                    : 'bg-gradient-to-r from-purple-50 to-violet-50 border-l-4 border-l-purple-500'
                    }`}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${offer.type === 'promo' ? 'bg-green-100' : 'bg-purple-100'
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

              {/* Sponsored Offer Ad */}
              <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-l-orange-500 border-0 shadow-sm cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 text-sm">🎯</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">FlashSale Weekend</span>
                        <Badge className="bg-orange-500 text-white text-xs px-2 py-0 border-0">
                          SPONSORED
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">70% off on electronic deliveries</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">Valid this weekend only</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </CardContent>
              </Card>
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
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  onClick={() => onStartBooking()}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Location Picker Modal */}
      <LocationPicker
        isOpen={locationPickerOpen}
        onClose={() => setLocationPickerOpen(false)}
        onLocationSelect={handleLocationSelect}
        title={
          locationPickerType === 'pickup' ? 'Select Pickup Location' :
            locationPickerType === 'dropoff' ? 'Select Drop Location' :
              'Add Via Location'
        }
        placeholder={
          locationPickerType === 'pickup' ? 'Search pickup location...' :
            locationPickerType === 'dropoff' ? 'Search drop location...' :
              'Search via location...'
        }
        type={locationPickerType}
      />
    </div>
  );
}