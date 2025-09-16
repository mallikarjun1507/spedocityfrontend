import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  AlertTriangle, 
  Share, 
  MapPin,
  Clock,
  User,
  Truck,
  CheckCircle,
  Car
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

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
  { id: 'searching', label: 'Searching Driver', icon: Clock },
  { id: 'assigned', label: 'Driver Assigned', icon: User },
  { id: 'pickup', label: 'Heading to Pickup', icon: MapPin },
  { id: 'in-transit', label: 'In Transit', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle }
];

export function ActiveOrder({ orderId, onBack, onOrderComplete }: ActiveOrderProps) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('searching');
  const [eta, setEta] = useState(15);
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);

  // Simulate order progression
  useEffect(() => {
    const timer = setTimeout(() => {
      switch (currentStatus) {
        case 'searching':
          setCurrentStatus('assigned');
          setDriverInfo({
            name: 'Rajesh Kumar',
            phone: '+91 98765 43210',
            rating: 4.8,
            vehicle: 'Bike',
            vehicleNumber: 'KA 05 MZ 1234',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
          });
          setEta(12);
          break;
        case 'assigned':
          setCurrentStatus('pickup');
          setEta(8);
          break;
        case 'pickup':
          setCurrentStatus('in-transit');
          setEta(25);
          break;
        case 'in-transit':
          setCurrentStatus('delivered');
          setTimeout(() => onOrderComplete(), 2000);
          break;
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentStatus, onOrderComplete]);

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
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-lg">Track Order</h1>
            <p className="text-sm text-gray-500">#{orderId}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Live Map */}
      <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2"
              >
                <Car className="w-6 h-6 text-white" />
              </motion.div>
              <motion.div
                animate={{ scale: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-2 -left-2 w-16 h-16 border-2 border-blue-400 rounded-full opacity-50"
              />
            </div>
            <p className="text-sm text-gray-600">Driver moving towards you</p>
            <p className="text-xs text-gray-500">ETA: {eta} minutes</p>
          </div>
        </motion.div>
      </div>

      {/* Order Status Timeline */}
      <div className="bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg">Order Status</h2>
          <Badge className="bg-blue-100 text-blue-700">
            {statusSteps.find(s => s.id === currentStatus)?.label}
          </Badge>
        </div>

        <div className="mb-4">
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        <div className="space-y-3">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= getCurrentStepIndex();
            const isCurrent = index === getCurrentStepIndex();

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isCurrent 
                    ? 'bg-blue-50 border border-blue-200' 
                    : isCompleted 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCurrent 
                    ? 'bg-blue-600 text-white' 
                    : isCompleted 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-sm ${
                  isCurrent ? 'text-blue-700 font-medium' : 
                  isCompleted ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
                {isCurrent && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-auto"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Driver Info */}
      {driverInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 border-t"
        >
          <h3 className="text-lg mb-4">Your Driver</h3>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                  <img 
                    src={driverInfo.photo} 
                    alt={driverInfo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{driverInfo.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      ⭐ {driverInfo.rating}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{driverInfo.vehicle} • {driverInfo.vehicleNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Bottom Actions */}
      <div className="mt-auto p-6 bg-white border-t">
        <div className="grid grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="flex-1"
            disabled={!driverInfo}
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            disabled={!driverInfo}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            SOS 🚨
          </Button>
        </div>

        <Button 
          variant="outline" 
          className="w-full mt-4 text-gray-600"
          onClick={onBack}
        >
          Cancel Booking
        </Button>
      </div>
    </div>
  );
}