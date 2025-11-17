import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowRight, ArrowLeft } from "lucide-react";

export default function OfficeShiftingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numberOfDesks: "",
    numberOfChairs: "",
    numberOfCabinets: "",
    numberOfComputers: "",
    numberOfPrinters: "",
    numberOfWhiteboards: "",
    additionalItems: "",
    specialInstructions: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    const hasItems = Object.entries(formData).some(([key, value]) => {
      if (key === "additionalItems" || key === "specialInstructions") return false;
      return value && parseInt(value) > 0;
    });

    if (!hasItems) {
      alert("Please enter at least one item quantity");
      return;
    }

    alert("Office items added successfully");
    navigate("/location-picker");
  };

  const handleBack = () => navigate("/");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-blue-600">
            Office Shifting Details
          </h3>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Progress Indicator */}
        <div className="mb-10 flex items-center justify-between">
          {["Items", "Location", "Labor", "Schedule"].map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${
                    i === 0 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`${
                    i === 0 ? "text-gray-900 font-medium" : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
              {i < 3 && <div className="flex-1 h-1 bg-gray-200 mx-4" />}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white shadow-md rounded-xl p-8 space-y-8 border border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Office Items Details
            </h2>
            <p className="text-gray-500 mt-1">
              Enter the number of items you need to move from your office.
            </p>
          </div>

          {/* Furniture Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Furniture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["numberOfDesks", "Number of Desks"],
                ["numberOfChairs", "Number of Chairs"],
                ["numberOfCabinets", "Number of Filing Cabinets"],
                ["numberOfWhiteboards", "Number of Whiteboards"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={(formData as any)[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Electronics Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Electronics & Equipment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["numberOfComputers", "Number of Computers/Monitors"],
                ["numberOfPrinters", "Number of Printers"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={(formData as any)[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Additional Items */}
          <section>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Additional Items (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="List any other items (e.g., conference tables, plants, etc.)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.additionalItems}
              onChange={(e) => handleInputChange("additionalItems", e.target.value)}
            />
          </section>

          {/* Special Instructions */}
          <section>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Special Instructions (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Any special handling requirements or notes"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.specialInstructions}
              onChange={(e) =>
                handleInputChange("specialInstructions", e.target.value)
              }
            />
          </section>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Items Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              {Object.entries(formData)
                .filter(
                  ([key, value]) =>
                    !["additionalItems", "specialInstructions"].includes(key) && value
                )
                .map(([key, value]) => (
                  <p key={key}>
                    {key.replace("numberOf", "").replace(/([A-Z])/g, " $1")}: {value}
                  </p>
                ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              onClick={handleBack}
              className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Next: Location <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
