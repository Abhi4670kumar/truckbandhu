import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowRight, Clock, IndianRupee, MapPin, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import type { TripEntry } from "../hooks/useQueries";
import { useAllTrips, useUpdateTripStatus } from "../hooks/useQueries";
import { TripStatus } from "../types/appTypes";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  pending: { label: "Pending", color: "status-pending", dot: "bg-gray-400" },
  accepted: { label: "Accepted", color: "status-accepted", dot: "bg-blue-500" },
  loading: { label: "Loading", color: "status-loading", dot: "bg-orange-500" },
  inTransit: {
    label: "In Transit",
    color: "status-intransit",
    dot: "bg-purple-500",
  },
  delivered: {
    label: "Delivered",
    color: "status-delivered",
    dot: "bg-green-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "status-cancelled",
    dot: "bg-red-500",
  },
};

const NEXT_STATUS: Record<string, TripStatus> = {
  pending: TripStatus.accepted,
  accepted: TripStatus.loading,
  loading: TripStatus.inTransit,
  inTransit: TripStatus.delivered,
};

const SAMPLE_TRIPS: TripEntry[] = [
  {
    id: "T001",
    pickupLocation: "Delhi, NH8 Toll Plaza",
    deliveryLocation: "Jaipur, MG Road Depot",
    status: TripStatus.inTransit,
    distanceKm: BigInt(270),
    agreedPriceRs: BigInt(18500),
    advanceAmountRs: BigInt(5000),
    remainingAmountRs: BigInt(13500),
    truckId: "DL01T1234",
    driverId: "Ramesh Kumar",
    paymentStatus: "partial",
    loadId: "L001",
    createdAt: BigInt(Date.now()),
  },
  {
    id: "T002",
    pickupLocation: "Mumbai, JNPT Port",
    deliveryLocation: "Pune, Pimpri Industrial",
    status: TripStatus.loading,
    distanceKm: BigInt(148),
    agreedPriceRs: BigInt(8200),
    advanceAmountRs: BigInt(3000),
    remainingAmountRs: BigInt(5200),
    truckId: "MH12T5678",
    driverId: "Suresh Singh",
    paymentStatus: "partial",
    loadId: "L002",
    createdAt: BigInt(Date.now()),
  },
  {
    id: "T003",
    pickupLocation: "Chennai, Koyambedu Market",
    deliveryLocation: "Bangalore, Yeshwanthpur",
    status: TripStatus.delivered,
    distanceKm: BigInt(346),
    agreedPriceRs: BigInt(22000),
    advanceAmountRs: BigInt(22000),
    remainingAmountRs: BigInt(0),
    truckId: "TN09T9012",
    driverId: "Vijay Reddy",
    paymentStatus: "paid",
    loadId: "L003",
    createdAt: BigInt(Date.now()),
  },
];

export default function TripsPage() {
  const { language } = useLanguage();
  const { data: backendTrips = [], isLoading } = useAllTrips();
  const updateStatus = useUpdateTripStatus();
  const [selectedTrip, setSelectedTrip] = useState<TripEntry | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Use real backend trips when available, fall back to sample data
  const trips = backendTrips.length > 0 ? backendTrips : SAMPLE_TRIPS;

  const filtered = trips.filter((trip) =>
    filterStatus === "all" ? true : (trip.status as string) === filterStatus,
  );

  const handleUpdateStatus = async (tripId: string, newStatus: TripStatus) => {
    try {
      await updateStatus.mutateAsync({ id: tripId, status: newStatus });
      toast.success(
        `Trip status updated to ${
          STATUS_CONFIG[newStatus as string]?.label || newStatus
        }`,
      );
    } catch {
      toast.error("Failed to update trip status");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-2xl font-black">
            {language === "HI" ? "यात्राएं" : "Trips"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} trips
          </p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32 h-9" data-ocid="trips.status_select">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <SelectItem key={key} value={key}>
                {cfg.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button
            type="button"
            key={key}
            onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-all ${
              filterStatus === key
                ? `${cfg.color} border`
                : "bg-muted text-muted-foreground border-transparent"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((trip, i) => {
            const status = trip.status as string;
            const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
            const nextStatus = NEXT_STATUS[status];

            return (
              <motion.div
                key={trip.id || i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                data-ocid={`trips.item.${i + 1}`}
              >
                <Card className="glass-card border-0 shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold truncate">
                            {trip.pickupLocation.split(",")[0]} →{" "}
                            {trip.deliveryLocation.split(",")[0]}
                          </p>
                          <Badge
                            className={`shrink-0 text-[10px] border px-2 ${cfg.color}`}
                            variant="outline"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${cfg.dot} mr-1`}
                            />
                            {cfg.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {Number(trip.distanceKm)} km
                          </span>
                          <span className="flex items-center gap-1">
                            <IndianRupee className="w-3 h-3 text-green-600" />
                            <span className="font-semibold text-green-600">
                              {Number(trip.agreedPriceRs).toLocaleString(
                                "en-IN",
                              )}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment info */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 bg-muted/60 rounded-xl mb-3 text-xs">
                      <div className="text-center">
                        <p className="text-muted-foreground">Agreed</p>
                        <p className="font-bold">
                          ₹{Number(trip.agreedPriceRs).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="text-center border-x border-border">
                        <p className="text-muted-foreground">Advance</p>
                        <p className="font-bold text-green-600">
                          ₹
                          {Number(trip.advanceAmountRs).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Remaining</p>
                        <p className="font-bold text-orange-600">
                          ₹
                          {Number(trip.remainingAmountRs).toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs"
                            onClick={() => setSelectedTrip(trip)}
                          >
                            View Details
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="max-h-[80vh]">
                          <SheetHeader>
                            <SheetTitle className="font-display">
                              Trip Details
                            </SheetTitle>
                          </SheetHeader>
                          {selectedTrip && (
                            <div className="space-y-4 mt-4 overflow-y-auto">
                              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-green-500" />
                                    <span className="font-medium">
                                      {selectedTrip.pickupLocation}
                                    </span>
                                  </div>
                                  <div className="border-l-2 border-dashed border-muted-foreground ml-2 my-1 h-4" />
                                  <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                    <span className="font-medium">
                                      {selectedTrip.deliveryLocation}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-muted rounded-xl">
                                  <p className="text-xs text-muted-foreground">
                                    Driver
                                  </p>
                                  <p className="font-semibold text-sm">
                                    {selectedTrip.driverId}
                                  </p>
                                </div>
                                <div className="p-3 bg-muted rounded-xl">
                                  <p className="text-xs text-muted-foreground">
                                    Truck
                                  </p>
                                  <p className="font-semibold text-sm">
                                    {selectedTrip.truckId}
                                  </p>
                                </div>
                                <div className="p-3 bg-muted rounded-xl">
                                  <p className="text-xs text-muted-foreground">
                                    Distance
                                  </p>
                                  <p className="font-semibold text-sm">
                                    {Number(selectedTrip.distanceKm)} km
                                  </p>
                                </div>
                                <div className="p-3 bg-muted rounded-xl">
                                  <p className="text-xs text-muted-foreground">
                                    Payment
                                  </p>
                                  <p className="font-semibold text-sm capitalize">
                                    {selectedTrip.paymentStatus}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </SheetContent>
                      </Sheet>

                      {nextStatus &&
                        status !== "delivered" &&
                        status !== "cancelled" && (
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-primary hover:bg-primary/90"
                            onClick={() =>
                              handleUpdateStatus(trip.id, nextStatus)
                            }
                            disabled={updateStatus.isPending}
                            data-ocid="trips.update_status_button"
                          >
                            <ArrowRight className="w-3 h-3 mr-1" />
                            {STATUS_CONFIG[nextStatus as string]?.label ||
                              "Update"}
                          </Button>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12" data-ocid="trips.empty_state">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-muted-foreground">
                No trips found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
