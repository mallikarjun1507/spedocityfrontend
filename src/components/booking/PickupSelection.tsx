import {
  Autocomplete,
  GoogleMap,
  Marker,
  useJsApiLoader
} from "@react-google-maps/api";
import {
  Briefcase,
  Clock,
  Home,
  MapPin,
  Search
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";

interface PickupSelectionProps {
  onNext: (pickup: string) => void;
  onBack: () => void;
}

const savedAddresses = [
  {
    id: 1,
    type: "home",
    label: "Home",
    address: "123 MG Road, Bangalore, Karnataka 560001",
    icon: Home
  },
  {
    id: 2,
    type: "work",
    label: "Work",
    address: "Tech Park, Whitefield, Bangalore, Karnataka 560066",
    icon: Briefcase
  }
];

const recentLocations = [
  "Koramangala 5th Block, Bangalore",
  "HSR Layout Sector 1, Bangalore",
  "Indiranagar 100 Feet Road, Bangalore"
];

const containerStyle = {
  width: "100%",
  height: "100%"
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946
};

export function PickupSelection({ onNext, onBack }: PickupSelectionProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"]
  });

  const handleNext = () => {
    const location = selectedLocation || searchText;
    if (location.trim()) onNext(location);
  };

  const selectAddress = (address: string) => setSelectedLocation(address);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newCenter = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setCenter(newCenter);
          setMarkerPosition(newCenter);
          setSelectedLocation("Current Location");
        },
        () => alert("Unable to fetch location. Please enable GPS.")
      );
    } else alert("Geolocation not supported by your browser.");
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place && place.geometry && place.geometry.location) {
      const newPos = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      setCenter(newPos);
      setMarkerPosition(newPos);
      setSelectedLocation(place.formatted_address || "Selected Location");
    }
  };

  const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setMarkerPosition(newPos);
      setSelectedLocation(
        `Lat: ${newPos.lat.toFixed(5)}, Lng: ${newPos.lng.toFixed(5)}`
      );
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-lg font-medium text-gray-800">Pickup Location</h1>
        </div>
      </div>

      {/* Google Map Section */}
      <div className="h-64 relative">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            onClick={(e) => {
              if (e.latLng) {
                const pos = {
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng()
                };
                setMarkerPosition(pos);
                setSelectedLocation(
                  `Lat: ${pos.lat.toFixed(5)}, Lng: ${pos.lng.toFixed(5)}`
                );
              }
            }}
          >
            <Marker
              position={markerPosition}
              draggable
              onDragEnd={handleMarkerDragEnd}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
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

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Search Bar */}
        <div className="bg-gray-50 px-6 pt-4 pb-3 border-b sticky top-0 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            {isLoaded ? (
              <Autocomplete
                onLoad={(ref) => (autocompleteRef.current = ref)}
                onPlaceChanged={handlePlaceChanged}
              >
                <Input
                  placeholder="Search for area, street name..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10 bg-white"
                />
              </Autocomplete>
            ) : (
              <Input
                placeholder="Loading search..."
                disabled
                className="pl-10 bg-gray-100"
              />
            )}
          </div>
        </div>

        {/* Scrollable Saved + Recent Locations */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Saved Addresses */}
            <div>
              <h2 className="text-sm mb-3 text-gray-600">Saved Addresses</h2>
              <div className="space-y-2">
                {savedAddresses.map((address) => (
                  <Card
                    key={address.id}
                    className={`bg-white border cursor-pointer transition-colors ${selectedLocation === address.address
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                    onClick={() => selectAddress(address.address)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <address.icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm mb-1">{address.label}</h3>
                          <p className="text-xs text-gray-600">
                            {address.address}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Locations */}
            <div>
              <h2 className="text-sm mb-3 text-gray-600">Recent Locations</h2>
              <div className="space-y-2">
                {recentLocations.map((location, index) => (
                  <Card
                    key={index}
                    className={`bg-white border cursor-pointer transition-colors ${selectedLocation === location
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                    onClick={() => selectAddress(location)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-6 bg-white border-t">
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
