import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

// 🔹 Local type definitions (self-contained)
type ScheduleType = 'instant' | 'now' | 'later';

interface ScheduleOption {
  id: ScheduleType;
  title: string;
  description: string;
  icon: string;
  badge: string;
}

// 🔹 Local UI Mock Components (replace with real ones later if needed)
const Button = ({ children, onClick, disabled, variant = 'default', size = 'md', className = '' }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`rounded-xl px-5 py-3 font-medium transition ${
      variant === 'default'
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    } ${size === 'lg' ? 'text-lg px-6 py-3' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-2xl shadow-md border border-gray-100 ${className}`}>{children}</div>
);

const CardHeader = ({ children }: any) => <div className="p-5 border-b">{children}</div>;
const CardTitle = ({ children }: any) => <h2 className="font-semibold text-lg text-gray-800">{children}</h2>;
const CardContent = ({ children }: any) => <div className="p-5">{children}</div>;

const Badge = ({ children, variant = 'secondary', className = '' }: any) => {
  const styles =
    variant === 'outline'
      ? 'border border-gray-300 text-gray-700'
      : variant === 'secondary'
      ? 'bg-gray-100 text-gray-700'
      : 'bg-red-100 text-red-700';
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles} ${className}`}>{children}</span>;
};

const internalStyles: React.CSSProperties = {
  minHeight: '100vh',
  maxHeight: '100vh',
  overflowY: 'auto',
  overflowX: 'hidden',
  scrollBehavior: 'smooth',
  WebkitOverflowScrolling: 'touch', // smooth on iOS devices
  background: 'linear-gradient(to bottom right, #bfdbfe, #fff, #ffedd5)',
  padding: '1.25rem', // same as px-5 py-5
  boxSizing: 'border-box',
  marginBlock: '10px',
};

const Switch = ({ checked, onCheckedChange }: any) => (
  <div
    onClick={() => onCheckedChange(!checked)}
    className={`w-10 h-5 flex items-center rounded-full cursor-pointer transition ${
      checked ? 'bg-blue-600' : 'bg-gray-300'
    }`}
  >
    <div
      className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
        checked ? 'translate-x-5' : 'translate-x-1'
      }`}
    ></div>
  </div>
);

const Separator = () => <div className="border-t border-gray-200 my-2"></div>;
const Label = ({ children }: any) => <label className="font-medium text-sm">{children}</label>;

// 🔹 Simple Date Picker
const Calendar = ({ selected, onSelect }: { selected?: Date; onSelect: (date: Date) => void }) => (
  <input
    type="date"
    className="border rounded-lg p-2 w-full"
    value={selected ? selected.toISOString().split('T')[0] : ''}
    onChange={(e) => onSelect(new Date(e.target.value))}
    min={new Date().toISOString().split('T')[0]}
  />
);

// 🔹 Mock Context Data
const mockData = {
  schedule: { type: 'now' as ScheduleType, date: undefined, requestVerification: false },
  locations: { from: 'Bangalore', via: '', to: 'Mysore' },
  laborCount: 3,
  items: { bedroom: { bed: 1, table: 2 }, kitchen: { fridge: 1 } },
  fragileItems: ['Glass Vase', 'Mirror'],
};

export default function ScheduleOrder() {
  const data = mockData;
  const [scheduleType, setScheduleType] = useState<ScheduleType>(data.schedule.type);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(data.schedule.date);
  const [requestVerification, setRequestVerification] = useState(data.schedule.requestVerification);

  const handleNext = () => {
    console.log('Next Step:', { scheduleType, selectedDate, requestVerification });
    alert('Proceeding to Booking...');
  };

  const scheduleOptions: ScheduleOption[] = [
    { id: 'instant', title: 'Instant', description: 'Move within next 2 hours', icon: '⚡', badge: 'Urgent' },
    { id: 'now', title: 'Today', description: 'Move today at convenient time', icon: '📅', badge: 'Same Day' },
    { id: 'later', title: 'Schedule Later', description: 'Choose a specific date', icon: '🗓️', badge: 'Planned' },
  ];

  const totalItems = Object.values(data.items)
    .flatMap((room) => Object.values(room))
    .reduce((a, b) => a + b, 0);

  return (
<div style={internalStyles}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6 ">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-blue-600 flex items-center gap-2 text-xl font-bold">🚚 EasyMove</h1>
              <p className="text-gray-600 mt-1">When would you like to move?</p>
            </div>
            <Badge variant="outline" className="px-4 py-2">
              Step 4 of 6
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-6 ml-10">
          {/* Scheduling Options */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Choose Move Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scheduleOptions.map((option) => (
                  <motion.div key={option.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant={scheduleType === option.id ? 'default' : 'outline'}
                      className="w-full h-auto justify-start p-6"
                      onClick={() => setScheduleType(option.id)}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="text-3xl">{option.icon}</div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span>{option.title}</span>
                            <Badge variant="secondary" className="text-xs">
                              {option.badge}
                            </Badge>
                          </div>
                          <p className="text-sm opacity-80 mt-1">{option.description}</p>
                        </div>
                        {scheduleType === option.id && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Calendar for Later Schedule */}
            {scheduleType === 'later' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-blue-600" />
                      Select Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar selected={selectedDate} onSelect={setSelectedDate} />
                    {selectedDate && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Selected Date</p>
                        <p>
                          {selectedDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Verification Option */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Request Verification Visit</Label>
                    <p className="text-sm text-gray-600">
                      A packer will visit to verify items before the move (Optional)
                    </p>
                  </div>
                  <Switch checked={requestVerification} onCheckedChange={setRequestVerification} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl">{totalItems}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">From</p>
                    <p className="text-sm">{data.locations.from}</p>
                  </div>
                  {data.locations.via && (
                    <div>
                      <p className="text-sm text-gray-600">Via</p>
                      <p className="text-sm">{data.locations.via}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">To</p>
                    <p className="text-sm">{data.locations.to}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-gray-600">Laborers</p>
                  <p>{data.laborCount} helpers</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-gray-600 mb-2">Items Breakdown</p>
                  {Object.entries(data.items).map(([room, items]) => {
                    const count = Object.values(items).reduce((sum, val) => sum + val, 0);
                    if (count === 0) return null;
                    return (
                      <div key={room} className="flex justify-between text-sm py-1">
                        <span className="capitalize">{room}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    );
                  })}
                </div>

                {data.fragileItems.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-600">Fragile Items</p>
                      <Badge variant="destructive">{data.fragileItems.length} items</Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 max-w-6xl">
          <Button variant="outline" size="lg" onClick={() => alert('Going Back')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            size="lg"
            className="px-8"
            disabled={scheduleType === 'later' && !selectedDate}
          >
            Continue to Booking
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
