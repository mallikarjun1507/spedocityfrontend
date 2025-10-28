import axios from "axios";
import { ArrowLeft, Phone, RefreshCw, CheckCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from '../contexts/AuthContext';
import { URL } from "../URL";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Label } from './ui/label';

interface LoginSignupProps {
  onBack: () => void;
  onComplete: (token: string, userData: {
    userId: string;
    mobileNumber: string;
    userData: Object;
  }) => void;
}

type AuthStep = 'input' | 'otp-sent' | 'otp-verified';

export function LoginSignup({ onBack, onComplete }: LoginSignupProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [authStep, setAuthStep] = useState<AuthStep>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sessionId, setSessionId] = useState('');

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validatePhoneNumber = (number: string): boolean => {
    const cleanedNumber = number.replace(/\D/g, '');
    if (cleanedNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!/^\d+$/.test(cleanedNumber)) {
      toast.error("Phone number should contain only digits");
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) return;

    setIsLoading(true);
    try {
      const formattedNumber = `+91${phoneNumber}`;
      const response = await axios.post(`${URL}send-otp`, { number: formattedNumber });
      const data = response.data;
      setSessionId(data.sessionId);
      setIsLoading(false);
      setAuthStep("otp-sent");
      setCountdown(30);
      toast.success("OTP sent successfully");
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${URL}verify-otp`, { sessionId, otp });
      const data = response.data;

      if (data.success) {
        const { token, user_id, mobile_number, userData } = data.data;

        setIsLoading(false);
        setAuthStep("otp-verified");

        login(token, {
          userId: user_id,
          mobileNumber: mobile_number,
          userData,
        });

        setTimeout(() => {
          onComplete(token, {
            userId: user_id,
            mobileNumber: mobile_number,
            userData,
          });
        }, 1000);

        toast.success("OTP verified successfully");
        navigate("dashboard/home");
      } else {
        throw new Error(data.message || "Invalid OTP");
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || error.message || "Failed to verify OTP. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    try {
      const formattedNumber = `+91${phoneNumber}`;
      const response = await axios.post(`${URL}resend-otp`, { number: formattedNumber });
      const data = response.data;
      setSessionId(data.sessionId);
      setIsLoading(false);
      setCountdown(30);
      setOtp("");
      toast.success("OTP resent successfully");
    } catch (error: any) {
      setIsLoading(false);
      const message = error.response?.data?.message || error.message || "Failed to resend OTP. Please try again.";
      toast.error(message);
    }
  };

  const handleBackToInput = () => {
    setAuthStep('input');
    setOtp('');
    setCountdown(0);
    setSessionId('');
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    if (input.length <= 10) setPhoneNumber(input);
  };

  return (
    <div className="size-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        {authStep !== 'input' && (
          <Button variant="ghost" size="sm" className="cursor-pointer" onClick={handleBackToInput}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        <h1 className="text-xl text-center flex-1">
          {authStep === 'otp-sent' ? 'Verify Phone' :
           authStep === 'otp-verified' ? 'Success!' :
           'Welcome to Spedocity'}
        </h1>
        <div className="w-16" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <AnimatePresence mode="wait">
          {/* Input Step */}
          {authStep === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="Spedocity Logo" className="w-16 h-16 object-contain" />
                </div>
                <p className="text-gray-600">Sign in to start your Booking journey</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="9876543210"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className="bg-input-background"
                  disabled={isLoading}
                  maxLength={10}
                />
                <p className="text-xs text-gray-500">Enter your 10-digit phone number</p>
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={!phoneNumber || phoneNumber.length !== 10 || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : 'Send OTP'}
              </Button>

             <p className="text-center text-sm text-gray-500 mt-8">
                By continuing, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </motion.div>
          )}

          {/* OTP Sent Step */}
          {authStep === 'otp-sent' && (
            <motion.div
              key="otp-sent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl mb-2">Enter OTP</h2>
                <p className="text-gray-600">
                  We've sent a 6-digit code to<br />
                  <span className="font-medium text-gray-900">+91 {phoneNumber}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <div className="w-4" />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6 || isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : 'Verify OTP'}
                </Button>

                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-gray-500">Resend OTP in {countdown} seconds</p>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Resend OTP
                    </Button>
                  )}
                </div>

                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={handleBackToInput}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Change Phone Number
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* OTP Verified Step */}
          {authStep === 'otp-verified' && (
            <motion.div
              key="otp-verified"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto text-center space-y-6"
            >
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl mb-2">Verification Successful!</h2>
                <p className="text-gray-600">Welcome to Spedocity</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 