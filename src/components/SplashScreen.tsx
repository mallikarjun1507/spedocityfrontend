import { useEffect } from "react";
import { motion } from "motion/react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white overflow-hidden"
      style={{ width: "100vw", height: "100dvh" }} // ✅ guarantees full screen
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
           {/* ✅ Company Logo (logo.jpg in public folder) */}
          <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <img
              src="/logo.png" // <-- use logo.jpg here
              alt="Spedocity Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-4xl mb-2">Spedocity</h1>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-xl opacity-90"
        >
          Speed. Safety. Spedocity.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-8"
      >
        <div className="w-8 h-8 border-2 border-white/30 rounded-full animate-spin border-t-white" />
      </motion.div>
    </div>
  );
}
