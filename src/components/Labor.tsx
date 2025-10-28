import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

export default function Labor() {
  const navigate = useNavigate();
  const [laborCount, setLaborCount] = useState(2);

  useEffect(() => {
    // Reset global overflow in case parent/global style interferes
    document.body.style.overflow = 'unset';
    document.documentElement.style.overflow = 'unset';
  }, []);

  const laborSuggestions = [
    { count: 2, text: 'Small move - Studio/1BR', icon: '🏠' },
    { count: 4, text: 'Medium move - 2-3BR', icon: '🏡' },
    { count: 6, text: 'Large move - 4+BR', icon: '🏘️' },
    { count: 8, text: 'Full house/Office', icon: '🏢' },
  ];

  const handleNext = () => {
    console.log('Labor Count:', laborCount);
    navigate('/scheduleorder');
  };

  const styles : { [key: string]: React.CSSProperties } = {
    laborContainer: {
      height: '100vh', // forces the container to occupy the full viewport height
      overflowY: 'auto', // enables vertical scroll
      overflowX: 'hidden',
      background: 'linear-gradient(to bottom right, #bfdbfe, #fff, #ffedd5)',
      padding: '20px',
      WebkitOverflowScrolling: 'touch',
    },
    innerWrapper: {
      maxWidth: '100%',
      margin: '0 auto',
    },
    cardWrapper: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(28, 15, 217, 0.1)',
    },
    laborCountDisplay: {
      textAlign: 'center',
      padding: '40px 0',
    },
    laborNumberCircle: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '120px',
      height: '120px',
      borderRadius: '60px',
      background: '#2563eb',
      color: 'white',
      fontSize: '1.5rem',
      margin: '0 auto',
      marginBottom: '10px',
    },
    sliderLabels: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.8rem',
      color: '#6b7280',
    },
    quickSelectWrapper: {
      marginBottom: '20px',
    },
    quickSelectButtonContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
    },
    pricingInfo: {
      background: '#bfdbfe',
      borderRadius: '12px',
      padding: '15px',
      textAlign: 'center',
      marginBottom: '20px',
    },
    pricingFlex: {
      display: 'flex',
      marginLeft: '10px',
      marginRight: '10px',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px',

    },
    tipsBox: {
      background: '#dbeafe',
      border: '1px solid #bfdbfe',
      borderRadius: '12px',
      padding: '12px',
    },
    navButtonsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
    },
    backButton: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      background: 'white',
      cursor: 'pointer',
    },
    continueButton: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      background: '#2563eb',
      color: 'white',
      cursor: 'pointer',
    },
  };

  function quickSelectButton(selected: boolean): React.CSSProperties {
  return {
    flex: '1 1 150px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px',
    borderRadius: '12px',
    border: selected ? '2px solid #2563eb' : '1px solid #d1d5db',
    background: selected ? '#bfdbfe' : 'white',
    cursor: 'pointer',
  };
}

  return (
    <div style={styles.laborContainer}>
      <div style={styles.innerWrapper}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div style={styles.cardWrapper}>
            {/* Labor Count Display */}
            <div style={styles.laborCountDisplay}>
              <motion.div
                key={laborCount}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={styles.laborNumberCircle}
              >
                <div>
                  <div style={{ fontSize: '2.5rem' }}>{laborCount}</div>
                  <div style={{ fontSize: '0.8rem' }}>Laborers</div>
                </div>
              </motion.div>
              <p style={{ color: '#4b5563' }}>
                {laborCount === 1 ? '1 helper' : `${laborCount} helpers`} will assist with your move
              </p>
            </div>
            {/* Slider */}
            <div style={{ marginBottom: '20px' }}>
              <div style={styles.sliderLabels}>
                <span>Minimum (1)</span>
                <span>Maximum (10)</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={laborCount}
                onChange={(e) => setLaborCount(parseInt(e.target.value))}
                style={{ width: '100%', marginTop: '10px' }}
              />
            </div>
            {/* Quick Select */}
            <div style={styles.quickSelectWrapper}>
              <p style={{ marginBottom: '8px' }}>Quick Select:</p>
              <div style={styles.quickSelectButtonContainer}>
                {laborSuggestions.map((s) => (
                  <button
                    style={quickSelectButton(laborCount === s.count)}
                    onClick={() => setLaborCount(s.count)}
                    key={s.count}
                    type="button"
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{s.icon}</div>
                    <div style={{ textAlign: 'center', fontSize: '0.85rem' }}>
                      <div>{s.count} Laborers</div>
                      <div style={{ opacity: 0.8 }}>{s.text}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {/* Pricing Info */}
            <div style={styles.pricingInfo}>
              <h3 style={{ marginBottom: '10px' }}>💰 Estimated Labor Cost</h3>
              <div style={styles.pricingFlex}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Per Laborer</p>
                  <p>₹500/hour</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Total Laborers</p>
                  <p>{laborCount}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Estimated Cost</p>
                  <p style={{ color: '#2563eb' }}>₹{laborCount * 500}/hour</p>
                </div>
              </div>
            </div>
            {/* Tips Box */}
            <div style={styles.tipsBox}>
              <h4 style={{ marginBottom: '6px' }}>💡 Tips for choosing labor count</h4>
              <ul style={{ fontSize: '0.8rem', color: '#374151', paddingLeft: '20px', margin: 0 }}>
                <li>• More laborers = Faster move</li>
                <li>• Consider number of heavy items</li>
                <li>• Factor in stairs and distance</li>
                <li>• You can adjust this later if needed</li>
              </ul>
            </div>
          </div>
          {/* Navigation Buttons */}
          <div style={styles.navButtonsContainer}>
            <button
              onClick={() => navigate('/location-picker')}
              style={styles.backButton}
              type="button"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              style={styles.continueButton}
              type="button"
            >
              Continue →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
