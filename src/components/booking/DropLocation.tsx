import {
  Autocomplete,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { MapPin, Search } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface DropLocationProps {
  pickup: string;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

export function DropLocation({ pickup }: DropLocationProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [distanceInfo, setDistanceInfo] = useState<{
    distanceText: string;
    durationText: string;
    price: number;
  } | null>(null);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBHyUtxzdJUQjDk8up2cQDM1emSxgrjhIA",
    libraries: ["places"],
  });

  // Pricing configuration
  const BASE_PRICE = 50; // ₹ base fare
  const PRICE_PER_KM = 15; // ₹ per km

  // 🔹 Reverse geocode lat/lng to address
  const fetchAddressFromLatLng = async (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    const results = await new Promise<google.maps.GeocoderResult[]>((resolve) => {
      geocoder.geocode({ location: { lat, lng } }, (res, status) => {
        if (status === "OK" && res) resolve(res);
        else resolve([]);
      });
    });
    return results[0]?.formatted_address || `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
  };

  // 🔹 Get Distance and Duration using Google Distance Matrix API
  const fetchDistanceAndTime = async (origin: string, destination: string) => {
    try {
      const service = new google.maps.DistanceMatrixService();
      const response = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
          },
          (res, status) => {
            if (status === "OK" && res) resolve(res);
            else reject(status);
          }
        );
      });

      const element = response.rows[0].elements[0];
      const distanceText = element.distance?.text || "0 km";
      const durationText = element.duration?.text || "0 mins";
      const distanceValue = element.distance?.value || 0; // in meters

      return { distanceText, durationText, distanceValue };
    } catch (err) {
      console.error("Distance Matrix Error:", err);
      return null;
    }
  };

  // ✅ Handle Continue (Calculate distance + price, then navigate)
  const handleNext = async () => {
    if (selectedLocation.trim()) {
      const distanceData = await fetchDistanceAndTime(pickup, selectedLocation);

      if (distanceData) {
        const distanceInKm = distanceData.distanceValue / 1000;
        const totalPrice = BASE_PRICE + distanceInKm * PRICE_PER_KM;

        setDistanceInfo({
          distanceText: distanceData.distanceText,
          durationText: distanceData.durationText,
          price: totalPrice,
        });

        // Save in localStorage (optional)
        localStorage.setItem("drop", selectedLocation);

        // Navigate with all dynamic data
        navigate("/vehicleSelection", {
          state: {
            pickup,
            drop: selectedLocation,
            distance: distanceData.distanceText,
            duration: distanceData.durationText,
            totalPrice: totalPrice.toFixed(2),
          },
        });
      } else {
        alert("Unable to calculate distance. Please try again.");
      }
    }
  };

  // 📍 Use current GPS location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const newCenter = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCenter(newCenter);
          setMarkerPosition(newCenter);
          const address = await fetchAddressFromLatLng(newCenter.lat, newCenter.lng);
          setSelectedLocation(address);
          setSearchText(address);
        },
        () => alert("Unable to fetch location. Please enable GPS.")
      );
    } else alert("Geolocation not supported by your browser.");
  };

  // 📍 Handle place selected from autocomplete
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place && place.geometry && place.geometry.location) {
      const newPos = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
      setCenter(newPos);
      setMarkerPosition(newPos);
      const address = place.formatted_address || "Selected Location";
      setSelectedLocation(address);
      setSearchText(address);
    }
  };

  // 📍 Handle marker drag
  const handleMarkerDragEnd = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPosition(pos);
      const address = await fetchAddressFromLatLng(pos.lat, pos.lng);
      setSelectedLocation(address);
      setSearchText(address);
    }
  }, []);

  // 📍 Handle map click
  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPosition(pos);
      setCenter(pos);
      const address = await fetchAddressFromLatLng(pos.lat, pos.lng);
      setSelectedLocation(address);
      setSearchText(address);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-center">
          <h1 className="text-lg font-semibold text-gray-800">Drop Location</h1>
        </div>

        {/* Route Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div className="w-0.5 h-8 bg-gray-300 my-1" />
              <div className="w-3 h-3 bg-red-500 rounded-full" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-gray-500">From</p>
                <p className="text-sm">{pickup || "Pickup not selected"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">To</p>
                <p className="text-sm text-gray-400">
                  {selectedLocation || "Enter destination"}
                </p>
              </div>
            </div>
          </div>

          {/* 🧭 Live distance info */}
          {distanceInfo && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                🚗 Distance: <strong>{distanceInfo.distanceText}</strong>
              </p>
              <p className="text-sm text-gray-700">
                ⏱️ Duration: <strong>{distanceInfo.durationText}</strong>
              </p>
              <p className="text-sm text-gray-700">
                💰 Estimated Price: <strong>₹{distanceInfo.price.toFixed(2)}</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Google Map */}
      <div className="h-64 relative">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            onClick={handleMapClick}
          >
            <Marker
              position={markerPosition}
              draggable
              onDragEnd={handleMarkerDragEnd}
              icon={{ url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
            />
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading map...
          </div>
        )}

        {/* Use Current Location Button */}
        <Button
          onClick={handleUseCurrentLocation}
          className="absolute bottom-4 right-4 bg-white text-gray-900 shadow-md hover:bg-gray-50"
          size="sm"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Use Current Location
        </Button>
      </div>

      {/* Search Input */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            {isLoaded ? (
              <Autocomplete
                onLoad={(ref) => (autocompleteRef.current = ref)}
                onPlaceChanged={handlePlaceChanged}
              >
                <Input
                  placeholder="Enter drop location..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10 bg-white"
                  autoFocus
                />
              </Autocomplete>
            ) : (
              <Input placeholder="Loading..." disabled className="pl-10 bg-gray-100" />
            )}
          </div>
        </motion.div>
      </div>

      {/* Continue Button */}
      <div className="p-6 bg-white border-t mt-auto">
        <Button
          onClick={handleNext}
          disabled={!selectedLocation.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
          style={{
            width: "100%",
            padding: "12px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
