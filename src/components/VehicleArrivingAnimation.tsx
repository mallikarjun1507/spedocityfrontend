import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import { Car, Truck, Bike, MapPin, Clock } from "lucide-react";

interface VehicleArrivingAnimationProps {
  isVisible: boolean;
  vehicleType: "car" | "truck" | "bike";
  driverName: string;
  eta: string;
  onClose?: () => void;
}

export function VehicleArrivingAnimation({
  isVisible,
  vehicleType,
  driverName,
  eta,
  onClose,
}: VehicleArrivingAnimationProps) {
  // Auto close animation after 6 seconds
  useEffect(() => {
    if (isVisible && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 6000); // 6 sec delay before redirect
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const getVehicleIcon = () => {
    switch (vehicleType) {
      case "truck":
        return Truck;
      case "bike":
        return Bike;
      default:
        return Car;
    }
  };

  const VehicleIcon = getVehicleIcon();

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4"
          onClick={onClose}
          style={{
            position: "fixed",
            top: "70px", // Account for header height
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            zIndex: 99999,
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
            }}
            className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl relative z-[10000] mx-auto"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: "90vh",
              overflowY: "auto",
              minHeight: "400px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="flex-1 flex flex-col justify-center">
              {/* ✅ Success Checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-8 h-8 text-green-600"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <motion.path
                      d="M7 13l3 3 7-7"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        delay: 0.6,
                        duration: 0.6,
                        ease: "easeInOut",
                      }}
                    />
                  </svg>
                </motion.div>
              </motion.div>

              {/* ✅ Title & Subtitle */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-semibold text-gray-900 mb-2"
              >
                Driver Assigned! 🎉
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-8"
              >
                {driverName} is heading your way
              </motion.p>

              {/* ✅ Vehicle Animation */}
              <div className="relative h-24 mb-8 overflow-hidden">
                {/* Road */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="absolute bottom-8 left-0 right-0 h-1 bg-gray-300 origin-left"
                />

                {/* Dashed Lane */}
                <div className="absolute bottom-8 left-0 right-0 h-1 flex items-center justify-center">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="w-4 h-0.5 bg-white mx-1"
                    />
                  ))}
                </div>

                {/* Vehicle */}
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{
                    x: 50,
                    opacity: 1,
                    y: [0, -4, 0],
                  }}
                  transition={{
                    x: { delay: 1.2, duration: 2, ease: "easeInOut" },
                    opacity: { delay: 1.2, duration: 0.3 },
                    y: {
                      delay: 1.2,
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: "loop",
                    },
                  }}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <VehicleIcon className="w-6 h-6 text-white" />
                  </div>

                  {/* Exhaust smoke */}
                  <div className="absolute -left-6 top-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 0.6, 0],
                          scale: [0.5, 1.2, 1.5],
                          x: [-5, -15, -25],
                        }}
                        transition={{
                          delay: 1.5 + i * 0.3,
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                        className="absolute w-2 h-2 bg-gray-400 rounded-full"
                        style={{ top: i * 3 }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Destination Pin */}
                <motion.div
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{
                    delay: 2,
                    type: "spring",
                    stiffness: 400,
                    damping: 10,
                  }}
                  className="absolute bottom-4 right-8"
                >
                  <div className="relative">
                    <MapPin className="w-6 h-6 text-red-500" />
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 0.3, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                      className="absolute -inset-2 border-2 border-red-300 rounded-full"
                    />
                  </div>
                </motion.div>
              </div>

              {/* ETA Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
                className="bg-blue-50 rounded-xl p-4 mb-6"
              >
                <div className="flex items-center justify-center gap-2 text-blue-700">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">ETA: {eta}</span>
                </div>
              </motion.div>

              {/* Manual Button (Optional if user clicks early) */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Track Live
              </motion.button>
            </div>

            {/* Confetti Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    y: -20,
                    x: Math.random() * 300,
                    opacity: 1,
                    scale: Math.random() * 0.5 + 0.5,
                  }}
                  animate={{
                    y: 400,
                    opacity: 0,
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    delay: Math.random() * 0.5,
                    duration: 3,
                    ease: "easeOut",
                  }}
                  className={`absolute w-2 h-2 ${
                    i % 4 === 0
                      ? "bg-blue-500"
                      : i % 4 === 1
                      ? "bg-green-500"
                      : i % 4 === 2
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    borderRadius: Math.random() > 0.5 ? "50%" : "0",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
