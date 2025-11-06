import {
  CheckCircle,
  DollarSign,
  Download,
  Heart,
  MapPin,
  MessageCircle,
  Receipt,
  Star
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom"; // 🆕 added
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';

interface OrderCompletedProps {
  orderId?: string;
  amount?: number;
  onBack?: () => void;
  onDone?: () => void;
  onTrackDelivery?: () => void;
  onRebook?: () => void;
}

export function OrderCompleted({
  orderId,
  amount,
  onBack,
  onDone,
  onTrackDelivery,
  onRebook
}: OrderCompletedProps) {
  // 🆕 added
  const location = useLocation();
  const storedOrder = JSON.parse(localStorage.getItem("lastOrder") || "{}");

  const bookingData = location.state?.bookingData || storedOrder.bookingData;
  const finalOrderId = location.state?.orderId || storedOrder.orderId || orderId;
  const finalAmount = location.state?.amount || storedOrder.amount || amount || 0;
  const pickup = location.state?.pickup || storedOrder.pickup || bookingData?.pickup || "—";
  const dropoff = location.state?.dropoff || storedOrder.dropoff || bookingData?.dropoff || "—";
  const pickupCoords = location.state?.pickupCoords || storedOrder.pickupCoords;
  const dropCoords = location.state?.dropCoords || storedOrder.dropCoords;

  console.log("Pickup Coords:", pickupCoords);
  console.log("Drop Coords:", dropCoords);


  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [tipAmount, setTipAmount] = useState(0);
  const [showTipOptions, setShowTipOptions] = useState(false);
  const navigate = useNavigate();

  const tipOptions = [10, 20, 50, 100];

  const handleDownloadReceipt = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = `spedocity-receipt-${finalOrderId}.pdf`;
    link.click();
  };

  const handleSubmitRating = () => {
    console.log('Rating submitted:', { rating, comment, tipAmount, bookingData });
    onDone?.();
    navigate('/dashboard');
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount}`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-center">
          <h1 className="text-lg font-medium text-gray-800">Order Completed</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        {/* ✅ Only these 3 values updated dynamically */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl mb-2">Delivery Completed!</h2>
          <p className="text-gray-600">
            Your package from {bookingData?.pickup || 'Pickup'} to {bookingData?.dropoff || 'Drop'}
            has been delivered successfully
          </p>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Order Summary</h3>
                <Badge className="bg-green-100 text-green-700">Delivered</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-medium">#{finalOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-medium">{formatCurrency(finalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pickup</span>
                  <span className="font-medium">{pickup}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Drop</span>
                  <span className="font-medium">{dropoff}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time</span>
                  <span className="font-medium">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>


        {/* Digital Receipt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Receipt className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Digital Receipt</h3>
                    <p className="text-sm text-gray-600">Download PDF receipt</p>
                  </div>
                </div>
                <Button className='cursor-pointer'
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadReceipt}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rate Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg mb-4">Rate Your Experience</h3>

              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="p-1 transition-transform hover:scale-110"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-8 h-8 cursor-pointer ${star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                        } transition-colors`}
                    />
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <Textarea
                    placeholder="Tell us about your experience (optional)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mb-4"
                    rows={3}
                  />
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tip Driver */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="font-medium">Tip Your Driver</h3>
                  <p className="text-sm text-gray-600">Show appreciation for great service</p>
                </div>
              </div>

              {!showTipOptions ? (
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={() => setShowTipOptions(true)}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Add Tip
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {tipOptions.map((tip) => (
                      <Button className='cursor-pointer'
                        key={tip}
                        variant={tipAmount === tip ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTipAmount(tip)}
                      >
                        ₹{tip}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button className='cursor-pointer'
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowTipOptions(false);
                        setTipAmount(0);
                      }}
                    >
                      Skip
                    </Button>
                    {tipAmount > 0 && (
                      <Button
                        size="sm"
                        className="flex-1 cursor-pointer"
                        onClick={() => console.log('Tip added:', tipAmount)}
                      >
                        Add ₹{tipAmount} Tip
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-4 mb-6"
        >
          {/* Track Delivery Button */}
          {onTrackDelivery && (
            <Button
              onClick={onTrackDelivery}
              className="w-full bg-green-600 hover:bg-green-700 h-14 cursor-pointer"
            >
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>Track Delivery Details</span>
              </div>
            </Button>
          )}

          {/* Rebook Button */}
          {onRebook && (
            <Button
              onClick={onRebook}
              variant="outline"
              className="w-full h-14 border-blue-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer"
            >
              <div className="flex items-center justify-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600">Book Another Delivery</span>
              </div>
            </Button>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="grid grid-cols-1 gap-4 mb-6"
        >
          <Button variant="outline" className="h-16 cursor-pointer">
            <div className="flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span>Contact Support</span>
            </div>
          </Button>
        </motion.div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t">
        <Button
          onClick={handleSubmitRating}
          className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
          disabled={rating === 0}
        >
          {rating > 0 ? 'Submit & Continue' : 'Rate to Continue'}
        </Button>
      </div>
    </div>
  );
}