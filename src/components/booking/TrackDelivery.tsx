import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface DriverLocation {
  lat: number;
  lng: number;
}

export function TrackDelivery() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);

  // Mock: poll driver location every 5 sec (replace with WebSocket in real app)
  useEffect(() => {
    const interval = setInterval(() => {
      // In real app → fetch(`/api/driver-location/${bookingId}`)
      // Example mock movement:
      setDriverLocation({
        lat: 12.9716 + Math.random() * 0.01, // Bengaluru base + random offset
        lng: 77.5946 + Math.random() * 0.01,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [bookingId]);

  return (
    <div className="h-screen w-full">
      <h2 className="text-center font-bold mt-4">Tracking Booking #{bookingId}</h2>
      {driverLocation ? (
        <iframe
          title="Driver Location"
          width="100%"
          height="90%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps?q=${driverLocation.lat},${driverLocation.lng}&z=15&output=embed`}
        />
      ) : (
        <p className="text-center mt-6">Fetching driver location...</p>
      )}
    </div>
  );
}
