import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SplashScreen } from "./components/SplashScreen";
import { IntroSlides } from "./components/IntroSlides";
import { LoginSignup } from "./components/LoginSignup";
import { Dashboard } from "./components/Dashboard";
import { OrdersScreen } from "./components/OrdersScreen";
import { WalletScreen } from "./components/WalletScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { Sidebar } from "./components/Sidebar";
import { BottomNavigation } from "./components/BottomNavigation";
import { BookingFlow } from "./components/BookingFlow";
import { useIsMobile } from "./components/ui/use-mobile";
import { ActiveOrder } from "./components/ActiveOrder";
import { OrderCompleted } from "./components/OrderCompleted";
import { NotificationScreen } from "./components/NotificationScreen";
import { useState } from "react";

export default function App() {
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const isMobile = useIsMobile();
//  the update about new codejsdkjashdkjashdkjahsdkjhaskjdh
  return (
    <BrowserRouter>
      
      <Routes>
        {/* Onboarding Flow */}
        <Route path="/" element={<SplashScreen onComplete={() => (window.location.href = "/intro")} />} />
        <Route path="/intro" element={<IntroSlides onComplete={() => (window.location.href = "/auth")} />} />
        <Route path="/auth" element={<LoginSignup onBack={() => (window.location.href = "/intro")} onComplete={() => (window.location.href = "/dashboard/home")} />} />

        {/* Dashboard with Tabs */}
        <Route
          path="/dashboard/*"
          element={
            isMobile ? (
              <div className="size-full relative">
                <Routes>
                  <Route path="home" element={<Dashboard onStartBooking={() => (window.location.href = "/booking")} onTrackOrder={(id) => (window.location.href = `/active-order/${id}`)} />} />
                  <Route path="orders" element={<OrdersScreen onTrackOrder={(id) => (window.location.href = `/active-order/${id}`)} />} />
                  <Route path="wallet" element={<WalletScreen />} />
                  <Route path="notifications" element={<NotificationScreen />} />
                  <Route path="profile" element={<ProfileScreen />} />
                  <Route path="*" element={<Navigate to="home" />} />
                </Routes>
                <BottomNavigation />
              </div>
            ) : (
              <div className="size-full relative flex">
                <Sidebar />
                <div className="flex-1">
                  <Routes>
                    <Route path="home" element={<Dashboard onStartBooking={() => (window.location.href = "/booking")} onTrackOrder={(id) => (window.location.href = `/active-order/${id}`)} />} />
                    <Route path="orders" element={<OrdersScreen onTrackOrder={(id) => (window.location.href = `/active-order/${id}`)} />} />
                    <Route path="wallet" element={<WalletScreen />} />
                    <Route path="notifications" element={<NotificationScreen />} />
                    <Route path="profile" element={<ProfileScreen />} />
                    <Route path="*" element={<Navigate to="home" />} />
                  </Routes>
                </div>
              </div>
            )
          }
        />

        {/* Booking & Orders */}
        <Route path="/booking" element={<BookingFlow onComplete={() => (window.location.href = "/active-order/123")} onCancel={() => (window.location.href = "/dashboard/home")} />} />
        <Route path="/active-order/:id" element={<ActiveOrder orderId={currentOrderId} onBack={() => (window.location.href = "/dashboard/orders")} onOrderComplete={() => (window.location.href = "/order-completed/123")} />} />
        <Route path="/order-completed/:id" element={<OrderCompleted orderId={currentOrderId} amount={150} onBack={() => (window.location.href = "/dashboard/orders")} onDone={() => (window.location.href = "/dashboard/orders")} />} />
      </Routes>
    </BrowserRouter>
  );
}
