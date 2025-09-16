import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Search, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface DropLocationProps {
  pickup: string;
  onNext: (dropoff: string) => void;
  onBack: () => void;
}

export function DropLocation({ pickup, onNext, onBack }: DropLocationProps) {
  const [searchText, setSearchText] = useState('');

  const handleNext = () => {
    if (searchText.trim()) {
      onNext(searchText.trim());
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setSearchText(suggestion);
    // Auto-proceed after selecting a suggestion
    setTimeout(() => {
      onNext(suggestion);
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchText.trim()) {
      handleNext();
    }
  };

  const handleMapClick = () => {
    // Simulate setting location from map
    const mockLocation = "Selected location from map";
    setSearchText(mockLocation);
    setTimeout(() => {
      onNext(mockLocation);
    }, 100);
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
          <h1 className="text-lg">Drop Location</h1>
          <div className="w-16" />
        </div>

        {/* Route Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div className="w-0.5 h-8 bg-gray-300 my-1" />
              <div className="w-3 h-3 bg-red-500 rounded-full" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-gray-500">From</p>
                <p className="text-sm">{pickup}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">To</p>
                <p className="text-sm text-gray-400">Enter destination</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Area - Mock */}
      <div 
        className="h-64 bg-gradient-to-br from-red-100 to-orange-100 relative cursor-pointer"
        onClick={handleMapClick}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <MapPin className="w-12 h-12 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Tap on map to select drop location</p>
          </div>
        </motion.div>
      </div>

      {/* Search Input */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Enter drop location..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 bg-white"
              autoFocus
            />
          </div>

          {/* Suggestions */}
          {searchText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h3 className="text-sm text-gray-600 mb-2">Suggestions</h3>
              {[
                `${searchText} Main Road, Bangalore`,
                `${searchText} Junction, Bangalore`,
                `${searchText} Metro Station, Bangalore`
              ].map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => selectSuggestion(suggestion)}
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Continue Button */}
      <div className="p-6 bg-white border-t mt-auto">
        <Button
          onClick={handleNext}
          disabled={!searchText.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}