import {
  GoogleMap,
  Marker,
  useJsApiLoader
} from "@react-google-maps/api";
import axios from 'axios';
import API from "../api/axiosInstance";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  CreditCard,
  Edit3,
  Gift,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Settings,
  Shield,
  Star,
  Trash2,
  User,
  Users,
  Wallet,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext';
import { URL } from "../URL";
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { getUser } from "../utils/utils";

// <ToastContainer />
const menuItems = [
  {
    id: 'profile',
    icon: User,
    title: 'Edit Profile',
    subtitle: 'Update your personal information',
    color: 'bg-blue-100 text-blue-600'

  },
  {
    id: 'addresses',
    icon: MapPin,
    title: 'Saved Addresses',
    subtitle: 'Manage your pickup & drop locations',
    color: 'bg-green-100 text-green-600',
    badge: '3'
  },
  {
    id: 'wallet',
    icon: Wallet,
    title: 'Wallet & Payments',
    subtitle: 'Manage your wallet and payment methods',
    color: 'bg-emerald-100 text-emerald-600'
  },
  {
    id: 'referrals',
    icon: Users,
    title: 'Referral Program',
    subtitle: 'Invite friends and earn ₹100 wallet credit',
    color: 'bg-purple-100 text-purple-600',
    badge: 'Earn ₹100'
  },
  {
    id: 'support',
    icon: MessageCircle,
    title: 'Support Chat',
    subtitle: '24/7 customer support available',
    color: 'bg-blue-100 text-blue-600',
    badge: 'Live'
  },

  {
    id: 'privacy',
    icon: Shield,
    title: 'Privacy & Security',
    subtitle: 'Control your data and security',
    color: 'bg-red-100 text-red-600'
  },

];

export function ProfileScreen() {
  const [activeScreen, setActiveScreen] = useState<string | null>(null);
  const userId = getUser().userId;
  // ✅ keep outside to avoid reloading warning
  const libraries: ("places")[] = ["places"];

  // ✅ Google Map container style
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  // ✅ Default map center (Bengaluru)
  const defaultCenter = {
    lat: 12.9716,
    lng: 77.5946,
  };

  interface Address {
    id: number;
    label: string;
    address: string;
    lat?: number;
    lng?: number;
  }

  interface AddressManagerProps {
    onBack: () => void;
  }

  function AddressManager({ onBack }: AddressManagerProps) {
    // -------------------- State --------------------
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showMap, setShowMap] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [map, setMap] = useState<any>(null);
    const userData = getUser();
    // ✅ Ref for search input
    const inputRef = useRef<HTMLInputElement>(null);

    // -------------------- Google Maps Loader --------------------
    const { isLoaded } = useJsApiLoader({
      // googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
      googleMapsApiKey: 'AIzaSyBHyUtxzdJUQjDk8up2cQDM1emSxgrjhIA',
      libraries,

    });


    // -------------------- Init Place Autocomplete --------------------
    useEffect(() => {
      if (isLoaded && inputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current!, {
          componentRestrictions: { country: "in" },
        });


        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            const location = place.geometry.location;
            setSelectedLocation({
              lat: location.lat(),
              lng: location.lng(),
              address: place.formatted_address,
            });
            map?.panTo(location);
          }
        });

      }
    }, [isLoaded, map]);
      const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${URL}getUser-address`, {
        params: { userId },
        headers: {
          Authorization: userData?.authToken
        }
      });
      setAddresses(res.data.data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      if (err.response && err.response.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to load addresses");
      }
    }
  };
    useEffect(() => {


  fetchAddresses();
    }, [userId, userData?.authToken]); // ✅ add deps
    const handleSaveAddress = async () => {
  if (!selectedLocation) {
    toast.error("Please select a location");
    return;
  }

  const newAddress = { 
    userId: userId,
    latitude: selectedLocation.lat,
    langitude: selectedLocation.lng,
    address: selectedLocation.address 
  };

  try {
    const res = await axios.post(`${URL}user-address`, newAddress, {
      headers: {
        Authorization: userData?.authToken
      }
    });

    console.log(res, "response");

    if (res.data.success) {
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
    //getAddresses
  } catch (err) {
    console.error("Error saving address:", err);

    // 👇 Handle error responses with custom message from backend
    if (err.response && err.response.data && err.response.data.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("Error saving address");
    }
  }

  setShowMap(false);
  setEditingAddress(null);
  setSelectedLocation(null);
    };
    const handleDeleteAddress = async (id: number) => {
      try {
        const res = await axios.delete(`${URL}deleteUser-address/${id}`, {
          headers: {
            Authorization: userData?.authToken
          }
        });
        if(res.data.success){
          toast.success(res.data.message);

          fetchAddresses()
      }
    }
      catch (err) {
        console.error("Error deleting address:", err);
      }
    }


    const handleAddNew = () => {
      setEditingAddress(null);
      setSelectedLocation(null);
      setShowMap(true);
    };


    return (
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Button variant="ghost" className="cursor-pointer" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>

        {/* Header + Add New Address */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Saved Addresses</h2>
          <Button
            onClick={handleAddNew}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 " /> Add New Address
          </Button>
        </div>

        {/* Saved Address Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {addresses.map((addr) => (
    <div
      key={addr.id}
      className="relative cursor-pointer bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all p-5 flex flex-col justify-between"
    >
      {/* Location Header */}
      <div className="flex items-start p-3 mt-1 gap-3">
        <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full p-2 mt-1">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-base leading-snug">
            {addr.user_address.split(',')[0] || 'Saved Address'}
          </h3>
          <p className="text-gray-500 text-sm mt-1 leading-relaxed">
            {addr.user_address}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute   flex gap-2" style={{ right: '10px', top:'20px' }}>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 cursor-pointer rounded-full bg-blue-50 text-blue-600 hover:bg-red-600 hover:text-white transition"
          // onClick={() => handleEdit(addr)}
        >
          <Edit3 className="w-4 h-4" />
        </Button>

        <Button
          variant="destructive"
          size="icon"
          className="h-9 w-9 cursor-pointer rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
          onClick={() => handleDeleteAddress(addr.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  ))}
</div>


        {/* Map Modal */}
        {showMap && isLoaded && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl relative overflow-hidden">
              <div className="p-4">
                {/* Title */}
                <h3 className="text-lg font-semibold mb-3">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h3>

                {/* Search Box (✅ replaced Autocomplete) */}
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for a building, street, or area..."
                  defaultValue={editingAddress?.address || ""}
                  className="w-full border px-4 py-2 rounded-lg mb-3 focus:ring focus:ring-blue-200"
                />

                {/* Google Map */}
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={selectedLocation || defaultCenter}
                  zoom={14}
                  onLoad={(mapInstance) => setMap(mapInstance)}
                  onClick={(e) =>
                    setSelectedLocation({
                      lat: e.latLng?.lat(),
                      lng: e.latLng?.lng(),
                      address: "Selected location (click Save to confirm)",
                    })
                  }
                >
                  {selectedLocation && (
                    <Marker
                      position={{
                        lat: selectedLocation.lat,
                        lng: selectedLocation.lng,
                      }}
                    />
                  )}
                </GoogleMap>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => setShowMap(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="cursor-pointer" onClick={handleSaveAddress}>
                    {editingAddress ? "Update & Save" : "Save & Confirm"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  const { logout } = useAuth()
  const userData = getUser();
  console.log(userData, "jhjksahjkd")
  const userRating = 4.8;
  const totalDeliveries = 23;
  const walletBalance = 1250;
  const handleLogOut = async () => {
    try {
      const res = await axios.post(
        `${URL}logout`,
        {}, // empty body
        {
          headers: {
            'Authorization': userData?.authToken
          }
        }
      );
      if (res.status === 200) {
        toast.success("Logout is success")
      }
    } catch (error) {
      console.error(error)
    }
    logout();
  }

  const handleMenuClick = (itemId: string) => {
    if (itemId === 'addresses' || itemId === 'referrals' || itemId === 'support' || itemId === 'profile' || itemId === 'wallet') {
      setActiveScreen(itemId);
    } else {
      console.log('Opening:', itemId);
    }
  };



  if (activeScreen === 'profile') {
    return <EditProfileScreen onBack={() => setActiveScreen(null)} userData={userData} />;
  }

  if (activeScreen === 'wallet') {
    return <WalletPaymentsScreen onBack={() => setActiveScreen(null)} walletBalance={walletBalance} />;
  }

  if (activeScreen === 'addresses') {
    return <AddressManager onBack={() => setActiveScreen(null)} />;
  }

  if (activeScreen === 'referrals') {
    return <ReferralProgramScreen onBack={() => setActiveScreen(null)} />;
  }

  if (activeScreen === 'support') {
    // Simple fallback for support chat
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setActiveScreen(null)}>
              <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
              Back
            </Button>
            <h1 className="text-lg">Support Chat</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl mb-2">24/7 Support Available</h2>
            <p className="text-gray-600 mb-4">Our support team is here to help you!</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Start Chat
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-6 pb-4 shadow-sm flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-xl mb-1">Profile</h1>
          <p className="text-gray-600 text-sm">Manage your account</p>
        </motion.div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Section */}
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-blue-600 text-white text-xl">
                      {userData?.name
                        ? (userData.name as string) // explicitly tell TS this is a string
                          .split(' ')
                          .map((n: string) => n[0]) // n is definitely a string
                          .join('')
                        : 'U'}
                    </AvatarFallback>

                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-lg mb-1">{userData?.name}</h2>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{userRating}</span>
                      <span className="text-xs text-gray-500">({totalDeliveries} Orders)</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      Verified User
                    </Badge>
                  </div>
                </div>

                {/* Wallet Balance */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Wallet Balance</p>
                      <p className="text-xl font-semibold text-blue-600">₹{walletBalance}</p>
                    </div>
                    <Wallet className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{userData?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{userData?.mobileNumber}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Menu Items */}
        <div className="px-6 pb-24 md:pb-6">
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Card
                  className="bg-white border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleMenuClick(item.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm mb-1">{item.title}</h3>
                          <p className="text-xs text-gray-600">{item.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs px-2 py-0">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8"
          >
            <Card className="bg-white border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4" onClick={handleLogOut}>
                <div className="flex items-center justify-center">
                  <span className="text-sm text-red-600">Sign Out</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* App Version */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center mt-6"
          >
            <p className="text-xs text-gray-500">Spedocity v1.0.0</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Edit Profile Screen

export default function EditProfileScreen({
  onBack,
  userData,
}: {
  onBack: () => void;
  userData: {
    authToken: string;
    mobileNumber: string;
    userId: string;
    userData: {
      full_name: string;
      email: string;
      date_of_birth: string;
      gender: string;
    };
  };
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    emergencyContact: '+91 98765 43211',
  });

  // 🟢 Pre-fill formData from userData
  useEffect(() => {
    if (userData?.userData) {
      const { full_name, email, date_of_birth, gender } = userData.userData;
      setFormData({
        name: full_name || '',
        email: email || '',
        dateOfBirth: date_of_birth ? date_of_birth.split('T')[0] : '',
        gender: gender || '',
        emergencyContact: '+91 98765 43211', // or fetch from user profile
      });
    }
  }, [userData]);

  const handleSave = async () => {
    try {
      const res = await axios.post(
        `${URL}update-profile`,
        { ...formData, userId: userData?.userId },
        {
          headers: {
            'Authorization': userData?.authToken,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 200 && res.data) {
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
    setIsEditing(false);
  };

  const handleCancel = () => setIsEditing(false);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
              Back
            </Button>
            <h1 className="text-lg">Edit Profile</h1>
          </div>
          {!isEditing ? (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* --- Body --- */}
      <div className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6">
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="w-24 h-24">
                <AvatarFallback className={`text-white text-2xl ${isEditing ? 'bg-purple-600' : 'bg-blue-600'}`}>
                  {formData.name ? formData.name[0].toUpperCase() : '?'}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-blue-600 hover:bg-blue-700"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            <h2 className="text-lg font-medium">{formData.name}</h2>
            <p className="text-sm text-gray-600">Member since Jan 2024</p>
          </CardContent>
        </Card>

        {/* --- Personal Info --- */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input value={userData.mobileNumber} disabled />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label>Gender</Label>
                {isEditing ? (
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                ) : (
                  <Input value={formData.gender} disabled />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- Emergency Contact --- */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
            <div>
              <Label>Emergency Contact Number</Label>
              <Input
                value={formData.emergencyContact}
                onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                disabled={!isEditing}
              />
              <p className="text-xs text-gray-500 mt-1">
                This contact will be notified in case of emergency during delivery
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


// Wallet & Payments Screen
function WalletPaymentsScreen({ onBack, walletBalance }: { onBack: () => void; walletBalance: number }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const paymentMethods = [
    { id: 'upi', name: 'UPI', details: 'john.doe@paytm', icon: '📱', isDefault: true },
    { id: 'card1', name: 'Credit Card', details: '**** **** **** 1234', icon: '💳', isDefault: false },
    { id: 'card2', name: 'Debit Card', details: '**** **** **** 5678', icon: '💳', isDefault: false }
  ];

  const recentTransactions = [
    { id: 1, type: 'credit', amount: 200, description: 'Wallet top-up', date: '15 Jan 2024', method: 'UPI' },
    { id: 2, type: 'debit', amount: 75, description: 'Delivery payment', date: '14 Jan 2024', method: 'Wallet' },
    { id: 3, type: 'credit', amount: 100, description: 'Referral bonus', date: '13 Jan 2024', method: 'Wallet' }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className='cursor-pointer'>
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
            Back
          </Button>
          <h1 className="text-lg">Wallet & Payments</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6">
        {/* Wallet Balance */}
        <Card className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 border-0">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg opacity-90">Spedocity Wallet</h2>
              <Wallet className="w-8 h-8 opacity-75" />
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold">₹{walletBalance}</span>
              <span className="text-sm opacity-75 ml-2">Available Balance</span>
            </div>
            <Button variant="secondary" size="sm" className="cursor-pointer bg-white/20 text-white border-0 hover:bg-white/30">
              <Plus className="w-4 h-4 mr-2" />
              Add Money
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions Actions*/}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-sm font-medium">Add Money</h3>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium">Pay Bills</h3>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium">Send Money</h3>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Payment Methods</h3>
              <Button variant="outline" size="sm" className='cursor-pointer'>
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </div>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <h4 className="font-medium">{method.name}</h4>
                        <p className="text-sm text-gray-600">{method.details}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <Badge className="bg-green-100 text-green-700 text-xs">Default</Badge>
                      )}
                      <Settings className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                      {transaction.type === 'credit' ? (
                        <Plus className="w-5 h-5 text-green-600" />
                      ) : (
                        <CreditCard className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{transaction.description}</h4>
                      <p className="text-xs text-gray-600">{transaction.date} • {transaction.method}</p>
                    </div>
                  </div>
                  <span className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Referral Program Screen
function ReferralProgramScreen({ onBack }: { onBack: () => void }) {
  const referralCode = "JOHN100";
  const referralStats = {
    totalReferrals: 5,
    pendingRewards: 200,
    earnedRewards: 500
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className='cursor-pointer'>
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
            Back
          </Button>
          <h1 className="text-lg">Referral Program</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6">
        {/* Referral Code */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center">
              <Gift className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-xl mb-2">Invite Friends, Earn ₹100</h2>
              <p className="text-gray-600 text-sm mb-4">
                Share your referral code and earn ₹100 wallet credit for each successful referral
              </p>

              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-600 mb-1">Your Referral Code</p>
                <p className="text-2xl font-mono font-bold tracking-wider">{referralCode}</p>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer">
                <Users className="w-4 h-4 mr-2" />
                Share Code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{referralStats.totalReferrals}</p>
              <p className="text-xs text-gray-600">Total Referrals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">₹{referralStats.pendingRewards}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">₹{referralStats.earnedRewards}</p>
              <p className="text-xs text-gray-600">Earned</p>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">How it works</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-600 font-medium flex-shrink-0">1</div>
                <p className="text-sm text-gray-600">Share your referral code with friends</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-600 font-medium flex-shrink-0">2</div>
                <p className="text-sm text-gray-600">Friend signs up using your code</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-600 font-medium flex-shrink-0">3</div>
                <p className="text-sm text-gray-600">Both get ₹100 wallet credit after first order</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Support Chat Screen
function SupportChatScreen({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm here to help you with any questions about Spedocity. How can I assist you today?", isBot: true, timestamp: "10:30 AM" },
  ]);
  const [inputText, setInputText] = useState("");

  const quickQuestions = [
    "Track my order",
    "Delivery issues",
    "Payment problems",
    "Account help"
  ];

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        isBot: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputText("");

      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "Thanks for your message! A support agent will respond shortly. In the meantime, you can check our FAQ section for quick answers.",
          isBot: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className='cursor-pointer'>
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-lg">Support Chat</h1>
            <p className="text-xs text-green-600">● Online - 24/7 Support</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isBot
              ? 'bg-white border border-gray-200'
              : 'bg-blue-600 text-white'
              }`}>
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-500' : 'text-blue-100'}`}>
                {message.timestamp}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-2 cursor-pointer"
                  onClick={() => setInputText(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <Button onClick={handleSendMessage} disabled={!inputText.trim()} className='cursor-pointer'>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}