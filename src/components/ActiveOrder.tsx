import {
  AlertTriangle,
  Car,
  CheckCircle,
  Clock,
  Eye,
  MapPin,
  MessageCircle,
  MoreVertical,
  Navigation,
  Package,
  Phone,
  Share,
  Shield,
  Star,
  Timer,
  Truck,
  User
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { AnimatedProgressBar } from './AnimatedProgressBar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface ActiveOrderProps {
  orderId: string;
  onBack: () => void;
  onOrderComplete: () => void;
}

type OrderStatus = 'searching' | 'assigned' | 'pickup' | 'in-transit' | 'delivered';

interface DriverInfo {
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
  vehicleNumber: string;
  photo: string;
}

const statusSteps = [
  { id: 'searching', label: 'Searching', icon: Clock, description: 'Finding nearest driver' },
  { id: 'assigned', label: 'Assigned', icon: User, description: 'Driver confirmed' },
  { id: 'pickup', label: 'Pickup', icon: MapPin, description: 'Heading to you' },
  { id: 'in-transit', label: 'Transit', icon: Truck, description: 'On the way' },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle, description: 'Complete!' }
];

export function ActiveOrder({ orderId, onBack, onOrderComplete }: ActiveOrderProps) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('searching');
  const [eta, setEta] = useState(15);
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [isDriverNearby, setIsDriverNearby] = useState(false);
  const [liveLocation, setLiveLocation] = useState({ lat: 12.9716, lng: 77.5946 });
  const [orderDetails] = useState({
    pickup: 'Whitefield Main Road, Bangalore',
    dropoff: 'Electronic City Phase 1, Bangalore',
    service: 'Bike Delivery',
    distance: '18.5 km',
    estimatedTime: '25 mins',
    fare: '₹89'
  });

  // Simulate order progression and live updates
  useEffect(() => {
    const timer = setTimeout(() => {
      switch (currentStatus) {
        case 'searching':
          setCurrentStatus('assigned');
          setDriverInfo({
            name: 'Rajesh Kumar',
            phone: '+91 98765 43210',
            rating: 4.8,
            vehicle: 'Hero Splendor Plus',
            vehicleNumber: 'KA 05 MZ 1234',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
          });
          setEta(12);
          break;
        case 'assigned':
          setCurrentStatus('pickup');
          setEta(8);
          setIsDriverNearby(true);
          break;
        case 'pickup':
          setCurrentStatus('in-transit');
          setEta(25);
          setIsDriverNearby(false);
          break;
        case 'in-transit':
          setCurrentStatus('delivered');
          setTimeout(() => onOrderComplete(), 2000);
          break;
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentStatus, onOrderComplete]);

  // Simulate live location updates
  useEffect(() => {
    if (driverInfo && currentStatus !== 'delivered') {
      const interval = setInterval(() => {
        setLiveLocation(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.01,
          lng: prev.lng + (Math.random() - 0.5) * 0.01
        }));

        // Simulate ETA updates
        if (eta > 1) {
          setEta(prev => Math.max(1, prev - Math.random() * 2));
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [driverInfo, currentStatus, eta]);

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.id === currentStatus);
  };

  const getProgressPercentage = () => {
    const currentIndex = getCurrentStepIndex();
    return ((currentIndex + 1) / statusSteps.length) * 100;
  };

  const handleShare = () => {
    // Mock sharing functionality
    if (navigator.share) {
      navigator.share({
        title: 'Track my Spedocity delivery',
        text: `Track my order #${orderId}`,
        url: `https://spedocity.com/track/${orderId}`
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`Track my order: https://spedocity.com/track/${orderId}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative overflow-hidden">
      {/* Header - Fixed */}
      <div className="bg-white px-6 py-4 shadow-sm relative z-10">
        <div className="flex items-center justify-between">

          {/* Empty div to balance spacing on left */}
          <div className="w-16" />

          {/* Centered Track Order */}
          <div className="text-center flex-1">
            <h1 className="text-lg font-medium">Track Order</h1>
            <p className="text-sm text-gray-500">#{orderId}</p>
          </div>

          {/* Right action buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share className="w-4 h-4" />
            </Button>
          </div>

        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 scroll-container">
        {/* Live Tracking Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-green-400 rounded-full"
              />
              <span className="text-sm font-medium">Live Tracking Active</span>
            </div>
            <div className="flex items-center gap-1">
              <Timer className="w-4 h-4" />
              <span className="text-sm font-mono">{Math.floor(eta)} min</span>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Live Map */}
        <div className="h-72 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 relative overflow-hidden">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-8 h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-gray-400" />
              ))}
            </div>
          </div>

          {/* Driver Location Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative">
              {/* Pulsing Rings */}
              <motion.div
                animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-4 bg-blue-500 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute -inset-2 bg-blue-400 rounded-full"
              />

              {/* Driver Vehicle */}
              <motion.div
                animate={{
                  rotate: currentStatus === 'in-transit' ? [0, 5, -5, 0] : 0,
                  scale: currentStatus === 'pickup' ? [1, 1.1, 1] : 1
                }}
                transition={{
                  duration: currentStatus === 'in-transit' ? 3 : 2,
                  repeat: Infinity
                }}
                className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
              >
                <Car className="w-7 h-7 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Real-time Info Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-4 left-4 right-4"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium text-gray-900">
                    {currentStatus === 'pickup' ? 'Driver arriving' :
                      currentStatus === 'in-transit' ? 'En route to destination' :
                        'Moving towards you'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">Live</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  Distance: {orderDetails.distance}
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="w-3 h-3 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">
                    ETA {Math.floor(eta)} min
                  </span>
                </div>
              </div>

              {/* Vehicle Number Display */}
              {currentStatus === 'pickup' && driverInfo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-3 pt-3 border-t border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Look for vehicle:</span>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg"
                    >
                      <span className="font-mono text-sm font-bold">{driverInfo.vehicleNumber}</span>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Driver Arriving Alert - Enhanced */}
        <AnimatePresence>
          {isDriverNearby && driverInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white shadow-lg overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, -10, 10, 0]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <Car className="w-5 h-5" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">Driver Arriving!</h3>
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-lg"
                      >
                        🚗
                      </motion.span>
                    </div>
                    <p className="text-sm text-green-100">
                      {driverInfo.vehicle} • <span className="font-mono font-bold bg-white/20 px-2 py-1 rounded">{driverInfo.vehicleNumber}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-1 h-1 bg-white rounded-full" />
                      <span className="text-xs text-green-100">Expected in {Math.floor(eta)} minutes</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 border-white/30"
                    variant="outline"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Watch
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Details Card */}
        <div className="p-6 space-y-6">
          {/* Trip Details */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Trip Details</h3>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {orderDetails.service}
                </Badge>
              </div>

              <div className="space-y-4">
                {/* Pickup */}
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Pickup</p>
                    <p className="text-gray-900">{orderDetails.pickup}</p>
                  </div>
                </div>

                {/* Route Line */}
                <div className="flex items-center gap-3">
                  <div className="w-3 flex flex-col items-center">
                    <div className="w-0.5 h-6 bg-gray-300" />
                  </div>
                  <div className="flex-1 text-xs text-gray-500">
                    {orderDetails.distance} • {orderDetails.estimatedTime}
                  </div>
                </div>

                {/* Dropoff */}
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Dropoff</p>
                    <p className="text-gray-900">{orderDetails.dropoff}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Progress */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Order Progress</h3>
                <div className="flex items-center gap-2">
                  <Badge className={`${currentStatus === 'pickup' ? 'bg-green-100 text-green-700' :
                      currentStatus === 'in-transit' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                    }`}>
                    {statusSteps.find(s => s.id === currentStatus)?.label}
                  </Badge>
                </div>
              </div>

              <AnimatedProgressBar
                steps={statusSteps}
                currentStepIndex={getCurrentStepIndex()}
                className="mb-4"
              />

              {/* Current Status Description */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {statusSteps.find(s => s.id === currentStatus)?.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Driver Info */}
          {driverInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Your Driver</h3>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">Verified</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gray-300 rounded-xl overflow-hidden ring-2 ring-blue-100">
                        <img
                          src={driverInfo.photo}
                          alt={driverInfo.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-xl text-gray-900">{driverInfo.name}</h4>
                        <Badge className="bg-yellow-100 text-yellow-800 px-2 py-1">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          {driverInfo.rating}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{driverInfo.phone}</p>

                      {/* Driver Stats */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-600">2,450+ deliveries</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600">On time: 98%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Vehicle Details */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Vehicle</p>
                            <p className="font-medium text-gray-900">{driverInfo.vehicle}</p>
                          </div>
                          <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                              <p className="font-mono text-sm font-bold tracking-wider">{driverInfo.vehicleNumber}</p>
                            </div>
                          </motion.div>
                        </div>

                        {currentStatus === 'pickup' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center gap-2 mt-3 p-2 bg-blue-100 rounded-lg"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              🚗
                            </motion.div>
                            <p className="text-xs text-blue-700 font-medium">
                              Driver is arriving - Look for this vehicle number
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Enhanced Bottom Actions - Fixed */}
      <div className="bg-white border-t p-6 space-y-4">
        {/* Primary Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 cursor-pointer"
            disabled={!driverInfo}
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-12 cursor-pointer"
            disabled={!driverInfo}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-12 border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            SOS
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="text-gray-600 h-10 cursor-pointer"
            onClick={onBack}
          >
            View Order Details
          </Button>
          <Button
            variant="outline"
            className="text-gray-600 h-10 cursor-pointer"
            onClick={handleShare}
          >
            <Share className="w-4 h-4 mr-2" />
            Share Location
          </Button>
        </div>
      </div>
    </div>
  );
}