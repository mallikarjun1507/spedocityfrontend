import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Shield, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

interface FareEstimateProps {
  pickup: string;
  dropoff: string;
  service: string;
  helpers: number;
  onNext: (fareData: FareData) => void;
  onBack: () => void;
}

interface FareData {
  basePrice: number;
  distancePrice: number;
  helperPrice: number;
  insurancePrice: number;
  totalPrice: number;
  hasInsurance: boolean;
  estimatedDistance: number;
  estimatedTime: string;
}

export function FareEstimate({ pickup, dropoff, service, helpers, onNext, onBack }: FareEstimateProps) {
  const [hasInsurance, setHasInsurance] = useState(false);

  // Mock calculations - in real app, this would come from API
  const estimatedDistance = 12.5;
  const estimatedTime = "25-35 mins";
  const basePrice = service === 'bike' ? 49 : service === 'auto' ? 89 : service === 'mini-truck' ? 199 : service === 'packers' ? 999 : 1299;
  const distancePrice = Math.round(estimatedDistance * (service === 'bike' ? 3 : service === 'auto' ? 5 : 8));
  const helperPrice = helpers * 50;
  const insurancePrice = hasInsurance ? Math.round((basePrice + distancePrice) * 0.05) : 0;
  const totalPrice = basePrice + distancePrice + helperPrice + insurancePrice;

  const handleNext = () => {
    onNext({
      basePrice,
      distancePrice,
      helperPrice,
      insurancePrice,
      totalPrice,
      hasInsurance,
      estimatedDistance,
      estimatedTime
    });
  };

  const getServiceName = (serviceId: string) => {
    const serviceMap: { [key: string]: string } = {
      'bike': 'Bike Delivery',
      'auto': 'Auto Rickshaw',
      'mini-truck': 'Mini Truck',
      'packers': 'Packers & Movers',
      'heavy-loader': 'Heavy Loader'
    };
    return serviceMap[serviceId] || serviceId;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg">Fare Estimate</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Route Information */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <h3 className="text-base mb-4">Route Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <div className="w-0.5 h-6 bg-gray-300 my-1" />
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-xs text-gray-500">From</p>
                      <p className="text-sm">{pickup}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">To</p>
                      <p className="text-sm">{dropoff}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="text-sm">{estimatedDistance} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="text-sm">{estimatedTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Service</p>
                    <p className="text-sm">{getServiceName(service)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insurance Option */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <Label htmlFor="insurance" className="text-sm">Delivery Insurance</Label>
                    <p className="text-xs text-gray-600">Protect your items during delivery</p>
                  </div>
                </div>
                <Switch
                  id="insurance"
                  checked={hasInsurance}
                  onCheckedChange={setHasInsurance}
                />
              </div>
              
              {hasInsurance && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="bg-blue-50 rounded-lg p-3 mt-3"
                >
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700">
                      <p className="mb-1">Coverage up to ₹10,000</p>
                      <p>Additional charge: ₹{insurancePrice}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Fare Breakdown */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <h3 className="text-base mb-4">Fare Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Base fare</span>
                  <span className="text-sm">₹{basePrice}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Distance ({estimatedDistance} km)</span>
                  <span className="text-sm">₹{distancePrice}</span>
                </div>
                
                {helpers > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Helper charges ({helpers} helper{helpers > 1 ? 's' : ''})</span>
                    <span className="text-sm">₹{helperPrice}</span>
                  </div>
                )}
                
                {hasInsurance && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Insurance</span>
                    <span className="text-sm">₹{insurancePrice}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-base">Total Amount</span>
                  <span className="text-lg text-green-600">₹{totalPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <h3 className="text-sm mb-2">💡 Important Notes</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Final amount may vary based on actual distance</li>
                <li>• Waiting charges apply after 5 minutes</li>
                <li>• Toll charges (if any) will be added</li>
                <li>• Cancellation free within 2 minutes of booking</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">Estimated Total:</span>
          <span className="text-lg text-green-600">₹{totalPrice}</span>
        </div>
        <Button
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}