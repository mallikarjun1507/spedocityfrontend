import { motion } from 'motion/react';
import { CheckCircle, Clock, User, MapPin, Truck } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  icon: any;
  description?: string;
}

interface AnimatedProgressBarProps {
  steps: Step[];
  currentStepIndex: number;
  className?: string;
}

export function AnimatedProgressBar({ steps, currentStepIndex, className = '' }: AnimatedProgressBarProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Progress Line */}
      <div className="relative mb-8">
        {/* Background Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full" />
        
        {/* Animated Progress Line */}
        <motion.div
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
          initial={{ width: '0%' }}
          animate={{ 
            width: `${(currentStepIndex / (steps.length - 1)) * 100}%` 
          }}
          transition={{ 
            duration: 0.8, 
            ease: "easeInOut",
            delay: 0.2 
          }}
        />

        {/* Step Indicators */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <motion.div
                key={step.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
                className="flex flex-col items-center relative"
              >
                {/* Step Circle */}
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 relative z-10 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}
                  animate={isCurrent ? {
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(59, 130, 246, 0.4)",
                      "0 0 0 10px rgba(59, 130, 246, 0.1)",
                      "0 0 0 0 rgba(59, 130, 246, 0)"
                    ]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: isCurrent ? Infinity : 0,
                    repeatType: "loop"
                  }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <CheckCircle className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </motion.div>

                {/* Animated Success Ring */}
                {isCompleted && (
                  <motion.div
                    className="absolute inset-0 w-12 h-12 border-2 border-green-400 rounded-full"
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ 
                      scale: [1, 1.3, 1.5],
                      opacity: [0.8, 0.4, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                )}

                {/* Current Step Pulsing Ring */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 w-12 h-12 border-2 border-blue-400 rounded-full"
                    animate={{ 
                      scale: [1, 1.4],
                      opacity: [0.6, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                )}

                {/* Step Label */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (index * 0.15) + 0.2 }}
                  className="mt-3 text-center"
                >
                  <div className={`text-xs font-medium ${
                    isCurrent 
                      ? 'text-blue-600' 
                      : isCompleted 
                        ? 'text-green-600' 
                        : 'text-gray-400'
                  }`}>
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </div>
                  )}
                </motion.div>

                {/* Active Step Indicator */}
                {isCurrent && (
                  <motion.div
                    className="absolute -bottom-2 w-2 h-2 bg-blue-500 rounded-full"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current Step Info */}
      <motion.div
        key={currentStepIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
          />
          <span className="text-sm font-medium text-blue-700">
            {steps[currentStepIndex]?.label}
          </span>
        </div>
        {steps[currentStepIndex]?.description && (
          <p className="text-xs text-gray-600">
            {steps[currentStepIndex].description}
          </p>
        )}
      </motion.div>
    </div>
  );
}