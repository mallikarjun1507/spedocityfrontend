import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { motion } from "motion/react";

interface OtpConfirmationProps {
  bookingId: string;
  onNext: () => void;
  onBack: () => void;
  phoneNumber?: string;
}

export function OtpConfirmation({
  bookingId,
  onNext,
  onBack,
  phoneNumber,
}: OtpConfirmationProps) {
  const [enteredOtp, setEnteredOtp] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  // Countdown timer for resend
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    if (cooldown > 0) {
      t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [cooldown]);

  const handleVerify = () => {
    setError("");

    if (!/^\d{6}$/.test(enteredOtp)) {
      setError("Enter a valid 6-digit OTP");
      return;
    }

    // ✅ Universal OTP check
    if (enteredOtp === "123456") {
      onNext();
    } else {
      setAttempts((a) => a + 1);
      setError("Invalid OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      // Example API call in real app:
      // await fetch(`/api/orders/${bookingId}/resend-otp`, { method: "POST" });

      setResendMessage("OTP resent (mock). Check your phone.");
      setCooldown(30); // 30s cooldown
    } catch (err) {
      setResendMessage("Failed to resend OTP. Try later.");
    }

    const msgTimer = setTimeout(() => setResendMessage(null), 5000);
    return () => clearTimeout(msgTimer);
  };

  // ✅ Auto-verify if 6 digits entered
  useEffect(() => {
    if (enteredOtp.length === 6) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enteredOtp]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold text-center mb-4">Confirm Your Booking</h2>

      <p className="text-sm text-gray-600 text-center mb-4">
        Enter the OTP sent to{" "}
        <span className="font-medium">{phoneNumber ?? "your phone"}</span>
      </p>

      <div className="mb-3">
        <Input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={enteredOtp}
          onChange={(e) =>
            setEnteredOtp(e.target.value.replace(/\D/g, ""))
          }
          placeholder="Enter 6-digit OTP"
          className="text-center text-xl tracking-widest"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={handleVerify} className="flex-1">
          Verify & Continue
        </Button>
      </div>

      <div className="text-center mt-4 text-xs text-gray-500">
        <div>
          Booking ID: <span className="font-medium">{bookingId || "—"}</span>
        </div>
        <div className="mt-2">
          <button
            onClick={handleResend}
            disabled={cooldown > 0}
            className={`underline text-sm ${
              cooldown > 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
          </button>
        </div>
        {resendMessage && (
          <div className="mt-2 text-green-600 text-sm">{resendMessage}</div>
        )}
      </div>
    </motion.div>
  );
}
