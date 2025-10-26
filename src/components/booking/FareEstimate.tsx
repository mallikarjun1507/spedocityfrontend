import { Info, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // ✅ Added code
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";

interface FareEstimateProps {
  pickup?: string;
  dropoff?: string;
  service?: string;
  helpers?: number;
  onNext?: (fareData: FareData) => void;
  onBack?: () => void;
}

interface FareData {
  basePrice: number;
  distancePrice: number;
  helperPrice: number;
  insurancePrice: number;
  totalPrice: number;
  hasInsurance: boolean;
  estimatedDistance: number;
  estimatedTime: string;
}

const FareEstimate: React.FC<FareEstimateProps> = ({
  pickup,
  dropoff,
  service,
  helpers = 0,
}) => {
  const [hasInsurance, setHasInsurance] = useState(false);

  // ✅ Added for data transfer
  const location = useLocation(); // ✅ Added
  const navigate = useNavigate(); // ✅ Added
  const { vehicle, item, helper, schedule } = location.state || {}; // ✅ Added

  // ✅ Added fallback to handle values from previous pages
  const currentPickup = pickup || location.state?.pickup || "Not Provided";
  const currentDropoff = dropoff || location.state?.dropoff || "Not Provided";
  const currentHelpers = helpers || (helper?.required ? 1 : 0);
  const currentService = service || vehicle?.name || "Vehicle";

  // Mock calculations
  const estimatedDistance = 12.5;
  const estimatedTime = "25-35 mins";
  const basePrice =
    currentService.toLowerCase().includes("bike")
      ? 49
      : currentService.toLowerCase().includes("auto")
      ? 89
      : currentService.toLowerCase().includes("truck")
      ? 199
      : 129;
  const distancePrice = Math.round(
    estimatedDistance *
      (currentService.toLowerCase().includes("bike")
        ? 3
        : currentService.toLowerCase().includes("auto")
        ? 5
        : 8)
  );
  const helperPrice = currentHelpers * 50;
  const insurancePrice = hasInsurance
    ? Math.round((basePrice + distancePrice) * 0.05)
    : 0;
  const totalPrice =
    basePrice + distancePrice + helperPrice + insurancePrice;

  // ✅ Updated handleNext with state passing logic
  const handleNext = () => {
    const finalData = {
      vehicle,
      item,
      helper,
      schedule,
      pickup: currentPickup,
      dropoff: currentDropoff,
      basePrice,
      distancePrice,
      helperPrice,
      insurancePrice,
      totalPrice,
      hasInsurance,
      estimatedDistance,
      estimatedTime,
    };

    // Pass data to Payment page
    navigate("/paymentpage", { state: finalData });

    // Optional: store locally
    localStorage.setItem("fareData", JSON.stringify(finalData));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-lg font-medium text-gray-800">Fare Estimate</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Route Details */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <h3 className="text-base mb-4">Route Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <div className="w-0.5 h-6 bg-gray-300 my-1" />
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-xs text-gray-500">From</p>
                      <p className="text-sm">{currentPickup}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">To</p>
                      <p className="text-sm">{currentDropoff}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="text-sm">{estimatedDistance} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="text-sm">{estimatedTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Service</p>
                    <p className="text-sm">{currentService}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insurance Option */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <Label htmlFor="insurance" className="text-sm">
                      Delivery Insurance
                    </Label>
                    <p className="text-xs text-gray-600">
                      Protect your items during delivery
                    </p>
                  </div>
                </div>
                <Switch
                  id="insurance"
                  checked={hasInsurance}
                  onCheckedChange={setHasInsurance}
                />
              </div>

              {hasInsurance && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="bg-blue-50 rounded-lg p-3 mt-3"
                >
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700">
                      <p className="mb-1">Coverage up to ₹10,000</p>
                      <p>Additional charge: ₹{insurancePrice}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Fare Breakdown */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <h3 className="text-base mb-4">Fare Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Base fare</span>
                  <span className="text-sm">₹{basePrice}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Distance ({estimatedDistance} km)
                  </span>
                  <span className="text-sm">₹{distancePrice}</span>
                </div>

                {currentHelpers > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Helper charges ({currentHelpers})
                    </span>
                    <span className="text-sm">₹{helperPrice}</span>
                  </div>
                )}

                {hasInsurance && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Insurance</span>
                    <span className="text-sm">₹{insurancePrice}</span>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-base">Total Amount</span>
                  <span className="text-lg text-green-600">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <h3 className="text-sm mb-2">💡 Important Notes</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Final amount may vary based on actual distance</li>
                <li>• Waiting charges apply after 5 minutes</li>
                <li>• Toll charges (if any) will be added</li>
                <li>• Cancellation free within 2 minutes of booking</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">Estimated Total:</span>
          <span className="text-lg text-green-600">₹{totalPrice}</span>
        </div>
         <div style={{ padding: "16px", borderTop: "1px solid #ddd" }}>
          <button
            onClick={handleNext}
          
            style={{
              width: "100%",
              padding: "12px",
              background: "#3b82f6", // blue color
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default FareEstimate;
