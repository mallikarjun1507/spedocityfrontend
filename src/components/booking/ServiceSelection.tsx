import { useState } from 'react';

import { Bike, Car, Package, Truck, TruckIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';


interface ServiceSelectionProps {
  pickup: string;
  dropoff: string;
  onNext: (service: ServiceType) => void;
  onBack: () => void;
}

type ServiceType = 'bike' | 'auto' | 'mini-truck' | 'packers' | 'heavy-loader';

const services = [
  {
    id: 'bike' as ServiceType,
    name: 'Bike Delivery',
    description: 'Quick delivery for small items',
    icon: Bike,
    price: '₹49',
    time: '15-30 mins',
    capacity: 'Up to 5kg',
    color: 'from-orange-500 to-orange-600',
    popular: false
  },
  {
    id: 'auto' as ServiceType,
    name: 'Auto Rickshaw',
    description: 'Medium sized items & groceries',
    icon: Car,
    price: '₹89',
    time: '20-40 mins',
    capacity: 'Up to 25kg',
    color: 'from-green-500 to-green-600',
    popular: true
  },
  {
    id: 'mini-truck' as ServiceType,
    name: 'Mini Truck',
    description: 'Large items & bulk delivery',
    icon: Truck,
    price: '₹199',
    time: '30-60 mins',
    capacity: 'Up to 500kg',
    color: 'from-blue-500 to-blue-600',
    popular: false
  },
  {
    id: 'packers' as ServiceType,
    name: 'Packers & Movers',
    description: 'Complete home shifting',
    icon: Package,
    price: '₹999',
    time: '2-4 hours',
    capacity: 'Household items',
    color: 'from-purple-500 to-purple-600',
    popular: false
  },
  {
    id: 'heavy-loader' as ServiceType,
    name: 'Heavy Loader',
    description: 'Heavy machinery & equipment',
    icon: TruckIcon,
    price: '₹1,299',
    time: '1-2 hours',
    capacity: 'Up to 2000kg',
    color: 'from-red-500 to-red-600',
    popular: false
  }
];

export function ServiceSelection({ pickup, dropoff, onNext }: ServiceSelectionProps) {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

  const handleNext = () => {
    if (selectedService) {
      onNext(selectedService);
    }
  };

  const selectService = (serviceId: ServiceType) => {
    setSelectedService(serviceId);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-lg font-semibold text-gray-800">Select Service</h1>
        </div>

        {/* Route Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div className="w-0.5 h-6 bg-gray-300 my-1" />
              <div className="w-3 h-3 bg-red-500 rounded-full" />
            </div>
            <div className="flex-1 space-y-2">
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
        </div>
      </div>

      {/* Services List */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <Card
                className={`cursor-pointer transition-all ${selectedService === service.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                onClick={() => selectService(service.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center cursor-pointer`}
                    >
                      <service.icon className="w-7 h-7 text-white" />
                    </div>

                    <div className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base">{service.name}</h3>
                        {service.popular && (
                          <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>⏱️ {service.time}</span>
                        <span>📦 {service.capacity}</span>
                      </div>
                    </div>

                    <div className="text-right cursor-pointer">
                      <p className="text-lg text-green-600 mb-1">{service.price}</p>
                      <p className="text-xs text-gray-500">Starting price</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t">
        <Button
          onClick={handleNext}
          disabled={!selectedService}
          className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Continue with{' '}
          {selectedService
            ? services.find((s) => s.id === selectedService)?.name
            : 'Service'}
        </Button>
      </div>
    </div>
  );
}
