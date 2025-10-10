import { Minus, Plus, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface HelperOptionProps {
  onNext: (helpers: number) => void;
  onBack: () => void;
}

const helperOptions = [
  {
    count: 0,
    title: 'No Helper',
    description: 'Self pickup & delivery',
    price: 0,
    recommended: false
  },
  {
    count: 1,
    title: '+1 Helper',
    description: 'One helper for loading/unloading',
    price: 50,
    recommended: true
  },
  {
    count: 2,
    title: '+2 Helpers',
    description: 'Two helpers for heavy items',
    price: 100,
    recommended: false
  }
];

export function HelperOption({ onNext, onBack }: HelperOptionProps) {
  const [selectedHelpers, setSelectedHelpers] = useState<number>(0);

  const handleNext = () => {
    onNext(selectedHelpers);
  };

  const selectHelpers = (count: number) => {
    setSelectedHelpers(count);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-lg font-medium text-gray-800">Helper Options</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-lg mb-2">Need help with loading?</h2>
              <p className="text-sm text-gray-600">Choose the number of helpers you need</p>
            </div>

            <div className="space-y-4">
              {helperOptions.map((option, index) => (
                <motion.div
                  key={option.count}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Card
                    className={`cursor-pointer transition-all ${selectedHelpers === option.count
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    onClick={() => selectHelpers(option.count)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                          {option.count === 0 ? (
                            <Users className="w-7 h-7 text-gray-400" />
                          ) : (
                            <div className="flex items-center gap-1">
                              <Users className="w-6 h-6 text-blue-600" />
                              <span className="text-sm text-blue-600">+{option.count}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base">{option.title}</h3>
                            {option.recommended && (
                              <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>

                        <div className="text-right">
                          {option.price > 0 ? (
                            <>
                              <p className="text-lg text-green-600">+₹{option.price}</p>
                              <p className="text-xs text-gray-500">Extra charge</p>
                            </>
                          ) : (
                            <>
                              <p className="text-lg text-gray-600">Free</p>
                              <p className="text-xs text-gray-500">No extra cost</p>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Custom Helper Count */}
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="text-sm mb-2">Need more helpers?</h3>
                  <div className="flex items-center justify-center gap-3">
                    <Button className='cursor-pointer'
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedHelpers(Math.max(0, selectedHelpers - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center">{selectedHelpers}</span>
                    <Button className='cursor-pointer'
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedHelpers(Math.min(5, selectedHelpers + 1))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Maximum 5 helpers allowed</p>
                </div>
              </CardContent>
            </Card>

            {/* Helper Benefits */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <h3 className="text-sm mb-2">✨ Helper Benefits</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Professional trained helpers</li>
                  <li>• Safe handling of fragile items</li>
                  <li>• Loading & unloading assistance</li>
                  <li>• Insurance coverage included</li>
                </ul>
              </CardContent>
            </Card>

            {/* Pricing Information */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="text-sm mb-2">💰 Pricing Details</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Each helper: ₹50 extra charge</li>
                  <li>• Professional service guarantee</li>
                  <li>• 2-hour minimum service time</li>
                  <li>• Payment after service completion</li>
                </ul>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <h3 className="text-sm mb-2">❓ Frequently Asked</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-700">What do helpers assist with?</p>
                    <p className="text-xs text-gray-600">Loading, unloading, carrying items, and basic packing support</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">Are helpers insured?</p>
                    <p className="text-xs text-gray-600">Yes, all helpers are covered under our comprehensive insurance policy</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">Can I change helper count later?</p>
                    <p className="text-xs text-gray-600">You can modify before pickup, subject to availability</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Extra spacing for scroll */}
            <div className="h-32" />
          </motion.div>
        </div>
      </div>

      {/* Fixed Bottom Section */}
      <div className="flex-shrink-0 p-6 bg-white border-t shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">Selected:</span>
          <span className="text-sm">
            {selectedHelpers === 0
              ? 'No helper'
              : `${selectedHelpers} helper${selectedHelpers > 1 ? 's' : ''}`
            }
            {selectedHelpers > 0 && (
              <span className="text-green-600 ml-2">
                +₹{selectedHelpers * 50}
              </span>
            )}
          </span>
        </div>
        <Button
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}