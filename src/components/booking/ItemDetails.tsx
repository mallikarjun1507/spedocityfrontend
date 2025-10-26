import { Camera, Minus, Plus, X } from "lucide-react";
import { useState } from "react";
// ✅ Added code start
import { useLocation, useNavigate } from "react-router-dom";
// ✅ Added code end

interface ItemData {
  id: string;
  name: string;
  weight: number;
  isFragile: boolean;
  photos: string[];
}

const ITEM_OPTIONS = [
  "Laptop",
  "Books/Documents",
  "Clothes",
  "Electronics",
  "Groceries",
  "Furniture",
  "Other",
];

const ItemDetails = () => {
  // ✅ Added code start
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle, pickup, dropoff, fare, distance } = location.state || {};
  // ✅ Added code end

  const [items, setItems] = useState<ItemData[]>([
    { id: "1", name: "", weight: 1, isFragile: false, photos: [] },
  ]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: "",
        weight: 1,
        isFragile: false,
        photos: [],
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, updates: Partial<ItemData>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const updateWeight = (id: string, increment: boolean) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newWeight = increment
      ? Math.min(item.weight + 1, 100)
      : Math.max(item.weight - 1, 1);
    updateItem(id, { weight: newWeight });
  };

  const handlePhotoUpload = (id: string) => {
    const mockUrl = `https://via.placeholder.com/150?text=Photo${Date.now()}`;
    const item = items.find((i) => i.id === id);
    if (item && item.photos.length < 3)
      updateItem(id, { photos: [...item.photos, mockUrl] });
  };

  const removePhoto = (id: string, index: number) => {
    const item = items.find((i) => i.id === id);
    if (item)
      updateItem(id, { photos: item.photos.filter((_, i) => i !== index) });
  };

  const getTotalWeight = () => items.reduce((acc, i) => acc + i.weight, 0);
  const canContinue = () => items.every((i) => i.name.trim() !== "");

  // ✅ Added code start
  const handleNext = () => {
    const itemData = {
      pickup,
      dropoff,
      vehicle,
      fare,
      distance,
      items,
      totalWeight: getTotalWeight(),
      specialInstructions,
    };
    navigate("/helper-option", { state: itemData });
  };
  // ✅ Added code end

  return (
    <div className="item-details-container">
      <div className="header">
        <h1>Parcel Items</h1>
        {/* ✅ Added code start */}
        {vehicle && (
          <p style={{ fontSize: "14px", color: "#555" }}>
            Vehicle Selected: <b>{vehicle.name}</b> (₹{fare})
          </p>
        )}
        {/* ✅ Added code end */}
      </div>

      <div className="items-list">
        {items.map((item, idx) => (
          <div key={item.id} className="card">
            <div className="card-content">
              <div className="item-header">
                <h3>Item {idx + 1}</h3>
                {items.length > 1 && (
                  <button
                    className="remove-item-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="item-select">
                <label>Item Type *</label>
                <select
                  value={item.name}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                >
                  <option value="">Select Item</option>
                  {ITEM_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div className="weight-selector">
                <label>Weight</label>
                <div className="weight-controls">
                  <button
                    onClick={() => updateWeight(item.id, false)}
                    disabled={item.weight <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <div className="weight-display">{item.weight} kg</div>
                  <button
                    onClick={() => updateWeight(item.id, true)}
                    disabled={item.weight >= 100}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="fragile-toggle">
                <div>
                  <label>Fragile</label>
                  <p>Handle with care</p>
                </div>
                <input
                  type="checkbox"
                  checked={item.isFragile}
                  onChange={(e) =>
                    updateItem(item.id, { isFragile: e.target.checked })
                  }
                />
              </div>

              <div className="photos-container">
                {item.photos.map((p, i) => (
                  <div key={i} className="photo-item">
                    <img src={p} alt={`Photo ${i + 1}`} />
                    <button onClick={() => removePhoto(item.id, i)}>
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {item.photos.length < 3 && (
                  <div
                    className="add-photo-btn"
                    onClick={() => handlePhotoUpload(item.id)}
                  >
                    <Camera size={16} />
                    <span>Add</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <button className="add-item-btn" onClick={addItem}>
          <Plus size={14} /> Add Another Item
        </button>

        <div className="card special-instructions">
          <div className="card-content">
            <label>Special Instructions (Optional)</label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>
        </div>

        <div className="summary-card">
          <div>
            <p>Total Items: {items.length}</p>
            <p>Total Weight: {getTotalWeight()} kg</p>
          </div>
          <div>
            <p>Fragile Items</p>
            <p>{items.filter((i) => i.isFragile).length}</p>
          </div>
        </div>
      </div>

      {/* ✅ Added code start */}
      <div style={{ padding: "16px", borderTop: "1px solid #ddd" }}>
        <button
          onClick={handleNext}
          disabled={!canContinue()}
          style={{
            width: "100%",
            padding: "12px",
            background: canContinue() ? "#3b82f6" : "#a5b4fc",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: canContinue() ? "pointer" : "not-allowed",
          }}
        >
          Continue 
        </button>
      </div>
      
    </div>
  );
};

export default ItemDetails;
