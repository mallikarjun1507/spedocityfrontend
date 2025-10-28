import {
  Autocomplete,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { MapPin, Search } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface DropLocationProps {
  pickup: string;
  onNext: (dropoff: string) => void;
  onBack: () => void;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

export function DropLocation({ pickup, onNext }: DropLocationProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    // googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    googleMapsApiKey:'AIzaSyBHyUtxzdJUQjDk8up2cQDM1emSxgrjhIA',
    libraries: ["places"],
  });

  const handleNext = () => {
    const location = selectedLocation || searchText;
    if (location.trim()) {
      onNext(location);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newCenter = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCenter(newCenter);
          setMarkerPosition(newCenter);
          setSelectedLocation("Current Location");
        },
        () => alert("Unable to fetch location. Please enable GPS.")
      );
    } else {
      alert("Geolocation not supported by your browser.");
    }
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place && place.geometry && place.geometry.location) {
      const newPos = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setCenter(newPos);
      setMarkerPosition(newPos);
      setSelectedLocation(place.formatted_address || "Selected Location");
      setSearchText(place.formatted_address || "");
    }
  };

  const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setMarkerPosition(newPos);
      setSelectedLocation(
        `Lat: ${newPos.lat.toFixed(5)}, Lng: ${newPos.lng.toFixed(5)}`
      );
    }
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const pos = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setMarkerPosition(pos);
      setSelectedLocation(`Lat: ${pos.lat.toFixed(5)}, Lng: ${pos.lng.toFixed(5)}`);
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
                <p className="text-sm">{pickup}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">To</p>
                <p className="text-sm text-gray-400">
                  {selectedLocation || "Enter destination"}
                </p>
              </div>
            </div>
          </div>
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
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              }}
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
              <Input
                placeholder="Loading..."
                disabled
                className="pl-10 bg-gray-100"
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Continue Button */}
      <div className="p-6 bg-white border-t mt-auto">
        <Button
          onClick={handleNext}
          disabled={!selectedLocation && !searchText.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
