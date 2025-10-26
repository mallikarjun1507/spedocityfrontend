import {
  Autocomplete,
  GoogleMap,
  Marker,
  useJsApiLoader
} from "@react-google-maps/api";
import { Briefcase, Clock, Home, MapPin, Search } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";

interface PickupSelectionProps {
  onNext: (pickup: string, lat?: number, lng?: number) => void; // ✅ updated
  onBack: () => void;
  initialPickup?: string;
}

const savedAddresses = [
  {
    id: 1,
    type: "home",
    label: "Home",
    address: "123 MG Road, Bangalore, Karnataka 560001",
    lat: 12.9716,
    lng: 77.5946,
    icon: Home
  },
  {
    id: 2,
    type: "work",
    label: "Work",
    address: "Tech Park, Whitefield, Bangalore, Karnataka 560066",
    lat: 12.969,
    lng: 77.75,
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

export function PickupSelection({ onNext, onBack, initialPickup }: PickupSelectionProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(initialPickup || "");
  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  // ✅ new: track selected lat/lng separately
  const [selectedLatLng, setSelectedLatLng] = useState<{ lat: number; lng: number } | null>(defaultCenter);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBHyUtxzdJUQjDk8up2cQDM1emSxgrjhIA", 
    libraries: ["places"]
  });

  // ✅ Reverse geocode to get address from lat/lng
  const fetchAddressFromLatLng = async (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    const response = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results) resolve(results);
        else reject(status);
      });
    }).catch(() => []);
    return response[0]?.formatted_address || `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
  };

  // ✅ Continue button now passes lat/lng
  const handleNext = () => {
    if (selectedLocation.trim()) {
      if (selectedLatLng) onNext(selectedLocation, selectedLatLng.lat, selectedLatLng.lng);
      else onNext(selectedLocation);
    }
  };

  // ✅ when selecting a saved address
  const selectAddress = async (addressObj: typeof savedAddresses[0]) => {
    setSelectedLocation(addressObj.address);
    const newPos = { lat: addressObj.lat, lng: addressObj.lng };
    setCenter(newPos);
    setMarkerPosition(newPos);
    setSelectedLatLng(newPos);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const newCenter = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setCenter(newCenter);
          setMarkerPosition(newCenter);
          setSelectedLatLng(newCenter);
          const address = await fetchAddressFromLatLng(newCenter.lat, newCenter.lng);
          setSelectedLocation(address);
        },
        () => alert("Unable to fetch location. Please enable GPS.")
      );
    } else alert("Geolocation not supported by your browser.");
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place && place.geometry?.location) {
      const newPos = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      setCenter(newPos);
      setMarkerPosition(newPos);
      setSelectedLatLng(newPos);
      setSelectedLocation(place.formatted_address || "");
    }
  };

  // ✅ Drag marker update
  const handleMarkerDragEnd = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const newPos = { lat, lng };
    setMarkerPosition(newPos);
    setCenter(newPos);
    setSelectedLatLng(newPos);
    const address = await fetchAddressFromLatLng(lat, lng);
    setSelectedLocation(address);
  }, []);

  // ✅ Click map update
  const handleMapClick = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const newPos = { lat, lng };
    setMarkerPosition(newPos);
    setCenter(newPos);
    setSelectedLatLng(newPos);
    const address = await fetchAddressFromLatLng(lat, lng);
    setSelectedLocation(address);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-lg font-medium text-gray-800">Pickup Location</h1>
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

        <Button
          onClick={handleUseCurrentLocation}
          className="absolute bottom-4 right-4 bg-white text-gray-900 shadow-md hover:bg-gray-50 cursor-pointer"
          size="sm"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Use Current Location
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-50 px-6 pt-4 pb-3 border-b sticky top-0 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          {isLoaded ? (
            <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={handlePlaceChanged}>
              <Input
                placeholder="Search for area, street name..."
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="pl-10 bg-white"
              />
            </Autocomplete>
          ) : (
            <Input placeholder="Loading search..." disabled className="pl-10 bg-gray-100" />
          )}
        </div>
      </div>

      {/* Saved + Recent */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-6">
          <div>
            <h2 className="text-sm mb-3 text-gray-600">Saved Addresses</h2>
            <div className="space-y-2">
              {savedAddresses.map((address) => (
                <Card
                  key={address.id}
                  className={`bg-white border cursor-pointer transition-colors ${
                    selectedLocation === address.address ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => selectAddress(address)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <address.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm mb-1">{address.label}</h3>
                        <p className="text-xs text-gray-600">{address.address}</p>
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
                  className={`bg-white border cursor-pointer transition-colors ${
                    selectedLocation === location ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedLocation(location)}
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

      {/* Continue */}
      <div style={{ padding: "16px", borderTop: "1px solid #ddd" }}>
        <Button
          onClick={handleNext}
          disabled={!selectedLocation.trim()}
          style={{
            width: "100%",
            padding: "12px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
