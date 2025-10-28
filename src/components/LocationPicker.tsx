import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Home, 
  Building, 
  Heart, 
  Clock, 
  Plus, 
  Search,
  Navigation,
  Star,
  X,
  ChevronRight
} from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

export interface Location {
  id: string;
  type: 'home' | 'work' | 'favorite' | 'recent' | 'current';
  title: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  lastUsed?: string;
  icon?: any;
}

const savedAddresses: Location[] = [
  {
    id: '1',
    type: 'home',
    title: 'Home',
    address: 'Brigade Metropolis, Whitefield, Bangalore, Karnataka 560066',
    icon: Home,
    lastUsed: '2 days ago'
  },
  {
    id: '2',
    type: 'work',
    title: 'Office',
    address: 'Prestige Tech Park, Marathahalli, Bangalore, Karnataka 560037',
    icon: Building,
    lastUsed: '1 day ago'
  },
  {
    id: '3',
    type: 'favorite',
    title: 'Mom\'s Place',
    address: 'JP Nagar 7th Phase, Bangalore, Karnataka 560078',
    icon: Heart,
    lastUsed: '5 days ago'
  }
];

const recentLocations: Location[] = [
  {
    id: '4',
    type: 'recent',
    title: 'Electronic City Metro Station',
    address: 'Electronic City Phase 1, Bangalore, Karnataka 560100',
    lastUsed: '3 hours ago'
  },
  {
    id: '5',
    type: 'recent',
    title: 'Phoenix MarketCity',
    address: 'Mahadevapura, Whitefield, Bangalore, Karnataka 560048',
    lastUsed: '1 day ago'
  },
  {
    id: '6',
    type: 'recent',
    title: 'Koramangala Social',
    address: '5th Block, Koramangala, Bangalore, Karnataka 560095',
    lastUsed: '2 days ago'
  },
  {
    id: '7',
    type: 'recent',
    title: 'UB City Mall',
    address: 'Vittal Mallya Road, Bangalore, Karnataka 560001',
    lastUsed: '3 days ago'
  }
];

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: Location) => void;
  title: string;
  placeholder: string;
  type: 'pickup' | 'dropoff' | 'via';
}

export function LocationPicker({ 
  isOpen, 
  onClose, 
  onLocationSelect, 
  title, 
  placeholder,
  type 
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleLocationSelect = (location: Location) => {
    onLocationSelect(location);
    onClose();
  };

  const filteredSavedAddresses = savedAddresses.filter(address =>
    address.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecentLocations = recentLocations.filter(location =>
    location.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 400 
            }}
            className="bg-white w-full md:w-[500px] md:max-h-[80vh] max-h-[90vh] md:rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                  autoFocus
                />
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[calc(90vh-140px)] md:max-h-[calc(80vh-140px)] overflow-y-auto">
              {/* Current Location */}
              <div className="p-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="border-blue-200 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleLocationSelect({
                      id: 'current',
                      type: 'current',
                      title: 'Use Current Location',
                      address: 'We\'ll detect your location automatically'
                    })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <Navigation className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">Use Current Location</h3>
                          <p className="text-sm text-gray-600">We'll detect your location automatically</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Saved Addresses */}
              {(!searchQuery || filteredSavedAddresses.length > 0) && (
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">Saved Addresses</h3>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      <Plus className="w-4 h-4 mr-1" />
                      Add New
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {(searchQuery ? filteredSavedAddresses : savedAddresses).map((address, index) => (
                      <motion.div
                        key={address.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Card 
                          className="border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => handleLocationSelect(address)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                address.type === 'home' ? 'bg-green-100' :
                                address.type === 'work' ? 'bg-blue-100' :
                                'bg-pink-100'
                              }`}>
                                {address.icon && (
                                  <address.icon className={`w-5 h-5 ${
                                    address.type === 'home' ? 'text-green-600' :
                                    address.type === 'work' ? 'text-blue-600' :
                                    'text-pink-600'
                                  }`} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-gray-900">{address.title}</h4>
                                  {address.type === 'favorite' && (
                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">{address.address}</p>
                                {address.lastUsed && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">Used {address.lastUsed}</span>
                                  </div>
                                )}
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Locations */}
              {(!searchQuery || filteredRecentLocations.length > 0) && (
                <div className="px-4 pb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Recent Locations</h3>
                  
                  <div className="space-y-2">
                    {(searchQuery ? filteredRecentLocations : recentLocations).map((location, index) => (
                      <motion.div
                        key={location.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (savedAddresses.length + index) * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Card 
                          className="border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => handleLocationSelect(location)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-gray-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 mb-1">{location.title}</h4>
                                <p className="text-sm text-gray-600 line-clamp-2">{location.address}</p>
                                <div className="flex items-center gap-1 mt-2">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">Used {location.lastUsed}</span>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {searchQuery && filteredSavedAddresses.length === 0 && filteredRecentLocations.length === 0 && (
                <div className="p-8 text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No locations found</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    We couldn't find any locations matching "{searchQuery}"
                  </p>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleLocationSelect({
                      id: 'custom',
                      type: 'recent',
                      title: searchQuery,
                      address: searchQuery
                    })}
                  >
                    Use "{searchQuery}"
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}