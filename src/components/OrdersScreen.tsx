import { motion } from 'motion/react';
import { Package, Clock, CheckCircle, XCircle, Download, RotateCcw, Eye, MapPin } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const mockOrders = [
  {
    id: 'SPD001',
    status: 'delivered',
    pickup: 'MG Road, Bangalore',
    dropoff: 'Koramangala, Bangalore',
    service: 'Bike Delivery',
    date: '2024-01-15',
    time: '14:30',
    amount: '₹75',
    hasInvoice: true,
    canRebook: true,
    canTrack: false
  },
  {
    id: 'SPD002',
    status: 'in-transit',
    pickup: 'Whitefield, Bangalore',
    dropoff: 'Electronic City, Bangalore',
    service: 'Mini Truck',
    date: '2024-01-14',
    time: '16:45',
    amount: '₹850',
    hasInvoice: false,
    canRebook: false,
    canTrack: true
  },
  {
    id: 'SPD003',
    status: 'assigned',
    pickup: 'HSR Layout, Bangalore',
    dropoff: 'Indiranagar, Bangalore',
    service: 'Courier',
    date: '2024-01-13',
    time: '10:15',
    amount: '₹45',
    hasInvoice: false,
    canRebook: false,
    canTrack: true
  },
  {
    id: 'SPD004',
    status: 'cancelled',
    pickup: 'Banashankari, Bangalore',
    dropoff: 'JP Nagar, Bangalore',
    service: 'Packers',
    date: '2024-01-12',
    time: '09:00',
    amount: '₹0',
    hasInvoice: false,
    canRebook: true,
    canTrack: false
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-700';
    case 'in-transit':
      return 'bg-blue-100 text-blue-700';
    case 'assigned':
      return 'bg-purple-100 text-purple-700';
    case 'pending':
      return 'bg-orange-100 text-orange-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered':
      return CheckCircle;
    case 'in-transit':
      return Clock;
    case 'assigned':
      return MapPin;
    case 'pending':
      return Clock;
    case 'cancelled':
      return XCircle;
    default:
      return Package;
  }
};

interface OrdersScreenProps {
  onTrackOrder?: (orderId: string) => void;
}

export function OrdersScreen({ onTrackOrder }: OrdersScreenProps = {}) {
  const handleDownloadInvoice = (orderId: string) => {
    // Mock invoice download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `spedocity-invoice-${orderId}.pdf`;
    link.click();
  };

  const handleRebook = (order: any) => {
    // Mock rebook functionality
    console.log('Rebooking order:', order);
  };

  const handleViewDetails = (orderId: string) => {
    // Mock view details
    console.log('Viewing details for order:', orderId);
  };

  const handleTrackOrder = (orderId: string) => {
    if (onTrackOrder) {
      onTrackOrder(orderId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-6 pb-4 shadow-sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-xl mb-1">Your Orders</h1>
          <p className="text-gray-600 text-sm">Track all your deliveries</p>
        </motion.div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6">
        <div className="space-y-4">
          {mockOrders.map((order, index) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <StatusIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-sm">#{order.id}</h3>
                          <p className="text-xs text-gray-600">{order.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`text-xs px-2 py-1 ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-1">{order.date}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Pickup</p>
                          <p className="text-sm">{order.pickup}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Drop-off</p>
                          <p className="text-sm">{order.dropoff}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">{order.amount}</span>
                      <span className="text-xs text-gray-500">{order.time}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {order.canTrack ? (
                        <Button
                          size="sm"
                          className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleTrackOrder(order.id)}
                        >
                          <MapPin className="w-3 h-3 mr-1" />
                          Track Live
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8 text-xs"
                          onClick={() => handleViewDetails(order.id)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                      )}
                      
                      {order.hasInvoice && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8 text-xs"
                          onClick={() => handleDownloadInvoice(order.id)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Invoice
                        </Button>
                      )}
                      
                      {order.canRebook && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleRebook(order)}
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Rebook
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {mockOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-sm mb-2">No orders yet</h3>
            <p className="text-xs text-gray-600">Your delivery history will appear here</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}