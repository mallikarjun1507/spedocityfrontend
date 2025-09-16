import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Zap, DollarSign, Shield } from 'lucide-react';
import { Button } from './ui/button';

interface IntroSlidesProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Zap,
    title: "Shift faster",
    description: "Lightning-fast delivery that gets your packages where they need to go in record time.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: DollarSign,
    title: "Affordable delivery",
    description: "Competitive rates that won't break the bank. Quality service at unbeatable prices.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Shield,
    title: "Safe tracking",
    description: "Real-time tracking and secure handling ensure your packages arrive safely every time.",
    gradient: "from-blue-500 to-cyan-500"
  }
];

export function IntroSlides({ onComplete }: IntroSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
          >
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${slides[currentSlide].gradient} flex items-center justify-center mb-8 shadow-2xl`}>
              {(() => {
                const IconComponent = slides[currentSlide].icon;
                return <IconComponent className="w-16 h-16 text-white" />;
              })()}
            </div>
            
            <h2 className="text-3xl mb-4 text-gray-900">
              {slides[currentSlide].title}
            </h2>
            
            <p className="text-lg text-gray-600 max-w-sm leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="p-8">
        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={prevSlide}
            className="flex items-center gap-2"
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentSlide === slides.length - 1 ? (
            <Button
              onClick={onComplete}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              Get Started
            </Button>
          ) : (
            <Button
              onClick={nextSlide}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}