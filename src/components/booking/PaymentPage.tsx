import { Clock, CreditCard, DollarSign, Smartphone, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

type PaymentMethod = 'upi' | 'wallet' | 'card' | 'cod' | 'pay-later';

const paymentMethods = [
  {
    id: 'upi' as PaymentMethod,
    name: 'UPI',
    description: 'PhonePe, GPay, Paytm & more',
    icon: Smartphone,
    color: 'bg-green-100 text-green-600',
    recommended: true,
    available: true,
  },
  {
    id: 'wallet' as PaymentMethod,
    name: 'Spedocity Wallet',
    description: 'Balance: ₹275',
    icon: Wallet,
    color: 'bg-blue-100 text-blue-600',
    recommended: false,
    available: true,
  },
  {
    id: 'card' as PaymentMethod,
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, RuPay',
    icon: CreditCard,
    color: 'bg-purple-100 text-purple-600',
    recommended: false,
    available: true,
  },
  {
    id: 'cod' as PaymentMethod,
    name: 'Cash on Delivery',
    description: 'Pay when delivery is completed',
    icon: DollarSign,
    color: 'bg-orange-100 text-orange-600',
    recommended: false,
    available: true,
  },
  {
    id: 'pay-later' as PaymentMethod,
    name: 'Pay Later',
    description: 'Pay within 7 days',
    icon: Clock,
    color: 'bg-gray-100 text-gray-600',
    recommended: false,
    available: false,
  },
];

export function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [fareData, setFareData] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);

  // 🔹 Load fare data (and store coordinates internally)
  useEffect(() => {
    console.log('📦 PaymentPage received state:', location.state);

    const dataFromState = location.state;
    const dataFromStorage = localStorage.getItem('fareData');

    if (dataFromState) {
      console.log('✅ Using fare data from location.state');

      const parsedData = {
        totalPrice: dataFromState.netFare || dataFromState.tripFare || 0,
        pickupLocation: dataFromState.pickupLocation || 'Unknown pickup',
        dropLocation: dataFromState.dropLocation || 'Unknown drop',
        vehicleType: dataFromState.vehicleType || 'N/A',
        vehicleIcon: dataFromState.vehicleIcon || '',
        selectedGoods: dataFromState.selectedGoods || '',
        gstRate: dataFromState.gstRate || 0,
        gstAmount: dataFromState.gstAmount || 0,
        netFare: dataFromState.netFare || 0,
        coins: dataFromState.coins || 0,
        coordinates: {
          pickupLat: dataFromState.pickupCoords?.lat ?? null,
          pickupLng: dataFromState.pickupCoords?.lng ?? null,
          dropLat: dataFromState.dropCoords?.lat ?? null,
          dropLng: dataFromState.dropCoords?.lng ?? null,
        },
      };

      setFareData(parsedData);
      localStorage.setItem('fareData', JSON.stringify(parsedData));
      console.log('💾 Fare data set:', parsedData);
    } else if (dataFromStorage) {
      console.log('📂 Loading fare data from localStorage');
      setFareData(JSON.parse(dataFromStorage));
    } else {
      console.warn('⚠️ No fare data found! Redirecting...');
      navigate('/');
    }
  }, [location.state, navigate]);

  if (!fareData) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading fare details...
      </div>
    );
  }

  const handleNext = () => {
    if (!selectedPayment) {
      console.warn('⚠️ Please select a payment method before proceeding');
      return;
    }

    const bookingId = `BKG${Math.floor(100000 + Math.random() * 900000)}`;

    const bookingData = {
      ...fareData,
      bookingId,
      paymentMethod: selectedPayment,
      totalAmount: fareData.totalPrice,
      pickupLocation: fareData.pickupLocation,
      dropLocation: fareData.dropLocation,
      pickupCoords: {
        lat: fareData.coordinates.pickupLat,
        lng: fareData.coordinates.pickupLng,
      },
      dropCoords: {
        lat: fareData.coordinates.dropLat,
        lng: fareData.coordinates.dropLng,
      },
    };

    console.log('✅ Final Booking Data (hidden coords):', bookingData);
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    navigate('/confirm-booking', { state: bookingData });
  };

  const getMethodName = (methodId: PaymentMethod) => {
    const method = paymentMethods.find((m) => m.id === methodId);
    return method?.name || methodId;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-lg font-medium text-gray-800">Payment</h1>
        </div>

        {/* ✅ Coordinates hidden — only show text addresses */}
        <div className="text-xs text-gray-500 text-center">
          <p>
            <strong>Pickup:</strong> {fareData.pickupLocation}
          </p>
          <p>
            <strong>Drop:</strong> {fareData.dropLocation}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Amount Summary */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
            <CardContent className="p-4 text-white">
              <div className="text-center">
                <p className="text-sm opacity-90 mb-1">Total Amount</p>
                <p className="text-2xl mb-4">₹{fareData.totalPrice}</p>
                <div className="text-xs opacity-75 space-y-1">
                  <div className="flex justify-between">
                    <span>Base Fare:</span>
                    <span>₹{fareData.netFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST ({fareData.gstRate}%):</span>
                    <span>₹{fareData.gstAmount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h2 className="text-lg">Choose Payment Method</h2>
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Card
                  className={`cursor-pointer transition-all ${!method.available
                      ? 'opacity-50 cursor-not-allowed bg-gray-100'
                      : selectedPayment === method.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  onClick={() =>
                    method.available && setSelectedPayment(method.id)
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.color}`}
                      >
                        <method.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm">{method.name}</h3>
                          {method.recommended && (
                            <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0">
                              Recommended
                            </Badge>
                          )}
                          {!method.available && (
                            <Badge className="bg-red-100 text-red-700 text-xs px-2 py-0">
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">
            {selectedPayment
              ? `Pay via ${getMethodName(selectedPayment)}`
              : 'Select payment method'}
          </span>
          <span className="text-lg text-green-600">
            ₹{fareData.totalPrice}
          </span>
        </div>

        <Button
          onClick={handleNext}
          disabled={!selectedPayment}
          className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          {selectedPayment === 'cod'
            ? 'Confirm Booking'
            : `Pay ₹${fareData.totalPrice}`}
        </Button>
      </div>
    </div>
  );
}
