import axios from "axios";
import { ArrowLeft, CheckCircle, Mail, Phone, RefreshCw } from 'lucide-react';
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
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// Interface fix: onComplete expects 2 parameters now
interface LoginSignupProps {
  onBack: () => void;
  onComplete: (token: string, userData: { userId: string; mobileNumber: string }) => void;
}

type AuthStep = 'input' | 'otp-sent' | 'otp-verified' | 'google-auth';

export function LoginSignup({ onBack, onComplete }: LoginSignupProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [authStep, setAuthStep] = useState<AuthStep>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [activeAuthMethod, setActiveAuthMethod] = useState<'phone' | 'email' | 'google' | null>(null);
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
    if (!phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      return;
    }
    setIsLoading(true);
    setActiveAuthMethod("phone");
    try {
      const formattedNumber = `+91${phoneNumber.replace(/\D/g, "")}`;
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
        setIsLoading(false);
        setAuthStep("otp-verified");
        login(data.data.token, {
          userId: data.data.user_id,
          mobileNumber: data.data.mobile_number,
        });
        setTimeout(() => {
          onComplete(data.data.token, {
            userId: data.data.user_id,
            mobileNumber: data.data.mobile_number,
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
      const formattedNumber = `+91${phoneNumber.replace(/\D/g, "")}`;
      const response = await axios.post(`${URL}resend-otp`, { number: formattedNumber });
      const data = response.data;
      if (response.status === 200) {
        setSessionId(data.sessionId);
        setIsLoading(false);
        setCountdown(30);
        setOtp("");
        toast.success("OTP resent successfully");
      } else {
        throw new Error(data.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      setIsLoading(false);
      const message = error.response?.data?.message || error.message || "Failed to resend OTP. Please try again.";
      toast.error(message);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    setIsLoading(true);
    setActiveAuthMethod('email');
    setTimeout(() => {
      setIsLoading(false);
      // Adapt onComplete usage here (no args currently)
      onComplete('', { userId: '', mobileNumber: '' }); // or adjust as needed
    }, 2000);
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setActiveAuthMethod('google');
    setAuthStep('google-auth');
    setTimeout(() => {
      setIsLoading(false);
      onComplete('', { userId: '', mobileNumber: '' }); // or adjust as needed
    }, 2500);
  };

  const handleBackToInput = () => {
    setAuthStep('input');
    setOtp('');
    setCountdown(0);
    setActiveAuthMethod(null);
    setSessionId('');
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cleaned = input.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      setPhoneNumber(cleaned);
    }
  };

  return (
    <div className="size-full flex flex-col bg-white ">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b ">
        <Button variant="ghost" size="sm" className="cursor-pointer" onClick={authStep === 'input' ? onBack : handleBackToInput}>
          <ArrowLeft className="w-4 h-4 mr-2 " />
          Back
        </Button>
        <h1 className="text-xl">
          {authStep === 'otp-sent' ? 'Verify Phone' :
            authStep === 'otp-verified' ? 'Success!' :
              authStep === 'google-auth' ? 'Google Sign In' :
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
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src="/logo.png"   
                    alt="Spedocity Logo"
                    className="w-16 h-16 object-contain"
                  />
                </div>

                <p className="text-gray-600">Sign in to start your delivery journey</p>
              </div>

              <Tabs defaultValue="phone" className="w-full ">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="phone" className="flex items-center gap-2 cursor-pointer">
                    <Phone className="w-4 h-4" />
                    Phone
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex items-center gap-2 cursor-pointer">
                    <Mail className="w-4 h-4" />
                    Email
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="phone" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="9876543210"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className="bg-input-background"
                      disabled={isLoading && activeAuthMethod === 'phone'}
                      maxLength={10}
                    />
                    <p className="text-xs text-gray-500">Enter your 10-digit phone number</p>
                  </div>
                  <Button
                    onClick={handleSendOTP}
                    disabled={!phoneNumber || phoneNumber.length !== 10 || (isLoading && activeAuthMethod === 'phone')}
                    className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    {isLoading && activeAuthMethod === 'phone' ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="email" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-input-background"
                      disabled={isLoading && activeAuthMethod === 'email'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-input-background"
                      disabled={isLoading && activeAuthMethod === 'email'}
                    />
                  </div>
                  <Button
                    onClick={handleEmailAuth}
                    disabled={!email || !password || (isLoading && activeAuthMethod === 'email')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading && activeAuthMethod === 'email' ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-2 text-sm text-gray-500">or</span>
                </div>
              </div>

              {/* Google Sign In */}
              <Button
                variant="outline"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full flex items-center gap-3 border-gray-300 cursor-pointer"
              >
                {isLoading && activeAuthMethod === 'google' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Connecting with Google...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-gray-500 mt-6">
                By continuing, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
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
              {/* Header */}
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

              {/* OTP Input */}
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
                  ) : (
                    'Verify OTP'
                  )}
                </Button>

                {/* Resend OTP */}
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend OTP in {countdown} seconds
                    </p>
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

                {/* Change Number */}
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

          {/* Google Auth Loading */}
          {authStep === 'google-auth' && (
            <motion.div
              key="google-auth"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto text-center space-y-6"
            >
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl mb-2">Connecting with Google</h2>
                <p className="text-gray-600">Please wait while we sign you in...</p>
                <div className="flex justify-center mt-4">
                  <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}