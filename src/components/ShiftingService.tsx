import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Props interface for cards
interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.FC;
  className?: string;
  onClick?: () => void;
}

// SVG Icons
const PackingMovingIcon: React.FC = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden="true">
    <rect x="10" y="30" width="40" height="25" fill="#60A5FA" />
    <rect x="20" y="15" width="20" height="15" fill="#3B82F6" />
  </svg>
);

const MiniTruckIcon: React.FC = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden="true">
    <rect x="5" y="30" width="40" height="20" fill="#FBBF24" />
    <rect x="35" y="35" width="20" height="15" fill="#F97316" />
    <circle cx="15" cy="55" r="5" fill="#374151" />
    <circle cx="45" cy="55" r="5" fill="#374151" />
  </svg>
);

const HouseIcon: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
    <rect x="12" y="24" width="24" height="16" fill="#3B82F6" />
    <polygon points="24,8 8,24 40,24" fill="#60A5FA" />
  </svg>
);

const OfficeIcon: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
    <rect x="12" y="18" width="24" height="22" fill="#6366F1" />
    <rect x="18" y="24" width="6" height="8" fill="#A5B4FC" />
    <rect x="28" y="24" width="6" height="8" fill="#A5B4FC" />
    <rect x="22" y="34" width="4" height="6" fill="#F59E42" />
  </svg>
);

// Card component
const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon: Icon,
  className = "",
  onClick,
}) => (
  <div
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") onClick && onClick();
    }}
    className={`flex items-center justify-between w-full bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer border border-gray-200 ${className}`}
  >
    <div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-base text-gray-600 mt-2">{description}</p>
    </div>
    <Icon />
  </div>
);

const ShiftingService: React.FC = () => {
  const navigate = useNavigate();
  const [showSubCards, setShowSubCards] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const Subcards: React.CSSProperties = {
  display: "flex",
  flexDirection: windowWidth < 600 ? "column" as "column" : "row" as "row",
  height: windowWidth < 600 ? "auto" : "200px",
  width: windowWidth < 600 ? "100%" : "800px",
  gap: "15px",
  marginTop: "3px",
  marginBottom: "10px",
};

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
  };

  const bannerSlides = [
    { textPrimary: "Move anything", textSecondary: "Services starting at ₹149*" },
    { textPrimary: "Reliable Packers & Movers", textSecondary: "Safe and on-time delivery" },
    { textPrimary: "Affordable Prices", textSecondary: "Customize your shifting plan" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="flex items-center justify-center mb-6 relative border-b border-gray-300 pb-3">
        <h1 className="text-xl font-semibold text-gray-900 tracking-wide select-none">Packers & Movers</h1>
      </header>

      <section className="mb-20 pb-50">
        <Slider {...sliderSettings}>
          {bannerSlides.map(({ textPrimary, textSecondary }, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-8 text-white flex flex-col items-start select-none"
              aria-label={`Banner slide ${index + 1}`}
            >
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">{textPrimary}</h2>
              <p className="mt-2 text-lg opacity-90">{textSecondary}</p>
            </div>
          ))}
        </Slider>
      </section>

      <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-300 pb-3 pt-5 max-w-lg mx-auto">
        Select your shifting service
      </h2>

      <div className="max-w-lg mx-auto">
        {/* Packing and Moving card */}
        <ServiceCard
          title="Packing and moving"
          description="Full-fledged house shifting service"
          icon={PackingMovingIcon}
          onClick={() => setShowSubCards((val) => !val)}
          className="mb-10"
        />

        {/* Subcards */}
        {showSubCards && (
          <div className="mb-10 pl-6 space-y-5" style={Subcards}>
            <ServiceCard
              title="House shifting"
              description="For all types of house moves."
              icon={HouseIcon}
              onClick={() => navigate("/ShiftingType?type=home")}
              className="bg-blue-50 border-blue-200 flex-grow"
            />
            <ServiceCard
              title="Office shifting"
              description="Corporate or office relocations."
              icon={OfficeIcon}
              onClick={() => navigate("/ShiftingType?type=office")}
              className="bg-indigo-50 border-indigo-200 flex-grow"
            />
          </div>
        )}

        {/* Mini Truck */}
        <ServiceCard
          title="Mini truck with 1 labour"
          description="For shifting a few small items"
          icon={MiniTruckIcon}
          onClick={() => navigate("/MiniTruckBooking")}
        />
      </div>
    </div>
  );
};

export default ShiftingService;
