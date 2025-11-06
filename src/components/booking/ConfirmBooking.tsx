import { CheckCircle, Clock, CreditCard, MapPin, Package, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export function ConfirmBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  console.log(' Navigation started to ConfirmBooking page');
  console.log(' Raw location.state:', location.state);

  // Retrieve booking data safely (from router state or localStorage)
  const bookingData =
    location.state || JSON.parse(localStorage.getItem('bookingData') || 'null');

  console.log(' Booking data loaded:', bookingData);

  useEffect(() => {
    if (!bookingData) {
      console.warn(' No booking data found! Redirecting to home...');
      navigate('/');
    } else {
      console.log(' Booking data found. Ready to render confirmation.');
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading booking details...
      </div>
    );
  }

  // Helper functions
  const getServiceName = (serviceId: string) => {
    const serviceMap: { [key: string]: string } = {
      'bike': 'Bike Delivery',
      'auto': 'Auto Rickshaw',
      'mini-truck': 'Mini Truck',
      'packers': 'Packers & Movers',
      'heavy-loader': 'Heavy Loader',
    };
    const name = serviceMap[serviceId] || serviceId;
    console.log(' Service selected:', name);
    return name;
  };

  const getPaymentMethodName = (method: string) => {
    const methodMap: { [key: string]: string } = {
      'upi': 'UPI',
      'wallet': 'Spedocity Wallet',
      'card': 'Credit/Debit Card',
      'cod': 'Cash on Delivery',
      'pay-later': 'Pay Later',
    };
    const methodName = methodMap[method] || method;
    console.log(' Payment method:', methodName);
    return methodName;
  };

  const formatSchedule = () => {
    console.log(' Formatting schedule data:', bookingData.schedule);
    if (bookingData.schedule?.type === 'now') {
      return 'Pickup within 15–30 minutes';
    } else if (bookingData.schedule?.date) {
      const date = new Date(bookingData.schedule.date).toLocaleDateString();
      return `${date} • ${bookingData.schedule.timeSlot}`;
    }
    return 'Schedule not available';
  };

  const handleTrackDelivery = () => {
    console.log('Navigating to ActiveOrder with booking data:', bookingData);

    // ✅ Extract coordinates (from new top-level fields)
    const pickupCoords = bookingData?.pickupCoords || bookingData?.coordinates?.pickup || null;
    const dropCoords = bookingData?.dropCoords || bookingData?.coordinates?.drop || null;

    console.log('Passing coords to ActiveOrder:', { pickupCoords, dropCoords });

    // ✅ Pass all bookingData + coords to ActiveOrder
    navigate('/active-order', {
      state: {
        bookingData: {
          ...bookingData,
          pickupCoords,
          dropCoords,
        },
      },
    });
  };



  const handleBookAnother = () => {
    console.log(' Booking another delivery...');
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-white text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <CheckCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-xl mb-2">Booking Confirmed!</h1>
          <p className="text-sm opacity-90">
            Your delivery has been scheduled successfully
          </p>
        </motion.div>
      </div>

      {/* Booking Details */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-40 space-y-6">
        {/* Booking ID */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4 text-center">
            <h2 className="text-lg mb-2">Booking ID</h2>
            <p className="text-2xl text-blue-600 mb-2">#{bookingData.bookingId}</p>
            <p className="text-xs text-gray-600">
              Save this ID for future reference
            </p>
          </CardContent>
        </Card>

        {/* Route Details */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <h3 className="text-base mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Route Details
            </h3>
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center pt-1">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <div className="w-0.5 h-6 bg-gray-300 my-1" />
                <div className="w-3 h-3 bg-red-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-xs text-gray-500">Pickup Location</p>
                  <p className="text-sm">
                    {bookingData.pickup || bookingData.pickupLocation || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Drop Location</p>
                  <p className="text-sm">
                    {bookingData.dropoff || bookingData.dropLocation || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service & Schedule */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <h3 className="text-base mb-4 flex items-center gap-2">
              <Package className="w-4 h-4" /> Service Details
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
                  <span className="text-sm">
                    {bookingData.helpers}{' '}
                    {bookingData.helpers > 1 ? 'helpers' : 'helper'}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <h3 className="text-base mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Payment Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment Method</span>
                <span className="text-sm">
                  {getPaymentMethodName(bookingData.paymentMethod)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Amount Paid</span>
                <span className="text-lg text-green-600">
                  ₹{bookingData.totalAmount}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge
                  className={
                    bookingData.paymentMethod === 'cod'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-green-100 text-green-700'
                  }
                >
                  {bookingData.paymentMethod === 'cod'
                    ? 'Pay on Delivery'
                    : 'Paid'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="text-base mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> What's Next?
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              {bookingData.schedule?.type === 'now' ? (
                <>
                  <p>🔍 We're finding the nearest delivery partner</p>
                  <p>📱 You'll get a call within 5–10 minutes</p>
                  <p>📍 Track your delivery in real-time</p>
                  <p>🚚 Pickup within 15–30 minutes</p>
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

        {/* Support Section */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <h3 className="text-base mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Need Help?
            </h3>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 cursor-pointer"
                onClick={() => console.log(' Support Call Clicked')}
              >
                Call Support
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 cursor-pointer"
                onClick={() => console.log(' Live Chat Clicked')}
              >
                Live Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Buttons */}
      <div style={{ padding: '16px', borderTop: '1px solid #ddd' }}>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer mb-2"
          onClick={handleTrackDelivery}
          style={{
            width: '100%',
            padding: '12px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Track Delivery
        </Button>
        <Button
          onClick={handleBookAnother}
          className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
          style={{
            width: '100%',
            padding: '12px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Book Another Delivery
        </Button>
      </div>
    </div>
  );
}
