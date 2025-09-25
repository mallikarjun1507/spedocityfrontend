import { Truck, Package, Bike, Mail } from 'lucide-react';
import { motion, Variants as MotionVariants, easeInOut, easeOut } from "framer-motion";
interface TruckAnimationProps {
  serviceType: 'packers' | 'mini-truck' | 'bike' | 'courier';
  isHovered?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function TruckAnimation({ serviceType, isHovered = false, size = 'md' }: TruckAnimationProps) {
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';
  
  const getIcon = () => {
    switch (serviceType) {
      case 'packers':
        return Package;
      case 'mini-truck':
        return Truck;
      case 'bike':
        return Bike;
      case 'courier':
        return Mail;
      default:
        return Truck;
    }
  };

  const Icon = getIcon();

  // Movement path animation
  const movementVariants = {
    initial: { x: -30, opacity: 0.3 },
    animate: {
      x: isHovered ? [0, 15, 0] : 0,
      opacity: 1,
      transition: {
        x: {
          duration: isHovered ? 2 : 0.5,
          repeat: isHovered ? Infinity : 0,
          repeatType: "loop" as const,
          ease: easeInOut
        },
        opacity: {
          duration: 0.3
        }
      }
    }
  };

  // Bouncing animation for wheels/movement
  const bounceVariants = {
    initial: { y: 0 },
    animate: {
      y: isHovered ? [0, -2, 0] : 0,
      transition: {
        duration: isHovered ? 0.6 : 0.3,
        repeat: isHovered ? Infinity : 0,
        repeatType: "loop" as const,
        ease: easeInOut
      }
    }
  };

  // Exhaust smoke animation
  const exhaustVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: {
      opacity: isHovered ? [0, 0.6, 0] : 0,
      scale: isHovered ? [0.5, 1.2, 1.5] : 0.5,
      x: isHovered ? [0, -10, -20] : 0,
      transition: {
        duration: isHovered ? 1.5 : 0.3,
        repeat: isHovered ? Infinity : 0,
        repeatType: "loop" as const,
        ease: easeOut
      }
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Road/Path */}
      {isHovered && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300 origin-left"
        />
      )}

      {/* Main Vehicle Icon */}
      <motion.div
        variants={movementVariants}
        initial="initial"
        animate="animate"
        className="relative z-10"
      >
        <motion.div
          variants={bounceVariants}
          initial="initial"
          animate="animate"
        >
          <Icon className={`${iconSize} text-white relative z-10`} />
        </motion.div>

        {/* Speed lines */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 0, width: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  x: [-15, -25],
                  width: [0, 8, 12]
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                className="absolute h-0.5 bg-white/60 rounded-full"
                style={{ top: `${30 + i * 20}%` }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Exhaust Smoke */}
      {isHovered && serviceType === 'mini-truck' && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              variants={exhaustVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.3 }}
              className="absolute w-2 h-2 bg-gray-400 rounded-full"
              style={{ 
                left: -8 - i * 4, 
                top: -4 + i * 2 
              }}
            />
          ))}
        </div>
      )}

      {/* Delivery package trail for courier */}
      {isHovered && serviceType === 'courier' && (
        <motion.div
          initial={{ opacity: 0, scale: 0, x: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            x: [-5, -15, -25]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-orange-400 rounded-sm"
        />
      )}

      {/* Bike wheel rotation effect */}
      {isHovered && serviceType === 'bike' && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1 -right-1 w-2 h-2 border border-white rounded-full opacity-60"
        />
      )}
    </div>
  );
}