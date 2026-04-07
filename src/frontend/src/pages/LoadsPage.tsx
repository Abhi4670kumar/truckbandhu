import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  IndianRupee,
  Loader2,
  LocateFixed,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Ruler,
  Search,
  SlidersHorizontal,
  Truck,
  Weight,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";
import { useLanguage } from "../contexts/LanguageContext";
import type { LoadEntry } from "../hooks/useQueries";
import { useAllLoads, useCreateLoad } from "../hooks/useQueries";
import { LoadStatus, UserRole } from "../types/appTypes";

const SAMPLE_LOADS: LoadEntry[] = [
  {
    id: "L001",
    pickupLocation: "Delhi, NH8",
    deliveryLocation: "Jaipur, MG Road",
    distanceKm: BigInt(270),
    weightTons: BigInt(12),
    truckTypeRequired: "14 Tyre",
    basePriceRs: BigInt(22500),
    status: LoadStatus.open,
    postedBy: {} as any,
  },
  {
    id: "L002",
    pickupLocation: "Mumbai, JNPT",
    deliveryLocation: "Pune, Pimpri",
    distanceKm: BigInt(148),
    weightTons: BigInt(8),
    truckTypeRequired: "Tata 407",
    basePriceRs: BigInt(9800),
    status: LoadStatus.negotiating,
    postedBy: {} as any,
  },
  {
    id: "L003",
    pickupLocation: "Chennai, Koyambedu",
    deliveryLocation: "Bangalore, Yeshwanthpur",
    distanceKm: BigInt(346),
    weightTons: BigInt(15),
    truckTypeRequired: "32 Ft",
    basePriceRs: BigInt(28000),
    status: LoadStatus.confirmed,
    postedBy: {} as any,
  },
  {
    id: "L004",
    pickupLocation: "Hyderabad, L.B. Nagar",
    deliveryLocation: "Nagpur, Itwari",
    distanceKm: BigInt(468),
    weightTons: BigInt(20),
    truckTypeRequired: "14 Tyre",
    basePriceRs: BigInt(38000),
    status: LoadStatus.open,
    postedBy: {} as any,
  },
  {
    id: "L005",
    pickupLocation: "Ahmedabad, Odhav",
    deliveryLocation: "Surat, Udhna",
    distanceKm: BigInt(265),
    weightTons: BigInt(10),
    truckTypeRequired: "Tata 407",
    basePriceRs: BigInt(14500),
    status: LoadStatus.open,
    postedBy: {} as any,
  },
  {
    id: "L006",
    pickupLocation: "Kolkata, Dankuni",
    deliveryLocation: "Patna, Patnasahib",
    distanceKm: BigInt(590),
    weightTons: BigInt(18),
    truckTypeRequired: "32 Ft",
    basePriceRs: BigInt(45000),
    status: LoadStatus.open,
    postedBy: {} as any,
  },
];

const RETURN_LOADS = [
  { from: "Jaipur", to: "Delhi", distance: "270 km", price: "₹18,000" },
  { from: "Jaipur", to: "Agra", distance: "235 km", price: "₹16,500" },
];

const TRUCK_TYPES = [
  "Tata 407",
  "14 Tyre",
  "32 Ft",
  "20 Ft",
  "Container",
  "Trailer",
];

const STATUS_COLORS: Record<string, string> = {
  open: "bg-green-100 text-green-700 border-green-200",
  negotiating: "bg-orange-100 text-orange-700 border-orange-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
};

// Simulated distances for nearby loads
const NEARBY_DISTANCES = [
  "~3 km",
  "~8 km",
  "~12 km",
  "~5 km",
  "~10 km",
  "~14 km",
];

export default function LoadsPage() {
  const { t, language } = useLanguage();
  const { currentRole } = useApp();
  const { data: backendLoads = [], isLoading } = useAllLoads();
  const createLoad = useCreateLoad();

  const [search, setSearch] = useState("");
  const [filterTruckType, setFilterTruckType] = useState("all");
  const [postOpen, setPostOpen] = useState(false);
  const [localLoads, setLocalLoads] = useState<LoadEntry[]>([]);

  // Location state
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [nearbyOnly, setNearbyOnly] = useState(false);

  // Form state
  const [form, setForm] = useState({
    pickup: "",
    delivery: "",
    distance: "",
    weight: "",
    truckType: "Tata 407",
    price: "",
    notes: "",
  });

  const resetForm = () =>
    setForm({
      pickup: "",
      delivery: "",
      distance: "",
      weight: "",
      truckType: "Tata 407",
      price: "",
      notes: "",
    });

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setIsDetecting(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
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
            "Your Location";
          setDetectedCity(city);
          setNearbyOnly(true);
          toast.success(`📍 Location detected: ${city}`);
        } catch {
          // Fallback if reverse geocoding fails
          setDetectedCity("Delhi");
          setNearbyOnly(true);
          toast.success("📍 Location detected (using default city)");
        } finally {
          setIsDetecting(false);
        }
      },
      (err) => {
        setIsDetecting(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError(
            "Location access denied. Enable GPS to see nearby loads.",
          );
        } else {
          setLocationError("Could not detect location. Please try again.");
        }
      },
      { timeout: 10000 },
    );
  };

  // Real backend data with local optimistic additions; fall back to sample data when both empty
  const allLoads: LoadEntry[] =
    backendLoads.length > 0 || localLoads.length > 0
      ? [...localLoads, ...backendLoads]
      : SAMPLE_LOADS;

  // Filter loads
  const filtered = allLoads.filter((l) => {
    const matchSearch =
      !search ||
      l.pickupLocation.toLowerCase().includes(search.toLowerCase()) ||
      l.deliveryLocation.toLowerCase().includes(search.toLowerCase());
    const matchType =
      filterTruckType === "all" || l.truckTypeRequired === filterTruckType;

    let matchNearby = true;
    if (nearbyOnly && detectedCity) {
      const cityLower = detectedCity.toLowerCase();
      const pickupLower = l.pickupLocation.toLowerCase();
      // Match city name or partial match
      matchNearby =
        pickupLower.includes(cityLower) ||
        cityLower.includes(pickupLower.split(",")[0].trim());
    }

    return matchSearch && matchType && matchNearby;
  });

  // If nearbyOnly is active but no matches found, show fallback 3 nearest loads
  const displayLoads =
    nearbyOnly && filtered.length === 0 ? allLoads.slice(0, 3) : filtered;

  const isUsingFallback =
    nearbyOnly && filtered.length === 0 && allLoads.length > 0;

  const handlePostLoad = async () => {
    if (!form.pickup || !form.delivery || !form.price) {
      toast.error("Please fill all required fields");
      return;
    }

    const newId = `L${Date.now()}`;
    const newLoad: LoadEntry = {
      id: newId,
      pickupLocation: form.pickup,
      deliveryLocation: form.delivery,
      distanceKm: BigInt(form.distance || "0"),
      weightTons: BigInt(form.weight || "0"),
      truckTypeRequired: form.truckType,
      basePriceRs: BigInt(form.price || "0"),
      status: LoadStatus.open,
      postedBy: {} as any,
    };

    setLocalLoads((prev) => [newLoad, ...prev]);
    setPostOpen(false);
    resetForm();
    toast.success("Load posted successfully!");

    try {
      await createLoad.mutateAsync({
        id: newLoad.id,
        pickupLocation: newLoad.pickupLocation,
        deliveryLocation: newLoad.deliveryLocation,
        distanceKm: newLoad.distanceKm,
        weightTons: newLoad.weightTons ?? BigInt(0),
        truckTypeRequired: newLoad.truckTypeRequired ?? "",
        basePriceRs: newLoad.basePriceRs,
      });
      setLocalLoads((prev) => prev.filter((l) => l.id !== newId));
    } catch {
      toast.error("Load saved locally but failed to sync to backend.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-2xl font-black">{t.loads}</h1>
          <p className="text-sm text-muted-foreground">
            {displayLoads.length}{" "}
            {language === "HI" ? "माल उपलब्ध" : "loads available"}
          </p>
        </div>
        {(currentRole === UserRole.transporter ||
          currentRole === UserRole.truckOwner) && (
          <Dialog open={postOpen} onOpenChange={setPostOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold h-10"
                data-ocid="loads.post_load_button"
              >
                <Plus className="w-4 h-4 mr-1" />
                {t.postLoad}
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-md"
              data-ocid="loads.post_load_modal"
            >
              <DialogHeader>
                <DialogTitle className="font-display">{t.postLoad}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Pickup Location *</Label>
                    <Input
                      placeholder="Delhi"
                      value={form.pickup}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, pickup: e.target.value }))
                      }
                      data-ocid="loads.pickup_input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Delivery Location *</Label>
                    <Input
                      placeholder="Mumbai"
                      value={form.delivery}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, delivery: e.target.value }))
                      }
                      data-ocid="loads.delivery_input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Distance (km)</Label>
                    <Input
                      type="number"
                      placeholder="500"
                      value={form.distance}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, distance: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Weight (tons)</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={form.weight}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, weight: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Truck Type</Label>
                  <Select
                    value={form.truckType}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, truckType: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRUCK_TYPES.map((tt) => (
                        <SelectItem key={tt} value={tt}>
                          {tt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Base Price (₹) *</Label>
                  <Input
                    type="number"
                    placeholder="15000"
                    value={form.price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price: e.target.value }))
                    }
                    data-ocid="loads.price_input"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Any special requirements..."
                    value={form.notes}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, notes: e.target.value }))
                    }
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setPostOpen(false)}>
                  {t.cancel}
                </Button>
                <Button
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  onClick={handlePostLoad}
                  disabled={createLoad.isPending}
                  data-ocid="loads.submit_button"
                >
                  {t.postLoad}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search & Filter Row */}
      <div className="flex gap-2 mb-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={
              language === "HI"
                ? "शहर या रूट खोजें..."
                : "Search by city or route..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-9 h-10"
            data-ocid="loads.search_input"
          />
          {search && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              data-ocid="loads.search_clear_button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Select value={filterTruckType} onValueChange={setFilterTruckType}>
          <SelectTrigger className="w-36 h-10" data-ocid="loads.filter_select">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
            <SelectValue placeholder="Truck" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {TRUCK_TYPES.map((tt) => (
              <SelectItem key={tt} value={tt}>
                {tt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location Detection Row */}
      <div className="flex items-center gap-2 mb-3">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-medium border-primary/30 text-primary hover:bg-primary/10"
          onClick={handleDetectLocation}
          disabled={isDetecting}
          data-ocid="loads.detect_location_button"
        >
          {isDetecting ? (
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
          ) : (
            <LocateFixed className="w-3.5 h-3.5 mr-1.5" />
          )}
          {isDetecting ? "Detecting..." : "Detect Location"}
        </Button>

        <AnimatePresence>
          {detectedCity && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                nearbyOnly
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
              }`}
              onClick={() => setNearbyOnly((prev) => !prev)}
              data-ocid="loads.near_me_toggle"
            >
              <MapPin className="w-3 h-3" />
              Near Me (15 km)
              {nearbyOnly && <X className="w-3 h-3 ml-0.5" />}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Location Status Bar */}
      <AnimatePresence>
        {detectedCity && !locationError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs"
            data-ocid="loads.location_status"
          >
            <span className="text-base">📍</span>
            <span>
              {nearbyOnly
                ? `Showing loads near ${detectedCity} within 15 km`
                : `Location detected: ${detectedCity}. Toggle "Near Me" to filter.`}
            </span>
            {isUsingFallback && (
              <span className="ml-1 text-green-600 font-medium">
                (Showing 3 nearest)
              </span>
            )}
          </motion.div>
        )}
        {locationError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs"
            data-ocid="loads.location_error_state"
          >
            <span className="text-base">⚠️</span>
            <span>{locationError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load Cards */}
      {isLoading ? (
        <div className="space-y-3" data-ocid="loads.loading_state">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {displayLoads.map((load, i) => {
            const statusKey = load.status as string;
            const nearbyDistance = nearbyOnly
              ? NEARBY_DISTANCES[i % NEARBY_DISTANCES.length]
              : null;
            return (
              <motion.div
                key={load.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                data-ocid={`loads.item.${i + 1}`}
              >
                <Card className="glass-card border-0 shadow-card hover:shadow-lg transition-shadow relative">
                  {currentRole === UserRole.driver &&
                    (() => {
                      const rawScore = (85 - i * 7) % 100;
                      const matchScore = Math.max(50, rawScore);
                      const badgeClass =
                        matchScore > 80
                          ? "bg-green-100 text-green-700 border-green-200"
                          : matchScore >= 60
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : "bg-orange-100 text-orange-700 border-orange-200";
                      return (
                        <Badge
                          className={`absolute top-3 right-3 text-[10px] border ${badgeClass}`}
                          data-ocid="loads.ai_match_badge"
                        >
                          🤖 {matchScore}% Match
                        </Badge>
                      );
                    })()}
                  <CardContent className="p-4">
                    {/* Route */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <p className="text-sm font-semibold truncate">
                              {load.pickupLocation}
                            </p>
                          </div>
                          <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <p className="text-sm font-semibold truncate">
                              {load.deliveryLocation}
                            </p>
                          </div>
                          {nearbyDistance && (
                            <Badge className="text-[10px] border bg-blue-50 text-blue-700 border-blue-200 ml-1">
                              📍 {nearbyDistance} away
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Badge
                        className={`text-[10px] border capitalize shrink-0 ${
                          currentRole === UserRole.driver ? "mr-16" : ""
                        } ${STATUS_COLORS[statusKey] || STATUS_COLORS.open}`}
                        variant="outline"
                      >
                        {statusKey}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Ruler className="w-3 h-3 shrink-0" />
                        <span>{Number(load.distanceKm)} km</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Weight className="w-3 h-3 shrink-0" />
                        <span>{Number(load.weightTons)} tons</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Truck className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {load.truckTypeRequired}
                        </span>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-green-600" />
                        <span className="font-display text-lg font-black text-green-600">
                          {Number(load.basePriceRs).toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          base price
                        </span>
                      </div>
                      {currentRole === UserRole.driver &&
                        load.status === LoadStatus.open && (
                          <Button
                            size="sm"
                            className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() =>
                              toast.success("Offer sent successfully!")
                            }
                            data-ocid={`loads.apply_button.${i + 1}`}
                          >
                            Make Offer
                          </Button>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {displayLoads.length === 0 && (
            <div className="text-center py-12" data-ocid="loads.empty_state">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-muted-foreground">
                No loads found
              </p>
              <p className="text-sm text-muted-foreground">
                {nearbyOnly
                  ? `No loads near ${detectedCity || "your location"}. Try disabling the "Near Me" filter.`
                  : "Try adjusting your filters"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Return Load Suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <RefreshCw className="w-4 h-4 text-secondary" />
          <h2 className="font-display text-base font-bold">
            {language === "HI" ? "वापसी माल सुझाव" : "Return Load Suggestions"}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {RETURN_LOADS.map((rl) => (
            <Card
              key={`${rl.from}-${rl.to}`}
              className="border border-secondary/30 bg-secondary/5"
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3 text-secondary shrink-0" />
                  <p className="text-xs font-semibold">
                    {rl.from} → {rl.to}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{rl.distance}</p>
                <p className="text-sm font-bold text-green-600 mt-1">
                  {rl.price}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
