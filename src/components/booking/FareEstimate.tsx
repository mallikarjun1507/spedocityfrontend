import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FareEstimate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Extract data passed from VehicleSelection (including coordinates if available)
  const {
    pickupLocation = "Not Provided",
    dropLocation = "Not Provided",
    vehicleType = "Vehicle",
    vehicleIcon = "",
    tripFare = 0,
    gstRate = 0,
    gstAmount = 0,
    netFare = 0,
    coins = 0,
    distance = 0,
    duration = "",
    pickupCoords = null,
    dropCoords = null,
  } = location.state || {};

  const [coordinates] = useState({
    pickupLat: pickupCoords?.lat ?? null,
    pickupLng: pickupCoords?.lng ?? null,
    dropLat: dropCoords?.lat ?? null,
    dropLng: dropCoords?.lng ?? null,
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<"address" | "goods" | null>(null);
  const [selectedGoods, setSelectedGoods] = useState<string>("");

  const freeLoadingTime = 20;
  const timeAway = duration ? `${duration} away` : "Calculating...";

  useEffect(() => {
    console.group("🚚 FareEstimate Data Received");
    console.log("Pickup:", pickupLocation);
    console.log("Drop:", dropLocation);
    console.log("Vehicle:", vehicleType);
    console.log("Trip Fare:", tripFare);
    console.log("GST Rate:", gstRate);
    console.log("GST Amount:", gstAmount);
    console.log("Net Fare:", netFare);
    console.log("Coins:", coins);
    console.log("Distance:", distance);
    console.log("Duration:", duration);
    console.log("Coordinates (for internal use only):", coordinates);
    console.groupEnd();
  }, []);

  const openPopup = (type: "address" | "goods") => {
    if (type === "goods" && selectedGoods) {
      navigate("/paymentpage", {
        state: {
          pickupLocation,
          dropLocation,
          vehicleType,
          vehicleIcon,
          tripFare: Number(tripFare) || 0,
          gstRate: Number(gstRate) || 0,
          gstAmount: Number(gstAmount) || 0,
          netFare: Number(netFare) || 0,
          coins: Number(coins) || 0,
          selectedGoods,
          pickupCoords,
          dropCoords,

        },
      });
      return;
    }

    setPopupType(type);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setTimeout(() => setPopupType(null), 300);
  };

  const handlePopupOk = () => {
    closePopup();
  };

  const handleSelectGoods = (item: string) => {
    setSelectedGoods(item);
  };

  return (
    <div className="fareestimate-wrapper">
      <div className="fareestimate-container">
        {/* Header */}
        <header className="fareestimate-header">
          <button className="back-btn" onClick={() => navigate(-1)}></button>
          <h2 className="header-title">Review Booking</h2>
        </header>

        {/* Vehicle Card */}
        <div className="vehicle-card">
          <div className="vehicle-info">
            <img src={vehicleIcon} alt={vehicleType} className="vehicle-icon" />
            <div>
              <h3 className="vehicle-type">{vehicleType}</h3>
              <button
                onClick={() => openPopup("address")}
                className="view-address-btn"
              >
                View Address Details
              </button>
              <p className="loading-time">
                🕒 Free <span>{freeLoadingTime} mins</span> of loading/unloading
                time included.
              </p>
            </div>
          </div>
          <p className="time-away">{timeAway}</p>
        </div>

        {/* Offers Section */}
        <section className="offers-section">
          <h3 className="section-title">Offers and Discounts</h3>
          <button
            className="apply-coupon-btn"
            onClick={() => console.log("Apply Coupon clicked")}
          >
            Apply Coupon
          </button>
          <div className="coins-box">
            <p>Minimum 25 coins required</p>
            <p className="coins-text">
              ✨ You’ll get <span>{coins} coins</span> on this order ✨
            </p>
          </div>
        </section>

        {/* Fare Summary */}
        <section className="fare-summary-section">
          <h3 className="section-title">Fare Summary</h3>
          <div className="fare-row">
            <span>Trip Fare (incl. Tolls & GST)</span>
            <span>₹{tripFare.toFixed(2)}</span>
          </div>
          <div className="fare-row">
            <span>GST Charges (included in fare)</span>
            <span>₹{gstAmount.toFixed(2)}</span>
          </div>
          <div className="fare-row">
            <span>Net Fare</span>
            <span>₹{netFare}</span>
          </div>
          <div className="fare-row total">
            <span>Amount Payable (rounded)</span>
            <span>₹{Math.round(netFare)}</span>
          </div>
          <div className="gst-info">
            <p>
              Fare includes <span>{gstRate}% GST</span>. Add your GSTIN to claim
              input tax credit.
            </p>
            <a href="#" className="add-gstin-link">
              Add GSTIN
            </a>
          </div>
        </section>

        {/* Read Before Booking */}
        <section className="read-section">
          <h3 className="section-title">Read before Booking</h3>
          <ul className="read-list">
            <li>
              Fare includes {freeLoadingTime} mins free loading/unloading time.
            </li>
            <li>₹2.22/min for additional loading/unloading time.</li>
            <li>Fare may change if route or location changes.</li>
            <li>Parking charges to be paid by customer.</li>
            <li>Fare includes toll and permit charges, if any.</li>
            <li>We don’t allow overloading.</li>
          </ul>
        </section>
      </div>

      <footer className="fareestimate-footer">
        <button
          className="choose-goods-btn"
          onClick={() => openPopup("goods")}
        >
          {selectedGoods ? "Proceed to Payment" : "Choose Goods Type"}
        </button>
      </footer>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div
            className={`popup-bottom-sheet ${showPopup ? "open" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="popup-header">
              <h3 className="popup-title">
                {popupType === "address"
                  ? "Address Details"
                  : "Choose Goods Type"}
              </h3>
              <button className="popup-close-btn" onClick={closePopup}>
                ✖
              </button>
            </header>

            <div className="popup-content">
              {popupType === "address" ? (
                <>
                  <p>
                    <strong>Pickup:</strong> {pickupLocation}
                  </p>
                  <p>
                    <strong>Drop:</strong> {dropLocation}
                  </p>
                  <p>
                    <strong>Vehicle:</strong> {vehicleType}
                  </p>
                  {/* ✅ Latitude & Longitude intentionally hidden */}
                </>
              ) : (
                <>
                  <p>Select goods type:</p>
                  <ul className="goods-list">
                    {[
                      "Furniture",
                      "Electronics",
                      "Groceries",
                      "Construction Material",
                      "Household Items",
                    ].map((item) => (
                      <li
                        key={item}
                        className={`goods-item ${selectedGoods === item ? "selected" : ""
                          }`}
                        onClick={() => handleSelectGoods(item)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <button
              className={`popup-ok-btn ${popupType === "goods" && !selectedGoods ? "disabled" : ""
                }`}
              onClick={handlePopupOk}
              disabled={popupType === "goods" && !selectedGoods}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FareEstimate;
