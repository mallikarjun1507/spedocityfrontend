import { Clock, CreditCard, DollarSign, Smartphone, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface PaymentPageProps {
  fareData: {
    totalPrice: number;
    basePrice: number;
    distancePrice: number;
    helperPrice: number;
    insurancePrice: number;
  };
  onNext: (paymentMethod: PaymentMethod) => void;
  onBack: () => void;
}

type PaymentMethod = 'upi' | 'wallet' | 'card' | 'cod' | 'pay-later';

const paymentMethods = [
  {
    id: 'upi' as PaymentMethod,
    name: 'UPI',
    description: 'PhonePe, GPay, Paytm & more',
    icon: Smartphone,
    color: 'bg-green-100 text-green-600',
    recommended: true,
    available: true
  },
  {
    id: 'wallet' as PaymentMethod,
    name: 'Spedocity Wallet',
    description: 'Balance: ₹275',
    icon: Wallet,
    color: 'bg-blue-100 text-blue-600',
    recommended: false,
    available: true
  },
  {
    id: 'card' as PaymentMethod,
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, RuPay',
    icon: CreditCard,
    color: 'bg-purple-100 text-purple-600',
    recommended: false,
    available: true
  },
  {
    id: 'cod' as PaymentMethod,
    name: 'Cash on Delivery',
    description: 'Pay when delivery is completed',
    icon: DollarSign,
    color: 'bg-orange-100 text-orange-600',
    recommended: false,
    available: true
  },
  {
    id: 'pay-later' as PaymentMethod,
    name: 'Pay Later',
    description: 'Pay within 7 days',
    icon: Clock,
    color: 'bg-gray-100 text-gray-600',
    recommended: false,
    available: false // Disabled for demo
  }
];

export function PaymentPage({ fareData, onNext, onBack }: PaymentPageProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);

  const handleNext = () => {
    if (selectedPayment) {
      onNext(selectedPayment);
    }
  };

  const selectPayment = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };

  const getMethodName = (methodId: PaymentMethod) => {
    const method = paymentMethods.find(m => m.id === methodId);
    return method?.name || methodId;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-lg font-medium text-gray-800">Payment</h1>
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
          {/* Amount Summary */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
            <CardContent className="p-4 text-white">
              <div className="text-center">
                <p className="text-sm opacity-90 mb-1">Total Amount</p>
                <p className="text-2xl mb-4">₹{fareData.totalPrice}</p>
                <div className="text-xs opacity-75 space-y-1">
                  <div className="flex justify-between">
                    <span>Base + Distance:</span>
                    <span>₹{fareData.basePrice + fareData.distancePrice}</span>
                  </div>
                  {fareData.helperPrice > 0 && (
                    <div className="flex justify-between">
                      <span>Helper charges:</span>
                      <span>₹{fareData.helperPrice}</span>
                    </div>
                  )}
                  {fareData.insurancePrice > 0 && (
                    <div className="flex justify-between">
                      <span>Insurance:</span>
                      <span>₹{fareData.insurancePrice}</span>
                    </div>
                  )}
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
                  onClick={() => method.available && selectPayment(method.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.color}`}>
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
                            <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs px-2 py-0">
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{method.description}</p>
                      </div>

                      {/* Special offers/info */}
                      {method.id === 'upi' && (
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-700 text-xs px-2 py-1">
                            Instant
                          </Badge>
                        </div>
                      )}

                      {method.id === 'wallet' && fareData.totalPrice > 275 && (
                        <div className="text-right">
                          <p className="text-xs text-red-600">Insufficient balance</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Offers & Coupons */}
          <Card className="border-dashed border-2 border-green-300 bg-green-50">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-sm mb-2">🎉 Special Offers</h3>
                <p className="text-xs text-gray-600 mb-3">Apply coupon code to get discount</p>
                <Button variant="outline" size="sm" className="border-green-400 text-green-700 hover:bg-green-100">
                  Apply Coupon
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Security */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <h3 className="text-sm mb-2">🔒 Secure Payment</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 256-bit SSL encryption</li>
                <li>• PCI DSS compliant</li>
                <li>• No card details stored</li>
                <li>• Refund protection available</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Confirm Payment Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">
            {selectedPayment ? `Pay via ${getMethodName(selectedPayment)}` : 'Select payment method'}
          </span>
          <span className="text-lg text-green-600">₹{fareData.totalPrice}</span>
        </div>
        <Button
          onClick={handleNext}
          disabled={!selectedPayment || (selectedPayment === 'wallet' && fareData.totalPrice > 275)}
          className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          {selectedPayment === 'cod' ? 'Confirm Booking' : `Pay ₹${fareData.totalPrice}`}
        </Button>
      </div>
    </div>
  );
}