
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import { ActiveOrder } from "./components/ActiveOrder";
import { BookingFlow } from "./components/BookingFlow";
import { BottomNavigation } from "./components/BottomNavigation";
import { Dashboard } from "./components/Dashboard";
import { IntroSlides } from "./components/IntroSlides";
import { LoginSignup } from "./components/LoginSignup";
import { NotificationScreen } from "./components/NotificationScreen";
import { OrderCompleted } from "./components/OrderCompleted";
import { OrdersScreen } from "./components/OrdersScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { Sidebar } from "./components/Sidebar";
import { SplashScreen } from "./components/SplashScreen";
import { useIsMobile } from "./components/ui/use-mobile";
import { WalletScreen } from "./components/WalletScreen";

type OnboardingStep = "splash" | "intro" | "auth" | "complete";
type AppTab = "home" | "orders" | "wallet" | "notifications" | "profile";
type AppState =
  | "onboarding"
  | "dashboard"
  | "booking"
  | "active-order"
  | "order-completed";

function AppContent() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("splash");
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [appState, setAppState] = useState<AppState>("onboarding");
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Onboarding handlers
  const handleSplashComplete = () => {
    setCurrentStep("intro");
    navigate("/intro");
  };
  const handleIntroComplete = () => {
    setCurrentStep("auth");
    navigate("/auth");
  };
  const handleAuthBack = () => {
    setCurrentStep("intro");
    navigate("/intro");
  };
  const handleAuthComplete = () => {
    setCurrentStep("complete");
    setAppState("dashboard");
    navigate("/dashboard/home");
  };

  // Sidebar + Tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as AppTab);
    setSidebarExpanded(true);
    navigate(`/dashboard/${tab}`);
  };

  const handleSidebarToggle = () => setSidebarExpanded(!sidebarExpanded);

  const handleContentClick = () => {
    if (isMobile && sidebarExpanded) {
      setSidebarExpanded(false);
    } else if (!isMobile && sidebarExpanded) {
      setSidebarExpanded(false);
    }
  };

  // Booking + Orders
  const handleStartBooking = () => {
    setAppState("booking");
    navigate("/booking");
  };
  const handleBookingComplete = () => {
    const orderId = "SPD" + Math.random().toString(36).substr(2, 6).toUpperCase();
    setCurrentOrderId(orderId);
    setAppState("active-order");
    navigate("/active-order");
  };
  const handleBookingCancel = () => {
    setAppState("dashboard");
    navigate("/dashboard/home");
  };
  const handleOrderComplete = () => {
    setAppState("order-completed");
    navigate("/order-completed");
  };
  const handleOrderCompletedDone = () => {
    setAppState("dashboard");
    setActiveTab("orders");
    navigate("/dashboard/orders");
  };
  const handleBackFromActiveOrder = () => {
    setAppState("dashboard");
    setActiveTab("orders");
    navigate("/dashboard/orders");
  };
  const handleTrackOrder = (orderId: string) => {
    setCurrentOrderId(orderId);
    setAppState("active-order");
    navigate("/active-order");
  };

  return (
    <div className="size-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={appState === "onboarding" ? currentStep : appState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="size-full"
        >
          <Routes>
            {/* Onboarding Routes */}
            <Route path="/" element={<SplashScreen onComplete={handleSplashComplete} />} />
            <Route path="/intro" element={<IntroSlides onComplete={handleIntroComplete} />} />
            <Route path="/auth" element={<LoginSignup onBack={handleAuthBack} onComplete={handleAuthComplete} />} />

            {/* Booking + Orders */}
            <Route path="/booking" element={<BookingFlow onComplete={handleBookingComplete} onCancel={handleBookingCancel} />} />
            <Route path="/active-order" element={<ActiveOrder orderId={currentOrderId} onBack={handleBackFromActiveOrder} onOrderComplete={handleOrderComplete} />} />
            <Route path="/order-completed" element={<OrderCompleted orderId={currentOrderId} amount={150} onBack={handleBackFromActiveOrder} onDone={handleOrderCompletedDone} />} />

            {/* Dashboard */}
            <Route
              path="/dashboard/*"
              element={
                isMobile ? (
                  <div className="size-full relative flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-hidden">
                      <Routes>
                        <Route path="home" element={<Dashboard onStartBooking={handleStartBooking} onTrackOrder={handleTrackOrder} />} />
                        <Route path="orders" element={<OrdersScreen onTrackOrder={handleTrackOrder} />} />
                        <Route path="wallet" element={<WalletScreen />} />
                        <Route path="notifications" element={<NotificationScreen />} />
                        <Route path="profile" element={<ProfileScreen />} />
                        {/* fallback redirect ensures back button never shows blank */}
                        <Route path="*" element={<Navigate to="home" replace />} />
                      </Routes>
                    </div>
                    <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
                    {sidebarExpanded && (
                      <div className="fixed inset-0 bg-black/20 z-30" onClick={() => setSidebarExpanded(false)} />
                    )}
                  </div>
                ) : (
                  <div className="size-full flex overflow-hidden">
                    {/* Sidebar */}
                    <div className={`transition-all duration-300 h-full bg-white shadow-md ${sidebarExpanded ? "w-64" : "w-20"}`}>
                      <Sidebar
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        expanded={sidebarExpanded}
                        onToggle={handleSidebarToggle}
                      />
                    </div>
                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto transition-all duration-300" onClick={handleContentClick}>
                      <div className="min-h-full">
                        <Routes>
                          <Route path="home" element={<Dashboard onStartBooking={handleStartBooking} onTrackOrder={handleTrackOrder} />} />
                          <Route path="orders" element={<OrdersScreen onTrackOrder={handleTrackOrder} />} />
                          <Route path="wallet" element={<WalletScreen />} />
                          <Route path="notifications" element={<NotificationScreen />} />
                          <Route path="profile" element={<ProfileScreen />} />
                          {/* fallback redirect ensures back button never shows blank */}
                          <Route path="*" element={<Navigate to="home" replace />} />
                        </Routes>
                      </div>
                    </div>
                  </div>
                )
              }
            />

            {/* Global fallback ensures root/back button works */}
            <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
