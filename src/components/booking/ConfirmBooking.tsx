import { CheckCircle, Clock, CreditCard, MapPin, Package, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface ConfirmBookingProps {
  bookingData: {
    pickup: string;
    dropoff: string;
    service: string;
    schedule: any;
    helpers: number;
    paymentMethod: string;
    totalAmount: number;
    bookingId: string;
  };
  onComplete: () => void;
}

export function ConfirmBooking({ bookingData, onComplete }: ConfirmBookingProps) {
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

  const getPaymentMethodName = (method: string) => {
    const methodMap: { [key: string]: string } = {
      'upi': 'UPI',
      'wallet': 'Spedocity Wallet',
      'card': 'Credit/Debit Card',
      'cod': 'Cash on Delivery',
      'pay-later': 'Pay Later'
    };
    return methodMap[method] || method;
  };

  const formatSchedule = () => {
    if (bookingData.schedule.type === 'now') {
      return 'Pickup within 15-30 minutes';
    } else {
      const date = new Date(bookingData.schedule.date).toLocaleDateString();
      return `${date} • ${bookingData.schedule.timeSlot}`;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-white text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <CheckCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-xl mb-2">Booking Confirmed!</h1>
          <p className="text-sm opacity-90">Your delivery has been scheduled successfully</p>
        </motion.div>
      </div>

      {/* Booking Details */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Booking ID */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-4 text-center">
              <h2 className="text-lg mb-2">Booking ID</h2>
              <p className="text-2xl text-blue-600 mb-2">#{bookingData.bookingId}</p>
              <p className="text-xs text-gray-600">Save this ID for future reference</p>
            </CardContent>
          </Card>

          {/* Route Details */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <h3 className="text-base mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Route Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <div className="w-0.5 h-6 bg-gray-300 my-1" />
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-xs text-gray-500">Pickup Location</p>
                      <p className="text-sm">{bookingData.pickup}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Drop Location</p>
                      <p className="text-sm">{bookingData.dropoff}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service & Schedule */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <h3 className="text-base mb-4 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Service Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Service Type</span>
                  <Badge className="bg-blue-100 text-blue-700">
                    {getServiceName(bookingData.service)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Schedule</span>
                  <span className="text-sm">{formatSchedule()}</span>
                </div>

                {bookingData.helpers > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Helpers</span>
                    <span className="text-sm">{bookingData.helpers} helper{bookingData.helpers > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <h3 className="text-base mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <span className="text-sm">{getPaymentMethodName(bookingData.paymentMethod)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount Paid</span>
                  <span className="text-lg text-green-600">₹{bookingData.totalAmount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={
                    bookingData.paymentMethod === 'cod'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-green-100 text-green-700'
                  }>
                    {bookingData.paymentMethod === 'cod' ? 'Pay on Delivery' : 'Paid'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="text-base mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                What's Next?
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                {bookingData.schedule.type === 'now' ? (
                  <>
                    <p>🔍 We're finding the nearest delivery partner</p>
                    <p>📱 You'll get a call within 5-10 minutes</p>
                    <p>📍 Track your delivery in real-time</p>
                    <p>🚚 Pickup within 15-30 minutes</p>
                  </>
                ) : (
                  <>
                    <p>⏰ Your delivery is scheduled</p>
                    <p>📱 We'll send reminders before pickup</p>
                    <p>🔍 Partner will be assigned 1 hour before</p>
                    <p>📍 Track your delivery when it starts</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <h3 className="text-base mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Need Help?
              </h3>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="flex-1">
                  Call Support
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Live Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t space-y-3">
        <Button
          variant="outline"
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={onComplete}
        >
          Track Delivery
        </Button>
        <Button
          onClick={onComplete}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Book Another Delivery
        </Button>
      </div>
    </div>
  );
}