import React, { useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Home } from "lucide-react";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top and ensure layout is reset properly
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "unset";
  }, []);

  // Retrieve previous booking info if passed via navigate state
  const bookingData = location.state || {
    scheduleType: "Now",
    date: new Date().toLocaleDateString(),
    from: "Bangalore",
    to: "Mysore",
    laborCount: 3,
    totalItems: 4,
    verificationVisit: false,
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      minHeight: "100vh",
      width: "100%",
      background: "linear-gradient(to bottom right, #bfdbfe, #ffffff, #ffedd5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    card: {
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      border: "1px solid #eee",
      padding: "40px 30px",
      maxWidth: "500px",
      width: "100%",
      textAlign: "center",
      color: "#1e293b",
    },
    title: {
      fontSize: "22px",
      fontWeight: 700,
      color: "#2563eb",
      marginTop: "10px",
    },
    details: {
      textAlign: "left",
      background: "#f8fafc",
      borderRadius: "12px",
      padding: "20px",
      marginTop: "20px",
      fontSize: "15px",
      color: "#334155",
      lineHeight: "1.8",
    },
    label: {
      fontWeight: 600,
      color: "#0f172a",
    },
    navButtons: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "30px",
    },
    navBtn: {
      border: "1px solid #ccc",
      background: "#fff",
      padding: "10px 20px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    primaryBtn: {
      background: "#2563eb",
      color: "white",
      border: "none",
    },
  };

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.card}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
        >
          <CheckCircle2 size={90} color="#16a34a" className="mx-auto text-green-600"/>
        </motion.div>

        <h2 style={styles.title}>Booking Confirmed!</h2>
        <p style={{ marginTop: "8px", color: "#475569" }}>
          Your move has been successfully scheduled.
        </p>

        <div style={styles.details}>
          <p>
            <span style={styles.label}>From:</span> {bookingData.from}
          </p>
          <p>
            <span style={styles.label}>To:</span> {bookingData.to}
          </p>
          <p>
            <span style={styles.label}>Move Type:</span> {bookingData.scheduleType}
          </p>
          <p>
            <span style={styles.label}>Date:</span> {bookingData.date}
          </p>
          <p>
            <span style={styles.label}>Laborers:</span> {bookingData.laborCount} helpers
          </p>
          <p>
            <span style={styles.label}>Total Items:</span> {bookingData.totalItems}
          </p>
          <p>
            <span style={styles.label}>Verification Visit:</span>{" "}
            {bookingData.verificationVisit ? "Requested" : "Not Requested"}
          </p>
        </div>

        <div style={styles.navButtons}>
          <button
            style={styles.navBtn}
            onClick={() => navigate(-1)} // 👈 go back to previous path
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button
            style={{ ...styles.navBtn, ...styles.primaryBtn }}
            onClick={() => navigate("/")}
          >
            <Home size={16} /> Finish
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingConfirmation;
