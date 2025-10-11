import { Camera, Minus, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
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

const ITEM_OPTIONS = [
  'Laptop',
  'Books/Documents',
  'Clothes',
  'Electronics',
  'Groceries',
  'Furniture',
  'Other'
];

export function ItemDetails({ onNext, onBack }: ItemDetailsProps) {
  const [items, setItems] = useState<ItemData[]>([
    { id: '1', name: '', weight: 1, isFragile: false, photos: [] }
  ]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const addItem = () => {
    const newItem: ItemData = { id: Date.now().toString(), name: '', weight: 1, isFragile: false, photos: [] };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<ItemData>) => {
    setItems(items.map(item => (item.id === id ? { ...item, ...updates } : item)));
  };

  const updateWeight = (id: string, increment: boolean) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newWeight = increment ? Math.min(item.weight + 1, 100) : Math.max(item.weight - 1, 1);
    updateItem(id, { weight: newWeight });
  };

  const handlePhotoUpload = (id: string) => {
    const mockPhotoUrl = `https://via.placeholder.com/150?text=Photo${Date.now()}`;
    const item = items.find(i => i.id === id);
    if (item && item.photos.length < 3) updateItem(id, { photos: [...item.photos, mockPhotoUrl] });
  };

  const removePhoto = (itemId: string, photoIndex: number) => {
    const item = items.find(i => i.id === itemId);
    if (item) updateItem(itemId, { photos: item.photos.filter((_, i) => i !== photoIndex) });
  };

  const getTotalWeight = () => items.reduce((total, item) => total + item.weight, 0);
  const canContinue = () => items.every(item => item.name.trim() !== '');

  const handleNext = () => {
    if (canContinue()) {
      onNext({ items, totalWeight: getTotalWeight(), specialInstructions });
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm flex justify-center items-center">
        <h1 className="text-lg font-semibold">Parcel Items</h1>


        <div className="w-16" />
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-6 pb-32 space-y-6">
        {items.map((item, index) => (
          <Card key={item.id} className="bg-white shadow-md border-gray-200">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">Item {index + 1}</h3>
                {items.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Item Name Selection */}
              <div className="space-y-1">
                <Label>Item Type *</Label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:border-blue-500 cursor-pointer"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                >
                  <option value="">Select Item</option>
                  {ITEM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              {/* Weight Selector */}
              <div className="space-y-1">
                <Label>Weight</Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateWeight(item.id, false)}
                    disabled={item.weight <= 1}
                    className="w-8 h-8 p-0 rounded-full border-gray-300 hover:border-blue-500 hover:text-blue-600 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1 px-4 py-2 bg-gray-50 rounded-lg border min-w-[60px] justify-center">
                    <span className="font-medium">{item.weight}</span> <span className="text-gray-500 text-sm">kg</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateWeight(item.id, true)}
                    disabled={item.weight >= 100}
                    className="w-8 h-8 p-0 rounded-full border-gray-300 hover:border-blue-500 hover:text-blue-600 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Max: 100kg per item</p>
              </div>

              {/* Fragile Toggle */}
              <div className="flex items-center justify-between cursor-pointer">
                <div>
                  <Label>Fragile</Label>
                  <p className="text-xs text-gray-500">Handle with care</p>
                </div>
                <Switch
                  checked={item.isFragile}
                  onCheckedChange={(checked) => updateItem(item.id, { isFragile: checked })}
                  className="cursor-pointer"
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Photos (Optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {item.photos.map((photo, i) => (
                    <div key={i} className="relative cursor-pointer">
                      <img src={photo} alt={`Photo ${i + 1}`} className="w-16 h-16 object-cover rounded-lg" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full hover:bg-red-600 cursor-pointer"
                        onClick={() => removePhoto(item.id, i)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  {item.photos.length < 3 && (
                    <Button
                      variant="outline"
                      onClick={() => handlePhotoUpload(item.id)}
                      className="w-16 h-16 flex flex-col items-center justify-center gap-1 border-dashed rounded-lg cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span className="text-xs">Add</span>
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500">Up to 3 photos per item</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Item Button */}
        <Button
          variant="outline"
          onClick={addItem}
          className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Another Item
        </Button>

        {/* Special Instructions */}
        <Card className="bg-white border-gray-200">
          <CardContent>
            <Label>Special Instructions (Optional)</Label>
            <Textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="bg-gray-50 min-h-[80px] resize-none mt-1 cursor-text"
            />
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm">Total Items: {items.length}</p>
              <p className="text-sm">Total Weight: {getTotalWeight()} kg</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Fragile Items</p>
              <p className="text-sm">{items.filter(i => i.isFragile).length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t">
        <Button
          onClick={handleNext}
          disabled={!canContinue()}
          className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
