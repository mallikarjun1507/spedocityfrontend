import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PickupSelection } from './booking/PickupSelection';
import { DropLocation } from './booking/DropLocation';

import  ItemDetails  from './booking/ItemDetails';
import { HelperOption } from './booking/HelperOption';
import  Schedule  from './booking/Schedule';
import  FareEstimate  from './booking/FareEstimate';
import { PaymentPage } from './booking/PaymentPage';
import { ConfirmBooking } from './booking/ConfirmBooking';
import VehicleSelection from './booking/VehicleSelection';

type BookingStep = 
  | 'pickup' 
  | 'dropoff' 
  | 'service' 
  | 'items' 
  | 'helpers' 
  | 'schedule' 
  | 'fare' 
  | 'payment' 
  | 'confirm';

interface BookingFlowProps {
  onComplete: () => void;
  onCancel: () => void;
  initialPickup?: string;
  initialDropoff?: string;
  initialViaLocations?: Array<{id: string, title: string, address: string}>;
}

interface BookingData {
  pickup: string;
  dropoff: string;
  service: string;
  itemDetails?: any;
  helpers: number;
  schedule?: any;
  fareData?: any;
  paymentMethod?: string;
  bookingId?: string;
}

export function BookingFlow({ onComplete, onCancel, initialPickup, initialDropoff, initialViaLocations }: BookingFlowProps) {
  // If we have initial pickup and dropoff, skip to service selection
  const getInitialStep = (): BookingStep => {
    if (initialPickup && initialDropoff) {
      return 'service';
    }
    return 'pickup';
  };

  const [currentStep, setCurrentStep] = useState<BookingStep>(getInitialStep());
  const [bookingData, setBookingData] = useState<BookingData>({
    pickup: initialPickup || '',
    dropoff: initialDropoff || '',
    service: '',
    helpers: 0
  });

  const handleStepComplete = (step: BookingStep, data: any) => {
    setBookingData(prev => ({ ...prev, ...data }));
    
    switch (step) {
      case 'pickup':
        setCurrentStep('dropoff');
        break;
      case 'dropoff':
        setCurrentStep('service');
        break;
      case 'service':
        setCurrentStep('items');
        break;
      case 'items':
        setCurrentStep('helpers');
        break;
      case 'helpers':
        setCurrentStep('schedule');
        break;
      case 'schedule':
        setCurrentStep('fare');
        break;
      case 'fare':
        setCurrentStep('payment');
        break;
      case 'payment':
        // Generate booking ID
        const bookingId = `SPD${Date.now().toString().slice(-6)}`;
        setBookingData(prev => ({ ...prev, bookingId }));
        setCurrentStep('confirm');
        break;
      case 'confirm':
        onComplete();
        break;
    }
  };

  const handleStepBack = (step: BookingStep) => {
    switch (step) {
      case 'dropoff':
        setCurrentStep('pickup');
        break;
      case 'service':
        setCurrentStep('dropoff');
        break;
      case 'items':
        setCurrentStep('service');
        break;
      case 'helpers':
        setCurrentStep('items');
        break;
      case 'schedule':
        setCurrentStep('helpers');
        break;
      case 'fare':
        setCurrentStep('schedule');
        break;
      case 'payment':
        setCurrentStep('fare');
        break;
      case 'pickup':
        onCancel();
        break;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'pickup':
        return (
          <PickupSelection
            onNext={(pickup) => handleStepComplete('pickup', { pickup })}
            onBack={() => handleStepBack('pickup')}
          />
        );
      
      case 'dropoff':
        return (
          <DropLocation
            pickup={bookingData.pickup}
            onNext={(dropoff) => handleStepComplete('dropoff', { dropoff })}
            onBack={() => handleStepBack('dropoff')}
          />
        );
      
     case "service":
  return (
    <VehicleSelection
      pickup={bookingData.pickup}
      dropoff={bookingData.dropoff}
      onNext={(selectedVehicle) => handleStepComplete("service", { selectedVehicle })}
      onBack={() => handleStepBack("service")}
    />
  );

      
      case 'items':
        return (
          <ItemDetails
            onNext={(itemDetails) => handleStepComplete('items', { itemDetails })}
            onBack={() => handleStepBack('items')}
          />
        );
      
      case 'helpers':
        return (
          <HelperOption
            onNext={(helpers) => handleStepComplete('helpers', { helpers })}
            onBack={() => handleStepBack('helpers')}
          />
        );
      
      case 'schedule':
        return (
          <Schedule
            onNext={(schedule) => handleStepComplete('schedule', { schedule })}
            onBack={() => handleStepBack('schedule')}
          />
        );
      
      case 'fare':
        return (
          <FareEstimate
            pickup={bookingData.pickup}
            dropoff={bookingData.dropoff}
            service={bookingData.service}
            helpers={bookingData.helpers}
            onNext={(fareData) => handleStepComplete('fare', { fareData })}
            onBack={() => handleStepBack('fare')}
          />
        );
      
      case 'payment':
        return (
          <PaymentPage
            fareData={bookingData.fareData}
            onNext={(paymentMethod) => handleStepComplete('payment', { paymentMethod })}
            onBack={() => handleStepBack('payment')}
          />
        );
      
      case 'confirm':
        return (
          <ConfirmBooking
            bookingData={{
              pickup: bookingData.pickup,
              dropoff: bookingData.dropoff,
              service: bookingData.service,
              schedule: bookingData.schedule,
              helpers: bookingData.helpers,
              paymentMethod: bookingData.paymentMethod || '',
              totalAmount: bookingData.fareData?.totalPrice || 0,
              bookingId: bookingData.bookingId || ''
            }}
            onComplete={() => handleStepComplete('confirm', {})}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="size-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="size-full"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}