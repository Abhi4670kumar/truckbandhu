import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Briefcase,
  CreditCard,
  Fuel,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Shield,
  ShieldCheck,
  Star,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LanguageSelector from "../components/LanguageSelector";
import { useApp } from "../contexts/AppContext";
import type { AppRole } from "../contexts/AppContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useCreateUserProfile } from "../hooks/useQueries";
import {
  SubscriptionPlan,
  type UserRoleType as UserRole,
} from "../types/appTypes";

const ROLES: {
  role: AppRole;
  label: string;
  labelHi: string;
  icon: React.ElementType;
  desc: string;
  descHi: string;
  color: string;
}[] = [
  {
    role: "driver" as AppRole,
    label: "Driver",
    labelHi: "ड्राइवर",
    icon: Truck,
    desc: "Find loads & earn more",
    descHi: "माल खोजें और ज्यादा कमाएं",
    color: "from-blue-500 to-blue-700",
  },
  {
    role: "truckOwner" as AppRole,
    label: "Truck Owner",
    labelHi: "ट्रक मालिक",
    icon: Users,
    desc: "Manage your fleet",
    descHi: "अपना बेड़ा प्रबंधित करें",
    color: "from-orange-500 to-orange-600",
  },
  {
    role: "transporter" as AppRole,
    label: "Transporter",
    labelHi: "ट्रांसपोर्टर",
    icon: Package,
    desc: "Post loads & book trucks",
    descHi: "माल पोस्ट करें और ट्रक बुक करें",
    color: "from-green-500 to-green-700",
  },
  {
    role: "admin" as AppRole,
    label: "Admin",
    labelHi: "एडमिन",
    icon: Shield,
    desc: "Manage the platform",
    descHi: "प्लेटफॉर्म प्रबंधित करें",
    color: "from-purple-500 to-purple-700",
  },
  {
    role: "jobSeeker" as AppRole,
    label: "Job Seeker",
    labelHi: "जॉब सीकर",
    icon: Briefcase,
    desc: "Find driving jobs near you",
    descHi: "अपने पास नौकरी खोजें",
    color: "from-teal-500 to-cyan-600",
  },
];

const FEATURES = [
  {
    icon: Package,
    title: "Find Loads",
    titleHi: "माल खोजें",
    desc: "Browse thousands of loads across India",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Users,
    title: "Hire Drivers",
    titleHi: "ड्राइवर रखें",
    desc: "Verified & experienced drivers ready",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: MapPin,
    title: "Track Trips",
    titleHi: "यात्रा ट्रैक करें",
    desc: "Live GPS tracking for every trip",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: CreditCard,
    title: "Digital Payments",
    titleHi: "डिजिटल भुगतान",
    desc: "Safe & transparent transactions",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Fuel,
    title: "Diesel Calculator",
    titleHi: "डीजल कैलकुलेटर",
    desc: "Estimate profit before every trip",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: Star,
    title: "Return Loads",
    titleHi: "वापसी माल",
    desc: "Never drive empty, find return loads",
    color: "bg-red-100 text-red-600",
  },
];

// localStorage helpers for user profiles by phone
const STORAGE_KEY = "tb_user_profiles";
type StoredProfile = { name: string; role: AppRole };

function getStoredProfile(phone: string): StoredProfile | null {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return data[phone] || null;
  } catch {
    return null;
  }
}

function saveStoredProfile(phone: string, profile: StoredProfile) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    data[phone] = profile;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export default function LandingPage() {
  const { language } = useLanguage();
  const { setIsLoggedIn, setCurrentRole, setUserName, setUserPhone } = useApp();
  // Steps: phone -> otp -> details (new users only) -> done
  const [step, setStep] = useState<"phone" | "otp" | "details">("phone");
  const [phone, setPhone] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  // Details form (new user)
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>(
    "driver" as AppRole,
  );
  const createProfile = useCreateUserProfile();

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Countdown timer
  useEffect(() => {
    if (step !== "otp") return;
    setResendCountdown(30);
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: ref is stable
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    }
  }, [step]);

  const generateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    toast.info(`TruckBandhu OTP: ${otp} (demo mode)`, { duration: 15000 });
    return otp;
  };

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      toast.error(
        language === "HI"
          ? "सही फोन नंबर दर्ज करें"
          : "Please enter a valid 10-digit phone number",
      );
      return;
    }
    setOtpDigits(["", "", "", ""]);
    generateOtp();
    setStep("otp");
  };

  const handleResendOtp = () => {
    generateOtp();
    setOtpDigits(["", "", "", ""]);
    setTimeout(() => otpRefs[0].current?.focus(), 100);
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otpDigits.join("");
    if (enteredOtp.length < 4) {
      toast.error(
        language === "HI"
          ? "4 अंक का OTP दर्ज करें"
          : "Please enter complete 4-digit OTP",
      );
      return;
    }
    if (enteredOtp !== generatedOtp) {
      toast.error(
        language === "HI"
          ? "गलत OTP. दोबारा कोशिश करें"
          : "Invalid OTP. Please try again.",
      );
      return;
    }

    setIsVerifying(true);
    // Check if existing user
    const existing = getStoredProfile(phone);
    if (existing) {
      // Existing user — go directly to dashboard
      setCurrentRole(existing.role);
      setUserName(existing.name);
      setUserPhone(phone);
      setIsLoggedIn(true);
      toast.success(
        language === "HI"
          ? `वापस आए ${existing.name}! 🚛`
          : `Welcome back, ${existing.name}! 🚛`,
      );
    } else {
      // New user — show details form
      setIsVerifying(false);
      setStep("details");
      return;
    }
    setIsVerifying(false);
  };

  const handleCreateAccount = async () => {
    if (!name.trim()) {
      toast.error(
        language === "HI" ? "अपना नाम दर्ज करें" : "Please enter your name",
      );
      return;
    }
    setIsVerifying(true);
    try {
      await createProfile.mutateAsync({
        userRole: selectedRole as UserRole,
        name: name.trim(),
        phone,
        location: "India",
        subscriptionPlan: SubscriptionPlan.basic,
      });
    } catch {
      // ignore backend error, proceed with local
    }
    saveStoredProfile(phone, { name: name.trim(), role: selectedRole });
    setCurrentRole(selectedRole);
    setUserName(name.trim());
    setUserPhone(phone);
    setIsLoggedIn(true);
    toast.success(
      language === "HI"
        ? `स्वागत है ${name}! TruckBandhu में आपका खाता बन गया 🚛`
        : `Welcome ${name}! Your TruckBandhu account is ready 🚛`,
    );
    setIsVerifying(false);
  };

  const handleOtpInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    if (digit && index < 3) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const newDigits = [...otpDigits];
      newDigits[index - 1] = "";
      setOtpDigits(newDigits);
      otpRefs[index - 1].current?.focus();
    }
    if (e.key === "Enter" && otpDigits.join("").length === 4) handleVerifyOtp();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="nav-gradient text-white py-3 px-4 flex items-center justify-between sticky top-0 z-50">
        <img
          src="/assets/generated/truckbandhu-logo-transparent.dim_300x100.png"
          alt="TruckBandhu"
          className="h-8 w-auto"
        />
        <LanguageSelector />
      </header>

      {/* Centered auth card — full screen focus */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        {/* Logo + tagline above the card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <Badge className="mb-2 bg-secondary/90 text-secondary-foreground border-0 text-sm px-3 py-1">
            🚛 India's #1 Logistics Platform
          </Badge>
          <p className="text-muted-foreground text-sm mt-1">
            {language === "HI"
              ? "हर ड्राइवर का सच्चा साथी"
              : "Har Driver Ka Saccha Saathi"}
          </p>
        </motion.div>

        <div className="w-full max-w-sm">
          {/* STEP 1: Phone */}
          {step === "phone" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-3">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-display text-xl font-bold mb-1">
                  {language === "HI"
                    ? "मोबाइल नंबर दर्ज करें"
                    : "Enter Mobile Number"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {language === "HI"
                    ? "आपके नंबर पर OTP भेजा जाएगा"
                    : "We'll send an OTP to verify your number"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">
                    {language === "HI" ? "फोन नंबर" : "Phone Number"}
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 border border-input bg-muted px-3 rounded-md text-sm text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      className="h-11 flex-1"
                      onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                      data-ocid="landing.input"
                    />
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-base font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-glow"
                  onClick={handleSendOtp}
                  data-ocid="landing.primary_button"
                >
                  {language === "HI" ? "OTP भेजें" : "Send OTP"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  {language === "HI"
                    ? "नए और पुराने दोनों यूजर यहाँ से शुरू करें"
                    : "New & existing users start here"}
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 2: OTP */}
          {step === "otp" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl p-6"
              data-ocid="landing.panel"
            >
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
                onClick={() => setStep("phone")}
                data-ocid="landing.back_button"
              >
                ← {language === "HI" ? "वापस जाएं" : "Go back"}
              </button>

              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-orange-600 flex items-center justify-center mb-3 shadow-glow">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-display text-xl font-bold mb-1">
                  {language === "HI" ? "OTP दर्ज करें" : "Enter OTP"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {language === "HI"
                    ? `+91 ${phone} पर OTP भेजा गया`
                    : `OTP sent to +91 ${phone}`}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {language === "HI"
                    ? "(डेमो मोड: OTP टोस्ट में देखें)"
                    : "(Demo mode: check OTP in toast notification)"}
                </p>
              </div>

              <div className="flex justify-center gap-3 mb-6">
                {([0, 1, 2, 3] as const).map((pos) => (
                  <input
                    key={pos}
                    ref={otpRefs[pos]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpDigits[pos]}
                    onChange={(e) => handleOtpInput(pos, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(pos, e)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-input rounded-xl focus:border-secondary outline-none bg-background transition-all duration-150 focus:shadow-glow"
                    data-ocid="landing.input"
                  />
                ))}
              </div>

              <Button
                className="w-full h-12 text-base font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-glow mb-4"
                onClick={handleVerifyOtp}
                disabled={isVerifying || otpDigits.join("").length < 4}
                data-ocid="landing.submit_button"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {language === "HI" ? "सत्यापित हो रहा है..." : "Verifying..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    {language === "HI" ? "OTP सत्यापित करें" : "Verify OTP"}
                  </span>
                )}
              </Button>

              <div className="text-center">
                {resendCountdown > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {language === "HI"
                      ? `OTP दोबारा भेजें ${resendCountdown}s में`
                      : `Resend OTP in ${resendCountdown}s`}
                  </p>
                ) : (
                  <button
                    type="button"
                    className="text-sm text-secondary hover:text-secondary/80 font-semibold flex items-center gap-1.5 mx-auto transition-colors"
                    onClick={handleResendOtp}
                    data-ocid="landing.secondary_button"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {language === "HI" ? "OTP दोबारा भेजें" : "Resend OTP"}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Details (new user only) */}
          {step === "details" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mb-3">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-display text-xl font-bold mb-1">
                  {language === "HI"
                    ? "अपनी जानकारी भरें"
                    : "Complete Your Profile"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {language === "HI"
                    ? "OTP सत्यापित हो गया ✅"
                    : "OTP Verified ✅ — Just one more step"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">
                    {language === "HI" ? "पूरा नाम" : "Full Name"}
                  </Label>
                  <Input
                    id="name"
                    placeholder={
                      language === "HI"
                        ? "अपना नाम दर्ज करें"
                        : "Enter your full name"
                    }
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                    data-ocid="landing.input"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    {language === "HI" ? "आप कौन हैं?" : "Select Your Role"}
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((r) => {
                      const Icon = r.icon;
                      const isSelected = selectedRole === r.role;
                      return (
                        <button
                          key={r.role}
                          type="button"
                          onClick={() => setSelectedRole(r.role)}
                          className={`relative overflow-hidden rounded-xl p-3 text-left transition-all duration-200 active:scale-95 border-2 ${
                            isSelected
                              ? `bg-gradient-to-br ${r.color} text-white border-transparent shadow-md`
                              : "border-input bg-background hover:border-secondary/50"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 mb-1.5 ${isSelected ? "opacity-90" : "text-muted-foreground"}`}
                          />
                          <p
                            className={`font-bold text-sm leading-tight ${isSelected ? "text-white" : ""}`}
                          >
                            {language === "HI" ? r.labelHi : r.label}
                          </p>
                          <p
                            className={`text-xs mt-0.5 leading-tight ${isSelected ? "text-white/80" : "text-muted-foreground"}`}
                          >
                            {language === "HI" ? r.descHi : r.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-base font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-glow"
                  onClick={handleCreateAccount}
                  disabled={isVerifying || createProfile.isPending}
                  data-ocid="landing.primary_button"
                >
                  {isVerifying || createProfile.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {language === "HI"
                        ? "खाता बन रहा है..."
                        : "Creating account..."}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      {language === "HI" ? "खाता बनाएं" : "Create Account"}
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Features shown only after entering phone (subtle teaser) */}
        {step === "phone" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 w-full max-w-sm"
          >
            <p className="text-center text-xs text-muted-foreground mb-3 uppercase tracking-wider font-semibold">
              {language === "HI" ? "सब कुछ एक जगह" : "Everything in One Place"}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl bg-muted/40 text-center"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg ${f.color} flex items-center justify-center`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs font-semibold leading-tight">
                      {language === "HI" ? f.titleHi : f.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
