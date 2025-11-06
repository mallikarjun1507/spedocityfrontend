import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Vehicle {
  id: number;
  name: string;
  rate: number;
  basePrice: number;
  image: string;
}

interface VehicleSelectionState {
  pickup: string;
  drop: string;
  pickupCoords?: { lat: number; lng: number };
  dropCoords?: { lat: number; lng: number };
  distance?: string;
  duration?: string;
  totalPrice?: string;
}

const VehicleSelection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as VehicleSelectionState;

  const pickup = state?.pickup || "";
  const dropoff = state?.drop || "";
  const pickupCoords = state?.pickupCoords;
  const dropCoords = state?.dropCoords;

  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const vehicleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const vehicles: Vehicle[] = [
    { id: 1, name: "2 Wheeler", rate: 10, basePrice: 30, image: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png" },
    { id: 2, name: "Scooter", rate: 12, basePrice: 35, image: "https://cdn-icons-png.flaticon.com/512/179/179557.png" },
    { id: 3, name: "Pickup 9ft", rate: 18, basePrice: 50, image: "https://cdn-icons-png.flaticon.com/512/743/743131.png" },
    { id: 4, name: "3 Wheeler", rate: 15, basePrice: 45, image: "https://cdn-icons-png.flaticon.com/512/620/620013.png" },
    { id: 5, name: "17ft Truck", rate: 25, basePrice: 70, image: "https://cdn-icons-png.flaticon.com/512/743/743131.png" },
  ];

  const fetchDistance = async () => {
    console.log(" Pickup:", pickup, pickupCoords);
    console.log(" Dropoff:", dropoff, dropCoords);

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      console.log(" Using API Key:", apiKey ? "Loaded " : "Missing ");

      let originsParam = pickup;
      let destinationsParam = dropoff;

      // 🟩 If coordinates available, use them (more accurate)
      if (pickupCoords && dropCoords) {
        originsParam = `${pickupCoords.lat},${pickupCoords.lng}`;
        destinationsParam = `${dropCoords.lat},${dropCoords.lng}`;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
          originsParam
        )}&destinations=${encodeURIComponent(destinationsParam)}&key=${apiKey}`
      );

      const data = await response.json();
      console.log("📦 Distance Matrix API Response:", data);

      if (data.rows?.[0]?.elements?.[0]?.status === "OK") {
        const distMeters = data.rows[0].elements[0].distance.value;
        const durText = data.rows[0].elements[0].duration.text;
        const km = Number((distMeters / 1000).toFixed(2));

        console.log(` Distance: ${km} km`);
        console.log(` Duration: ${durText}`);

        setDistance(km);
        setDuration(durText);
      } else {
        console.warn(" Invalid API response. Using default values.");
        setDistance(10);
        setDuration("20 mins");
      }
    } catch (err) {
      console.error(" Error fetching distance:", err);
      setDistance(10);
      setDuration("20 mins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistance();
  }, [pickup, dropoff, pickupCoords, dropCoords]);

  const calculateFare = (vehicle: Vehicle) => {
    if (!distance) return "—";
    const fare = (vehicle.basePrice + vehicle.rate * distance).toFixed(2);
    console.log(` Calculated Fare for ${vehicle.name}: ₹${fare}`);
    return fare;
  };

  const handleSelectVehicle = (vehicle: Vehicle, index: number) => {
    console.log(" Vehicle Selected:", vehicle);
    setSelectedVehicle(vehicle);
    const element = vehicleRefs.current[index];
    if (element && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const offsetTop = element.offsetTop - container.offsetTop - 20;
      container.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  const handleProceed = () => {
    if (!selectedVehicle || !distance) {
      console.warn(" Please select a vehicle first!");
      return;
    }

    const tripFare = Number(calculateFare(selectedVehicle));
    const gstRate = 18;
    const gstAmount = Number((tripFare * (gstRate / 100)).toFixed(2));
    const netFare = tripFare;

    const payload = {
      pickupLocation: pickup,
      dropLocation: dropoff,
      pickupCoords,
      dropCoords,
      vehicleType: selectedVehicle.name,
      vehicleIcon: selectedVehicle.image,
      tripFare,
      gstRate,
      gstAmount,
      netFare,
      coins: 2,
      distance,
      duration,
    };

    console.log(" Proceeding to FareEstimate with data:", payload);

    navigate("/fare-estimate", { state: payload });
  };

  if (loading)
    return <div className="p-6 text-center text-gray-600">Calculating distance...</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white shadow p-4 sticky top-0 z-10">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Select Vehicle</h2>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex items-start mb-3">
            <div className="w-3 h-3 rounded-full bg-green-500 mt-2 mr-3"></div>
            <div>
              <p className="font-medium text-gray-700">Pickup</p>
              <p className="text-gray-600 text-sm">{pickup}</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-3 h-3 rounded-full bg-red-500 mt-2 mr-3"></div>
            <div>
              <p className="font-medium text-gray-700">Drop</p>
              <p className="text-gray-600 text-sm">{dropoff}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="overflow-y-auto p-4 space-y-3"
        style={{
          height: "calc(100vh - 128px)",
          paddingBottom: "160px",
        }}
      >
        {vehicles.map((v, index) => (
          <div
            key={v.id}
            ref={(el) => (vehicleRefs.current[index] = el)}
            onClick={() => handleSelectVehicle(v, index)}
            className={`relative flex items-center justify-between p-4 rounded-xl shadow cursor-pointer transition ${
              selectedVehicle?.id === v.id
                ? "bg-blue-100 border-2 border-blue-400"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="absolute top-3 right-4 text-right">
              <p className="text-lg font-semibold text-blue-600">₹{calculateFare(v)}</p>
              {distance && duration && (
                <>
                  <p className="text-xs text-gray-700">{distance} km</p>
                  <p className="text-xs text-gray-700">{duration}</p>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <img src={v.image} alt={v.name} className="w-14 h-14 object-contain" />
              <div>
                <p className="font-semibold text-gray-800">{v.name}</p>
                <p className="text-gray-600 text-sm">Base: ₹{v.basePrice} · ₹{v.rate}/km</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={handleProceed}
          disabled={!selectedVehicle}
          className={`w-full py-3 rounded-lg text-white text-lg font-semibold transition ${
            selectedVehicle ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {selectedVehicle
            ? `Proceed with ${selectedVehicle.name} (₹${calculateFare(selectedVehicle)})`
            : "Select a Vehicle"}
        </button>
      </div>
    </div>
  );
};

export default VehicleSelection;
