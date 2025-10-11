"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';

interface ScheduleProps {
  onNext: (schedule: ScheduleData) => void;
  onBack: () => void;
}

interface ScheduleData {
  type: 'now' | 'later';
  date?: Date;
  timeSlot?: string;
}

const timeSlots = [
  { id: '9-11', label: '9:00 AM - 11:00 AM', available: true },
  { id: '11-1', label: '11:00 AM - 1:00 PM', available: true },
  { id: '1-3', label: '1:00 PM - 3:00 PM', available: false },
  { id: '3-5', label: '3:00 PM - 5:00 PM', available: true },
  { id: '5-7', label: '5:00 PM - 7:00 PM', available: true },
  { id: '7-9', label: '7:00 PM - 9:00 PM', available: false }
];

export function Schedule({ onNext, onBack }: ScheduleProps) {
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);

  const handleNext = () => {
    if (scheduleType === 'now') {
      onNext({ type: 'now' });
    } else if (selectedDate && selectedTimeSlot) {
      onNext({ 
        type: 'later', 
        date: selectedDate, 
        timeSlot: selectedTimeSlot 
      });
    }
  };

  const canContinue = () => {
    if (scheduleType === 'now') return true;
    return selectedDate && selectedTimeSlot;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-lg">Schedule Delivery</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Schedule Options */}
      <div className="flex-1 overflow-y-auto px-6 py-4 pb-48">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {/* Quick Schedule Options */}
          <div className="space-y-3">
            <h2 className="text-lg">When do you need delivery?</h2>

            {/* Now Option */}
            <Card 
              className={`cursor-pointer transition-all ${
                scheduleType === 'now' 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setScheduleType('now');
                setShowCalendar(false);
                setSelectedDate(undefined);
                setSelectedTimeSlot('');
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base">Book Now</h3>
                      <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0">
                        Instant
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Pickup within 15-30 minutes</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* Later Option */}
            <Card 
              className={`cursor-pointer transition-all ${
                scheduleType === 'later' 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setScheduleType('later');
                setShowCalendar(true);
                setSelectedDate(undefined);
                setSelectedTimeSlot('');
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base mb-1">Schedule for Later</h3>
                    <p className="text-sm text-gray-600">Choose date and time slot</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Date & Time Selection for Later */}
          {scheduleType === 'later' && showCalendar && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Date Selection */}
              <div>
                <h3 className="text-base mb-2">Select Date</h3>
                <Card className="bg-white relative z-20">
                  <CardContent className="p-2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setSelectedTimeSlot('');
                      }}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border-0 w-full"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className='space-y-4 max-h-[400px] overflow-y-auto pr-2'
                >
                  <h3 className="text-base mb-2">Select Time Slot</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {formatDate(selectedDate)}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {timeSlots.map((slot) => (
                      <Card
                        key={slot.id}
                        className={`cursor-pointer transition-all ${
                          !slot.available 
                            ? 'opacity-50 cursor-not-allowed bg-gray-100'
                            : selectedTimeSlot === slot.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => slot.available && setSelectedTimeSlot(slot.id)}
                      >
                        <CardContent className="p-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{slot.label}</span>
                            {!slot.available ? (
                              <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                                Unavailable
                              </Badge>
                            ) : selectedTimeSlot === slot.id ? (
                              <Badge className="bg-blue-100 text-blue-700 text-xs">
                                Selected
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                Available
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Delivery Information */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <h3 className="text-sm mb-2">📋 Delivery Information</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Instant booking: Pickup within 15-30 minutes</li>
                <li>• Scheduled delivery: 2-hour time window</li>
                <li>• Track your delivery in real-time</li>
                <li>• Get SMS & push notifications</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
        <div className="mb-2">
          {scheduleType === 'now' ? (
            <p className="text-sm text-gray-600 text-center">
              Pickup will start within 15-30 minutes
            </p>
          ) : selectedDate && selectedTimeSlot ? (
            <p className="text-sm text-gray-600 text-center">
              Scheduled for {formatDate(selectedDate)} • {timeSlots.find(t => t.id === selectedTimeSlot)?.label}
            </p>
          ) : (
            <p className="text-sm text-gray-400 text-center">
              Please select date and time
            </p>
          )}
        </div>
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
