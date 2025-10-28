import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const shiftingGifUrl = "https://media.giphy.com/media/UkFZ0JrrD1Xe8TliHY/giphy.gif";

const roomTabs = [
  { id: "living", text: "Living Room", icon: "🛋️" },
  { id: "kitchen", text: "Kitchen", icon: "🍳" },
  { id: "bathroom", text: "Bathroom", icon: "🛁" },
  { id: "bedroom", text: "Bedroom", icon: "🛏️" },
  { id: "others", text: "Others", icon: "📦" }
];

const quickItems = {
  living: ["Sofa", "TV", "Coffee Table", "Bookshelf", "Lamp", "Armchair", "Rug", "Plant"],
  kitchen: ["Microwave", "Refrigerator", "Dish Rack", "Cookware"],
  bathroom: ["Mirror", "Bath Mat", "Laundry Basket", "Toiletry Bin"],
  bedroom: ["Bed", "Dresser", "Wardrobe", "Nightstand"],
  others: ["Desk", "Chair", "Shoe Rack", "Printer"]
};

const ItemsManagerNewUI = () => {
  const [activeTab, setActiveTab] = useState("living");
  const [customItem, setCustomItem] = useState("");
  const [fragileName, setFragileName] = useState("");
  const [fragilePhotoUrl, setFragilePhotoUrl] = useState<string | null>(null);
  const [items, setItems] = useState<{ [key: string]: string[] }>({
    living: [], kitchen: [], bathroom: [], bedroom: [], others: [],
  });
  const [fragileItems, setFragileItems] = useState<{ name: string, photo?: string | null }[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const navigate = useNavigate();

  const totalItems = Object.values(items).reduce((a,b)=>a+b.length,0) + fragileItems.length;

  function toggleItem(item:string){
    setItems(prev=>{
      const arr = prev[activeTab].includes(item)
        ? prev[activeTab].filter(i=>i!==item)
        : [...prev[activeTab], item];
      return {...prev,[activeTab]:arr};
    });
  }

  function handleCustomAdd(){
    const trimmed = customItem.trim();
    if(trimmed && !items[activeTab].includes(trimmed)){
      setItems(prev=>({...prev,[activeTab]:[...prev[activeTab], trimmed]}));
    }
    setCustomItem("");
  }

  function handleRemoveCustom(item:string){
    setItems(prev=>({...prev,[activeTab]:prev[activeTab].filter(i=>i!==item)}));
  }

  function handleFragileAdd() {
  if (!fragileName.trim()) return;
  
  // Cache current photo URL to a variable
  const currentPhotoUrl = fragilePhotoUrl;

  // Add the fragile item with the cached photo URL
  setFragileItems(prev => [...prev, { name: fragileName, photo: currentPhotoUrl }]);

  // Reset the input states afterward
  setFragileName("");
  setFragilePhotoUrl(null);
}

  function handleRemoveFragile(idx:number){
    setFragileItems(prev=>prev.filter((_,i)=>i!==idx));
  }

  function isChecked(item:string){ return items[activeTab].includes(item); }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0] ?? null;
  if (file) {
    setFragilePhotoUrl(URL.createObjectURL(file));
  } else {
    setFragilePhotoUrl(null);
  }
}


  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',width:'100vw',overflow:'hidden',background:'#f0f4f8'}}>
      
      {/* Header */}
      <div style={{position:'relative',flexShrink:0,padding:'15px',textAlign:'center',background:'#fff',boxShadow:'0 2px 6px rgba(0,0,0,0.1)'}}>
        <img src={shiftingGifUrl} alt="gif" style={{position:'absolute',top:'-15px',right:'10px',width:'100px',opacity:0.7}}/>
        <h2 style={{fontSize:'1.5rem',color:'#1e3a8a',margin:0}}> Home Shifting Made Simple!</h2>
        <p style={{fontSize:'0.85rem',color:'#374151',marginTop:'4px'}}>Plan your move, add items room-wise, and specify fragile things below.</p>
      </div>

      {/* Total Items */}
      <div style={{padding:'6px 12px',textAlign:'center',background:'#e0f2fe',color:'#1e3a8a',fontWeight:500}}>
        Total Items Selected: {totalItems}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: '6px', justifyContent: 'center', marginBottom: '12px', marginTop: '10px' }}>
        {roomTabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px',
            background: activeTab === tab.id ? '#fff' : '#dbeafe',
            color: activeTab === tab.id ? '#1e3a8a' : '#374151',
            border: 'none', flexShrink: 0, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500
          }}>
            <span>{tab.icon}</span> {tab.text}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div style={{flex:1,overflowY:'auto',padding:'10px'}}>
        {/* Quick Items */}
        <div style={{display:'flex',flexDirection: 'column',gap:'8px'}}>
          {(quickItems as any)[activeTab]?.map((item:string)=>(
            <label key={item} style={{
              display:'flex',alignItems:'center',gap:'6px',padding:'6px 10px',borderRadius:'6px',background:'#fff',border:'1px solid #e5e7eb',minWidth:'120px',cursor:'pointer'
            }}>
              <input type="checkbox" checked={isChecked(item)} onChange={()=>toggleItem(item)} style={{accentColor:'#3b82f6'}}/>
              <span>{item}</span>
              <button type="button" onClick={()=>toggleItem(item)} style={{border:'none',background:'none',marginLeft:'auto',color:'#3b82f6',cursor:'pointer'}}> {isChecked(item)?'×':'+'} </button>
            </label>
          ))}
        </div>

        {/* Custom Add */}
        <div style={{display:'flex',gap:'6px',marginTop:'10px'}}>
          <input type="text" value={customItem} onChange={e=>setCustomItem(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter') handleCustomAdd();}}
            placeholder="Add custom item..." style={{flexGrow:1,padding:'10px',borderRadius:'6px',border:'1px solid #cbd5e1',outline:'none'}}
          />
          <button onClick={handleCustomAdd} style={{background:'#3d21f4ff',color:'#fff',borderRadius:'50%',width:'36px',height:'36px',border:'none',cursor:'pointer'}}>+</button>
        </div>

        {/* Custom Items */}
        <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginTop:'8px'}}>
          {items[activeTab].map((item,idx)=>(<div key={idx} style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 10px',borderRadius:'6px',background:'#e0f2fe',border:'1px solid #bae6fd'}}>
            <input type="checkbox" checked readOnly />
            <span>{item}</span>
            <button onClick={()=>handleRemoveCustom(item)} style={{border:'none',background:'none',color:'#1e40af',cursor:'pointer'}}>×</button>
          </div>))}
        </div>

        {/* Fragile Section */}
        <div style={{marginTop:'12px',padding:'12px',borderRadius:'12px',background:'#fff8f2',border:'1px solid #ffd9b8'}}>
          <h3 style={{margin:0,fontSize:'0.95rem',fontWeight:600,color:'#b45309'}}>⚠️ Fragile Items (Extra Care)</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginTop:'6px'}}>
            <input type="text" value={fragileName} onChange={e=>setFragileName(e.target.value)}
              placeholder="e.g., Crystal Vase" style={{flex:'1 1 150px',padding:'8px',borderRadius:'6px',border:'1px solid #f9c178'}}
            />
            <input type="file" accept="image/*" onChange={handleFileChange} style={{padding:'4px',borderRadius:'4px',border:'1px solid #ffe4b5'}}/>
            {fragilePhotoUrl && <img onClick={()=>setLightboxImage(fragilePhotoUrl)} src={fragilePhotoUrl} alt="fragile" style={{width:'40px',height:'40px',objectFit:'cover',borderRadius:'6px',cursor:'pointer'}}/>}
          </div>
          <button onClick={handleFragileAdd} style={{marginTop:'6px',padding:'6px 10px',borderRadius:'8px',border:'none',background:'#3d21f4ff',color:'#fff',cursor:'pointer'}}>Add Fragile Item</button>

          {/* Fragile Items List */}
          {fragileItems.length>0 && (
            <div style={{display:'flex',overflowX:'auto',gap:'6px',marginTop:'8px'}}>
              {fragileItems.map((item,idx)=>(
                <div key={idx} style={{display:'flex',alignItems:'center',gap:'4px',padding:'6px 8px',borderRadius:'8px',background:'#fff',border:'1px solid #ffd983'}}>
                  <span>{item.name}</span>
                  {item.photo && <img onClick={()=>setLightboxImage(item.photo)} src={item.photo} alt="fragile" style={{width:'30px',height:'30px',objectFit:'cover',borderRadius:'4px',cursor:'pointer'}}/>}
                  <button onClick={()=>handleRemoveFragile(idx)} style={{border:'none',background:'none',color:'#f00',cursor:'pointer'}}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Continue Button */}
      <div style={{flexShrink:0,padding:'8px',background:'#f9fafb',display:'flex',justifyContent:'flex-end'}}>
        <button onClick={()=>navigate("/location-picker")}
          style={{padding:'6px 12px',borderRadius:'12px',border:'none',background:'#3d21f4ff',color:'#fff',cursor:'pointer'}}>Next →</button>
      </div>

      {/* Lightbox Preview */}
      {lightboxImage && (
        <div onClick={()=>setLightboxImage(null)} style={{
          position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.7)',
          display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,cursor:'pointer'
        }}>
          <img src={lightboxImage} alt="preview" style={{maxWidth:'90%',maxHeight:'90%',borderRadius:'8px'}}/>
        </div>
      )}
    </div>
  );
}

export default ItemsManagerNewUI;
