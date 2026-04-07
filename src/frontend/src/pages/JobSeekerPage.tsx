import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  Car,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Search,
  Star,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";

interface JobSeeker {
  id: number;
  name: string;
  jobType: "Driver" | "Helper" | "Both";
  city: string;
  state: string;
  experience: string;
  expectedSalary: string;
  languages: string[];
  phone: string;
  about: string;
  distanceKm: number;
}

const MOCK_SEEKERS: JobSeeker[] = [
  {
    id: 1,
    name: "Ramesh Kumar",
    jobType: "Driver",
    city: "Delhi",
    state: "Delhi",
    experience: "8 years",
    expectedSalary: "₹22,000/month",
    languages: ["Hindi", "Punjabi"],
    phone: "9876543210",
    about: "Experienced truck driver with long-haul expertise.",
    distanceKm: 5,
  },
  {
    id: 2,
    name: "Suresh Yadav",
    jobType: "Helper",
    city: "Lucknow",
    state: "Uttar Pradesh",
    experience: "3 years",
    expectedSalary: "₹12,000/month",
    languages: ["Hindi"],
    phone: "9812345678",
    about: "Loading/unloading specialist, hardworking and punctual.",
    distanceKm: 12,
  },
  {
    id: 3,
    name: "Mohan Singh",
    jobType: "Driver",
    city: "Amritsar",
    state: "Punjab",
    experience: "12 years",
    expectedSalary: "₹28,000/month",
    languages: ["Punjabi", "Hindi"],
    phone: "9988776655",
    about: "Senior driver, all India permit, clean record.",
    distanceKm: 34,
  },
  {
    id: 4,
    name: "Arjun Patel",
    jobType: "Both",
    city: "Surat",
    state: "Gujarat",
    experience: "5 years",
    expectedSalary: "₹18,000/month",
    languages: ["Gujarati", "Hindi"],
    phone: "9765432109",
    about: "Flexible, can drive and help with loading.",
    distanceKm: 67,
  },
  {
    id: 5,
    name: "Dinesh Sharma",
    jobType: "Driver",
    city: "Jaipur",
    state: "Rajasthan",
    experience: "6 years",
    expectedSalary: "₹20,000/month",
    languages: ["Hindi", "English"],
    phone: "9654321098",
    about: "North India routes specialist, all documents valid.",
    distanceKm: 21,
  },
  {
    id: 6,
    name: "Pradeep Verma",
    jobType: "Helper",
    city: "Patna",
    state: "Bihar",
    experience: "2 years",
    expectedSalary: "₹10,000/month",
    languages: ["Hindi"],
    phone: "9543210987",
    about: "Reliable helper, available immediately.",
    distanceKm: 45,
  },
  {
    id: 7,
    name: "Vijay Reddy",
    jobType: "Driver",
    city: "Hyderabad",
    state: "Telangana",
    experience: "10 years",
    expectedSalary: "₹25,000/month",
    languages: ["Telugu", "Hindi", "English"],
    phone: "9432109876",
    about: "South India routes expert with HMV license.",
    distanceKm: 88,
  },
  {
    id: 8,
    name: "Santosh Kadam",
    jobType: "Both",
    city: "Pune",
    state: "Maharashtra",
    experience: "4 years",
    expectedSalary: "₹16,000/month",
    languages: ["Marathi", "Hindi"],
    phone: "9321098765",
    about: "Good knowledge of Pune-Mumbai highway.",
    distanceKm: 55,
  },
  {
    id: 9,
    name: "Ranjit Das",
    jobType: "Driver",
    city: "Kolkata",
    state: "West Bengal",
    experience: "7 years",
    expectedSalary: "₹19,000/month",
    languages: ["Bengali", "Hindi"],
    phone: "9210987654",
    about: "East India routes specialist, night driving experience.",
    distanceKm: 102,
  },
  {
    id: 10,
    name: "Anil Naik",
    jobType: "Helper",
    city: "Nagpur",
    state: "Maharashtra",
    experience: "Fresher",
    expectedSalary: "₹9,000/month",
    languages: ["Marathi", "Hindi"],
    phone: "9109876543",
    about: "Fresh candidate, eager to learn, physically fit.",
    distanceKm: 73,
  },
  {
    id: 11,
    name: "Kuldeep Chauhan",
    jobType: "Driver",
    city: "Chandigarh",
    state: "Punjab",
    experience: "9 years",
    expectedSalary: "₹24,000/month",
    languages: ["Punjabi", "Hindi", "English"],
    phone: "9098765432",
    about: "Hill driving experience, Manali and Shimla routes.",
    distanceKm: 28,
  },
  {
    id: 12,
    name: "Mahesh Tiwari",
    jobType: "Both",
    city: "Bhopal",
    state: "Madhya Pradesh",
    experience: "3 years",
    expectedSalary: "₹14,000/month",
    languages: ["Hindi"],
    phone: "9087654321",
    about: "Central India operations, flexible on shifts.",
    distanceKm: 49,
  },
  {
    id: 13,
    name: "Deepak Mishra",
    jobType: "Driver",
    city: "Varanasi",
    state: "Uttar Pradesh",
    experience: "5 years",
    expectedSalary: "₹17,000/month",
    languages: ["Hindi"],
    phone: "9876012345",
    about: "Varanasi to Delhi regular run, no violations.",
    distanceKm: 38,
  },
  {
    id: 14,
    name: "Prakash Nair",
    jobType: "Driver",
    city: "Indore",
    state: "Madhya Pradesh",
    experience: "11 years",
    expectedSalary: "₹26,000/month",
    languages: ["Hindi", "English"],
    phone: "9765012345",
    about: "Experienced in FMCG and cold chain logistics.",
    distanceKm: 61,
  },
  {
    id: 15,
    name: "Ganesh Pillai",
    jobType: "Helper",
    city: "Mumbai",
    state: "Maharashtra",
    experience: "1 year",
    expectedSalary: "₹13,000/month",
    languages: ["Marathi", "Hindi", "English"],
    phone: "9654012345",
    about: "Port area loading experience, night shifts available.",
    distanceKm: 79,
  },
];

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const LANGUAGES = [
  "Hindi",
  "English",
  "Punjabi",
  "Tamil",
  "Telugu",
  "Bengali",
  "Marathi",
  "Gujarati",
];

function jobTypeBorderColor(type: string) {
  if (type === "Driver") return "border-l-blue-500";
  if (type === "Helper") return "border-l-orange-500";
  return "border-l-green-500";
}

function jobTypeBadgeClass(type: string) {
  if (type === "Driver") return "bg-blue-100 text-blue-800 border-blue-200";
  if (type === "Helper")
    return "bg-orange-100 text-orange-800 border-orange-200";
  return "bg-green-100 text-green-800 border-green-200";
}

export default function JobSeekerPage() {
  const { currentRole } = useApp();
  const isJobSeeker = currentRole === "jobSeeker";
  const defaultTab = isJobSeeker ? "post" : "browse";

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | "Driver" | "Helper">(
    "All",
  );
  const [radiusFilter, setRadiusFilter] = useState<"25" | "50" | "100" | "Any">(
    "Any",
  );
  const [detectedCity, setDetectedCity] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Form state
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    jobType: "Driver",
    experience: "",
    city: "",
    state: "",
    availableFrom: "",
    expectedSalary: "",
    languages: [] as string[],
    about: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleDetectLocation = async () => {
    setDetectingLocation(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 8000,
        }),
      );
      const { latitude, longitude } = pos.coords;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      );
      const data = await res.json();
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        "";
      setDetectedCity(city);
      toast.success(`Location detected: ${city}`);
    } catch {
      toast.error("Could not detect location. Please enter manually.");
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleFormDetectLocation = async () => {
    setDetectingLocation(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 8000,
        }),
      );
      const { latitude, longitude } = pos.coords;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      );
      const data = await res.json();
      const city =
        data.address?.city || data.address?.town || data.address?.village || "";
      const state = data.address?.state || "";
      setForm((prev) => ({ ...prev, city, state }));
      toast.success(`Location filled: ${city}, ${state}`);
    } catch {
      toast.error("Could not detect location.");
    } finally {
      setDetectingLocation(false);
    }
  };

  const filteredSeekers = MOCK_SEEKERS.filter((s) => {
    const matchesType =
      typeFilter === "All" || s.jobType === typeFilter || s.jobType === "Both";
    const matchesSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRadius =
      radiusFilter === "Any" || s.distanceKm <= Number.parseInt(radiusFilter);
    const matchesCity =
      !detectedCity ||
      s.city.toLowerCase().includes(detectedCity.toLowerCase()) ||
      s.distanceKm <= 50;
    return matchesType && matchesSearch && matchesRadius && matchesCity;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.mobile || !form.city || !form.state) {
      toast.error("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setForm({
      fullName: "",
      mobile: "",
      jobType: "Driver",
      experience: "",
      city: "",
      state: "",
      availableFrom: "",
      expectedSalary: "",
      languages: [],
      about: "",
    });
    toast.success("Your profile has been posted! Employers can now find you.");
  };

  const toggleLanguage = (lang: string) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary" />
          {isJobSeeker ? "Find Your Job" : "Job Seekers"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isJobSeeker
            ? "Post your profile and connect with employers near you"
            : "Find drivers & helpers near you, or post your own profile"}
        </p>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger
            value="browse"
            className="flex-1"
            data-ocid="jobseeker.browse.tab"
          >
            Browse Job Seekers
          </TabsTrigger>
          <TabsTrigger
            value="post"
            className="flex-1"
            data-ocid="jobseeker.post.tab"
          >
            {isJobSeeker ? (
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-teal-500" />
                Your Profile
              </span>
            ) : (
              "Post Your Profile"
            )}
          </TabsTrigger>
        </TabsList>

        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-4">
          {/* Location Detection */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-4 pb-3">
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Your Location
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter your city..."
                      value={detectedCity}
                      onChange={(e) => setDetectedCity(e.target.value)}
                      className="h-9"
                      data-ocid="jobseeker.search_input"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 h-9"
                      onClick={handleDetectLocation}
                      disabled={detectingLocation}
                      data-ocid="jobseeker.detect_location.button"
                    >
                      {detectingLocation ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Navigation className="w-4 h-4" />
                      )}
                      <span className="ml-1 hidden sm:inline">
                        Detect My Location
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex gap-1">
              {(["All", "Driver", "Helper"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  data-ocid={`jobseeker.type_filter.${t.toLowerCase()}.toggle`}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    typeFilter === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-1 ml-auto">
              {(["25", "50", "100", "Any"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadiusFilter(r)}
                  data-ocid={`jobseeker.radius_filter.${r}.toggle`}
                  className={`px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    radiusFilter === r
                      ? "bg-secondary text-secondary-foreground border-secondary"
                      : "bg-background text-muted-foreground border-border hover:border-secondary"
                  }`}
                >
                  {r === "Any" ? "Any" : `${r}km`}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-ocid="jobseeker.name_search_input"
            />
          </div>

          {/* Results count */}
          <p className="text-xs text-muted-foreground">
            {filteredSeekers.length} job seeker
            {filteredSeekers.length !== 1 ? "s" : ""} found
          </p>

          {/* Cards */}
          {filteredSeekers.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="jobseeker.empty_state"
            >
              <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No job seekers found</p>
              <p className="text-sm mt-1">
                Try adjusting your filters or location
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSeekers.map((seeker, idx) => (
                <Card
                  key={seeker.id}
                  className={`border-l-4 ${jobTypeBorderColor(seeker.jobType)} shadow-sm hover:shadow-md transition-shadow`}
                  data-ocid={`jobseeker.item.${idx + 1}`}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                          {seeker.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {seeker.name}
                            </h3>
                            <div className="flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {seeker.city}, {seeker.state}
                              </span>
                              <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full ml-1">
                                ~{seeker.distanceKm} km
                              </span>
                            </div>
                          </div>
                          <Badge
                            className={`text-xs border shrink-0 ${jobTypeBadgeClass(seeker.jobType)}`}
                            variant="outline"
                          >
                            {seeker.jobType === "Both" ? (
                              <>
                                <Car className="w-3 h-3 mr-1" />
                                Driver & Helper
                              </>
                            ) : seeker.jobType === "Driver" ? (
                              <>
                                <Car className="w-3 h-3 mr-1" />
                                Driver
                              </>
                            ) : (
                              <>
                                <User className="w-3 h-3 mr-1" />
                                Helper
                              </>
                            )}
                          </Badge>
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                          <span className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">
                              Exp:
                            </span>{" "}
                            {seeker.experience}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">
                              Salary:
                            </span>{" "}
                            {seeker.expectedSalary}
                          </span>
                        </div>

                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {seeker.languages.map((lang) => (
                            <span
                              key={lang}
                              className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>

                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() =>
                              toast.info(
                                `Calling ${seeker.name}: ${seeker.phone}`,
                              )
                            }
                            data-ocid={`jobseeker.call.button.${idx + 1}`}
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs"
                            onClick={() =>
                              toast.info(`Profile: ${seeker.about}`)
                            }
                            data-ocid={`jobseeker.view_profile.button.${idx + 1}`}
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Post Profile Tab */}
        <TabsContent value="post">
          {isJobSeeker && (
            <div className="mb-4 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 p-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-teal-800">
                  Complete your profile to get hired faster
                </p>
                <p className="text-xs text-teal-600 mt-0.5">
                  Employers in your area will be able to find and contact you
                  directly.
                </p>
              </div>
            </div>
          )}
          <Card>
            <CardContent className="pt-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, fullName: e.target.value }))
                      }
                      className="mt-1"
                      data-ocid="jobseeker.fullname.input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      placeholder="10-digit mobile number"
                      value={form.mobile}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, mobile: e.target.value }))
                      }
                      className="mt-1"
                      data-ocid="jobseeker.mobile.input"
                    />
                  </div>
                </div>

                <div>
                  <Label>Job Type *</Label>
                  <RadioGroup
                    value={form.jobType}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, jobType: v }))
                    }
                    className="flex gap-6 mt-2"
                    data-ocid="jobseeker.jobtype.radio"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="Driver" id="jt-driver" />
                      <Label htmlFor="jt-driver">Driver</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="Helper" id="jt-helper" />
                      <Label htmlFor="jt-helper">Helper</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="Both" id="jt-both" />
                      <Label htmlFor="jt-both">Both</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience">Experience</Label>
                    <Select
                      value={form.experience}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, experience: v }))
                      }
                    >
                      <SelectTrigger
                        className="mt-1"
                        data-ocid="jobseeker.experience.select"
                      >
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fresher">Fresher</SelectItem>
                        <SelectItem value="1-2 years">1-2 years</SelectItem>
                        <SelectItem value="3-5 years">3-5 years</SelectItem>
                        <SelectItem value="5-10 years">5-10 years</SelectItem>
                        <SelectItem value="10+ years">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="salary">Expected Monthly Salary (₹)</Label>
                    <Input
                      id="salary"
                      type="number"
                      placeholder="e.g. 18000"
                      value={form.expectedSalary}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          expectedSalary: e.target.value,
                        }))
                      }
                      className="mt-1"
                      data-ocid="jobseeker.salary.input"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>Current Location *</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-primary"
                      onClick={handleFormDetectLocation}
                      disabled={detectingLocation}
                      data-ocid="jobseeker.form_detect_location.button"
                    >
                      {detectingLocation ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Navigation className="w-3 h-3 mr-1" />
                      )}
                      Detect Location
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="City *"
                      value={form.city}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, city: e.target.value }))
                      }
                      data-ocid="jobseeker.city.input"
                    />
                    <Select
                      value={form.state}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, state: v }))
                      }
                    >
                      <SelectTrigger data-ocid="jobseeker.state.select">
                        <SelectValue placeholder="Select state *" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="availableFrom">Available From</Label>
                  <Input
                    id="availableFrom"
                    type="date"
                    value={form.availableFrom}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, availableFrom: e.target.value }))
                    }
                    className="mt-1"
                    data-ocid="jobseeker.available_from.input"
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Languages Known</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {LANGUAGES.map((lang) => (
                      <div key={lang} className="flex items-center gap-2">
                        <Checkbox
                          id={`lang-${lang}`}
                          checked={form.languages.includes(lang)}
                          onCheckedChange={() => toggleLanguage(lang)}
                          data-ocid={`jobseeker.lang_${lang.toLowerCase()}.checkbox`}
                        />
                        <Label
                          htmlFor={`lang-${lang}`}
                          className="cursor-pointer text-sm font-normal"
                        >
                          {lang}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="about">About Yourself</Label>
                  <Textarea
                    id="about"
                    placeholder="Brief description (max 200 characters)"
                    value={form.about}
                    maxLength={200}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, about: e.target.value }))
                    }
                    className="mt-1 resize-none"
                    rows={3}
                    data-ocid="jobseeker.about.textarea"
                  />
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    {form.about.length}/200
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold"
                  disabled={submitting}
                  data-ocid="jobseeker.post_profile.submit_button"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post My Profile"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
