import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Minus, Upload, Camera, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Card, CardContent } from '../ui/card';
import { Textarea } from '../ui/textarea';

interface ItemDetailsProps {
  onNext: (itemDetails: ItemDetailsData) => void;
  onBack: () => void;
}

interface ItemData {
  id: string;
  name: string;
  weight: number;
  isFragile: boolean;
  photos: string[];
}

interface ItemDetailsData {
  items: ItemData[];
  totalWeight: number;
  specialInstructions: string;
}

export function ItemDetails({ onNext, onBack }: ItemDetailsProps) {
  const [items, setItems] = useState<ItemData[]>([
    {
      id: '1',
      name: '',
      weight: 1,
      isFragile: false,
      photos: []
    }
  ]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const addItem = () => {
    const newItem: ItemData = {
      id: Date.now().toString(),
      name: '',
      weight: 1,
      isFragile: false,
      photos: []
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, updates: Partial<ItemData>) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const updateWeight = (id: string, increment: boolean) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    const newWeight = increment 
      ? Math.min(item.weight + 1, 100) 
      : Math.max(item.weight - 1, 1);
    
    updateItem(id, { weight: newWeight });
  };

  const handlePhotoUpload = (id: string) => {
    // Mock photo upload - in real app, this would trigger camera/gallery
    const mockPhotoUrl = `https://via.placeholder.com/150x150?text=Photo${Date.now()}`;
    const item = items.find(i => i.id === id);
    if (item && item.photos.length < 3) {
      updateItem(id, { photos: [...item.photos, mockPhotoUrl] });
    }
  };

  const removePhoto = (itemId: string, photoIndex: number) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      const newPhotos = item.photos.filter((_, index) => index !== photoIndex);
      updateItem(itemId, { photos: newPhotos });
    }
  };

  const getTotalWeight = () => {
    return items.reduce((total, item) => total + item.weight, 0);
  };

  const canContinue = () => {
    return items.every(item => item.name.trim() !== '');
  };

  const handleNext = () => {
    if (canContinue()) {
      onNext({
        items,
        totalWeight: getTotalWeight(),
        specialInstructions
      });
    }
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
          <h1 className="text-lg">Item Details</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <Card className="bg-white border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm">Item {index + 1}</h3>
                    {items.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Item Name */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor={`item-name-${item.id}`}>Item Name *</Label>
                    <Input
                      id={`item-name-${item.id}`}
                      placeholder="e.g., Laptop, Documents, Books"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, { name: e.target.value })}
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Weight Selector */}
                  <div className="space-y-3 mb-4">
                    <Label>Weight</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateWeight(item.id, false)}
                        disabled={item.weight <= 1}
                        className="w-8 h-8 p-0 rounded-full border-gray-300 hover:border-blue-500 hover:text-blue-600"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      
                      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border min-w-20 justify-center">
                        <span className="text-lg font-medium">{item.weight}</span>
                        <span className="text-sm text-gray-600">kg</span>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateWeight(item.id, true)}
                        disabled={item.weight >= 100}
                        className="w-8 h-8 p-0 rounded-full border-gray-300 hover:border-blue-500 hover:text-blue-600"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Maximum weight: 100kg per item</p>
                  </div>

                  {/* Fragile Toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Label>Fragile Item</Label>
                      <p className="text-xs text-gray-600">Handle with extra care</p>
                    </div>
                    <Switch
                      checked={item.isFragile}
                      onCheckedChange={(checked) => updateItem(item.id, { isFragile: checked })}
                    />
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label>Photos (Optional)</Label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.photos.map((photo, photoIndex) => (
                        <div key={photoIndex} className="relative">
                          <img
                            src={photo}
                            alt={`Item ${index + 1} photo ${photoIndex + 1}`}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full p-0 hover:bg-red-600"
                            onClick={() => removePhoto(item.id, photoIndex)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                      
                      {item.photos.length < 3 && (
                        <Button
                          variant="outline"
                          onClick={() => handlePhotoUpload(item.id)}
                          className="w-16 h-16 flex flex-col items-center justify-center gap-1 border-dashed"
                        >
                          <Camera className="w-4 h-4" />
                          <span className="text-xs">Add</span>
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Add up to 3 photos per item</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Add Item Button */}
          <Button
            variant="outline"
            onClick={addItem}
            className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Item
          </Button>

          {/* Special Instructions */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="space-y-2">
                <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  placeholder="Any special handling instructions, delivery notes, etc."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="bg-gray-50 min-h-[80px] resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Total Items: {items.length}</p>
                  <p className="text-sm">Total Weight: {getTotalWeight()} kg</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Fragile Items</p>
                  <p className="text-sm">{items.filter(item => item.isFragile).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t">
        <Button
          onClick={handleNext}
          disabled={!canContinue()}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}