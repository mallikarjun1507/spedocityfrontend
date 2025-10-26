import { Clock, CreditCard, DollarSign, Smartphone, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useLocation, useNavigate } from 'react-router-dom';

type PaymentMethod = 'upi' | 'wallet' | 'card' | 'cod' | 'pay-later';

const paymentMethods = [
  { id: 'upi' as PaymentMethod, name: 'UPI', description: 'PhonePe, GPay, Paytm & more', icon: Smartphone, color: 'bg-green-100 text-green-600', recommended: true, available: true },
  { id: 'wallet' as PaymentMethod, name: 'Spedocity Wallet', description: 'Balance: ₹275', icon: Wallet, color: 'bg-blue-100 text-blue-600', recommended: false, available: true },
  { id: 'card' as PaymentMethod, name: 'Credit/Debit Card', description: 'Visa, Mastercard, RuPay', icon: CreditCard, color: 'bg-purple-100 text-purple-600', recommended: false, available: true },
  { id: 'cod' as PaymentMethod, name: 'Cash on Delivery', description: 'Pay when delivery is completed', icon: DollarSign, color: 'bg-orange-100 text-orange-600', recommended: false, available: true },
  { id: 'pay-later' as PaymentMethod, name: 'Pay Later', description: 'Pay within 7 days', icon: Clock, color: 'bg-gray-100 text-gray-600', recommended: false, available: false }
];

export function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [fareData, setFareData] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);

  // Load fareData safely
  useEffect(() => {
    const dataFromState = location.state; // fare + booking data from previous page
    const dataFromStorage = localStorage.getItem('fareData');
    if (dataFromState) {
      setFareData(dataFromState);
    } else if (dataFromStorage) {
      setFareData(JSON.parse(dataFromStorage));
    } else {
      navigate('/'); // redirect if no data
    }
  }, [location.state, navigate]);

  if (!fareData) {
    return <div className="p-6 text-center text-gray-500">Loading fare data...</div>;
  }

  // Generate a unique booking ID
  const generateBookingId = () => 'BK' + Date.now().toString();

 const handleNext = () => {
  if (!selectedPayment) return;

  // Generate a booking ID
  const bookingId = `BKG${Math.floor(100000 + Math.random() * 900000)}`;

  // Prepare booking data
  const bookingData = {
    ...fareData, // existing fare, pickup, drop, service, helpers, schedule
    paymentMethod: selectedPayment,
    totalAmount: fareData.totalPrice, // ensure this is passed
    bookingId
  };

  // Store in localStorage if needed
  localStorage.setItem('bookingData', JSON.stringify(bookingData));

  // Navigate to ConfirmBooking with bookingData
  navigate('/confirm-booking', { state: bookingData });
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
      <div className="flex-1 overflow-y-auto p-6 pb-40">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
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
              <motion.div key={method.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 * index }}>
                <Card
                  className={`cursor-pointer transition-all ${!method.available ? 'opacity-50 cursor-not-allowed bg-gray-100' : selectedPayment === method.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}
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
                          {method.recommended && <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0">Recommended</Badge>}
                          {!method.available && <Badge className="bg-red-100 text-red-700 text-xs px-2 py-0">Coming Soon</Badge>}
                        </div>
                        <p className="text-xs text-gray-600">{method.description}</p>
                      </div>
                      {method.id === 'upi' && <div className="text-right"><Badge className="bg-green-100 text-green-700 text-xs px-2 py-1">Instant</Badge></div>}
                      {method.id === 'wallet' && fareData.totalPrice > 275 && <div className="text-right"><p className="text-xs text-red-600">Insufficient balance</p></div>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Confirm Payment Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">{selectedPayment ? `Pay via ${getMethodName(selectedPayment)}` : 'Select payment method'}</span>
          <span className="text-lg text-green-600">₹{fareData.totalPrice}</span>
        </div>
        
        <Button
          onClick={handleNext}
          disabled={!selectedPayment || (selectedPayment === 'wallet' && fareData.totalPrice > 275)}
          className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
            style={{
            width: "100%",
            padding: "12px",
            background: "#3b82f6", // blue color
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {selectedPayment === 'cod' ? 'Confirm Booking' : `Pay ₹${fareData.totalPrice}`}
        </Button>
      </div>
    </div>
  );
}
