import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  Activity,
  Bell,
  Briefcase,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  Sparkles,
  TrendingUp,
  Truck,
  UserSearch,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useAdminStats, useAllLoads, useAllTrips } from "../hooks/useQueries";

const TRUCK_TYPES = [
  "Tata 407",
  "14 Tyre",
  "32 Ft",
  "20 Ft",
  "Container",
  "Trailer",
];

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  delay,
  ocid,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  delay: number;
  ocid?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      data-ocid={ocid}
    >
      <Card className="glass-card border-0 shadow-card overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium leading-tight mb-1">
                {label}
              </p>
              <p className="font-display text-2xl font-black">{value}</p>
              {sub && (
                <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
              )}
            </div>
            <div
              className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const TRIP_STATUS_COLORS: Record<string, string> = {
  pending: "status-pending",
  accepted: "status-accepted",
  loading: "status-loading",
  inTransit: "status-intransit",
  delivered: "status-delivered",
  cancelled: "status-cancelled",
};

const SAMPLE_TRIPS = [
  {
    id: "T001",
    from: "Delhi",
    to: "Jaipur",
    status: "inTransit",
    price: "₹18,500",
    driver: "Ramesh Kumar",
    distance: "270 km",
  },
  {
    id: "T002",
    from: "Mumbai",
    to: "Pune",
    status: "loading",
    price: "₹8,200",
    driver: "Suresh Singh",
    distance: "148 km",
  },
  {
    id: "T003",
    from: "Chennai",
    to: "Bangalore",
    status: "delivered",
    price: "₹22,000",
    driver: "Vijay Reddy",
    distance: "346 km",
  },
];

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const { currentRole, userName } = useApp();
  const { data: trips = [] } = useAllTrips();
  const { data: loads = [] } = useAllLoads();
  const { data: adminStats } = useAdminStats();

  // Transporter post load dialog state
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [postForm, setPostForm] = useState({
    pickup: "",
    delivery: "",
    distance: "",
    weight: "",
    truckType: "Tata 407",
    price: "",
    notes: "",
  });

  const resetPostForm = () =>
    setPostForm({
      pickup: "",
      delivery: "",
      distance: "",
      weight: "",
      truckType: "Tata 407",
      price: "",
      notes: "",
    });

  const handlePostLoad = () => {
    if (!postForm.pickup || !postForm.delivery || !postForm.price) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Load posted! Check Loads page to manage it.");
    setPostDialogOpen(false);
    resetPostForm();
  };

  const activeTrips = trips.filter(
    (t) => t.status !== "delivered" && t.status !== "cancelled",
  );
  const displayTrips = trips.length > 0 ? trips.slice(0, 3) : SAMPLE_TRIPS;

  const renderTruckOwnerDashboard = () => (
    <>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard
          icon={Truck}
          label={t.myTrucks}
          value="4"
          sub="2 Active"
          color="bg-blue-500"
          delay={0}
        />
        <StatCard
          icon={Activity}
          label={t.activeTrips}
          value={activeTrips.length || "3"}
          sub="On Road"
          color="bg-orange-500"
          delay={0.08}
        />
        <StatCard
          icon={Users}
          label={t.totalDrivers}
          value="6"
          sub="4 Available"
          color="bg-green-500"
          delay={0.16}
        />
        <StatCard
          icon={DollarSign}
          label={t.monthlyEarnings}
          value="₹1.2L"
          sub="+12% this month"
          color="bg-purple-500"
          delay={0.24}
        />
      </div>

      {/* FASTag Balance stat — 5th card on its own row */}
      <div className="mb-6">
        <StatCard
          icon={CreditCard}
          label="FASTag Balance"
          value="₹2,340"
          sub="Active"
          color="bg-teal-500"
          delay={0.32}
          ocid="dashboard.fastag_stat"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          {
            label: t.addTruck,
            icon: Truck,
            color:
              "bg-blue-500/10 text-blue-700 border-blue-200 hover:bg-blue-500/20",
            ocid: "dashboard.add_truck_button",
          },
          {
            label: t.postLoad,
            icon: Package,
            color:
              "bg-orange-500/10 text-orange-700 border-orange-200 hover:bg-orange-500/20",
            ocid: "dashboard.post_load_button",
          },
          {
            label: t.addDriver,
            icon: Users,
            color:
              "bg-green-500/10 text-green-700 border-green-200 hover:bg-green-500/20",
            ocid: "dashboard.add_driver_button",
          },
          {
            label: t.hireHelper,
            icon: Plus,
            color:
              "bg-purple-500/10 text-purple-700 border-purple-200 hover:bg-purple-500/20",
            ocid: "dashboard.hire_helper_button",
          },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${action.color}`}
              data-ocid={action.ocid}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-semibold text-center leading-tight">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </>
  );

  const renderDriverDashboard = () => (
    <>
      {/* AI Load Matches Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
        className="mb-4"
        data-ocid="dashboard.ai_match_banner"
      >
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 -translate-x-4 -translate-y-8" />
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <p className="font-display font-bold text-base leading-tight">
                  3 Loads Match Your Route
                </p>
                <p className="text-white/80 text-xs mt-0.5">
                  AI found loads near Delhi → Jaipur
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 border-white/40 text-white bg-white/10 hover:bg-white/20 hover:text-white text-xs h-8"
              data-ocid="dashboard.ai_match_view_button"
            >
              View Matches
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={Package}
          label={t.availableLoads}
          value={loads.length || "24"}
          sub="Near you"
          color="bg-blue-500"
          delay={0.08}
        />
        <StatCard
          icon={Truck}
          label={t.activeTrips}
          value={activeTrips.length || "1"}
          sub="Current"
          color="bg-orange-500"
          delay={0.16}
        />
        <StatCard
          icon={DollarSign}
          label={t.earnings}
          value="₹42,500"
          sub="This month"
          color="bg-green-500"
          delay={0.24}
        />
        <StatCard
          icon={TrendingUp}
          label="Rating"
          value="4.8★"
          sub="Excellent"
          color="bg-purple-500"
          delay={0.32}
        />
      </div>

      {activeTrips.length > 0 && (
        <Card className="glass-card border-0 shadow-card mb-6">
          <CardContent className="p-4">
            <h3 className="font-display font-bold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              Active Trip
            </h3>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
              <div className="flex-1">
                <p className="font-semibold text-sm">Delhi → Jaipur</p>
                <p className="text-xs text-muted-foreground">
                  270 km · Est. 5hrs
                </p>
              </div>
              <Badge className="status-intransit border text-xs">
                In Transit
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );

  const renderTransporterDashboard = () => (
    <>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={Package}
          label={t.postedLoads}
          value={loads.length || "8"}
          sub="Active"
          color="bg-blue-500"
          delay={0}
        />
        <StatCard
          icon={Activity}
          label={t.activeTrips}
          value={activeTrips.length || "5"}
          sub="On Road"
          color="bg-orange-500"
          delay={0.08}
        />
        <StatCard
          icon={DollarSign}
          label="Pending Payments"
          value="₹3.4L"
          sub="Due"
          color="bg-green-500"
          delay={0.16}
        />
        <StatCard
          icon={TrendingUp}
          label="Negotiations"
          value="3"
          sub="Pending"
          color="bg-purple-500"
          delay={0.24}
        />
      </div>

      <Button
        className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold mb-6"
        onClick={() => setPostDialogOpen(true)}
        data-ocid="dashboard.post_load_button"
      >
        <Plus className="w-4 h-4 mr-2" />
        {t.postLoad}
      </Button>

      {/* Post Load Dialog */}
      <Dialog open={postDialogOpen} onOpenChange={setPostDialogOpen}>
        <DialogContent
          className="max-w-md"
          data-ocid="dashboard.post_load_modal"
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
                  value={postForm.pickup}
                  onChange={(e) =>
                    setPostForm((p) => ({ ...p, pickup: e.target.value }))
                  }
                  data-ocid="dashboard.post_load_pickup_input"
                />
              </div>
              <div className="space-y-1">
                <Label>Delivery Location *</Label>
                <Input
                  placeholder="Mumbai"
                  value={postForm.delivery}
                  onChange={(e) =>
                    setPostForm((p) => ({ ...p, delivery: e.target.value }))
                  }
                  data-ocid="dashboard.post_load_delivery_input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Distance (km)</Label>
                <Input
                  type="number"
                  placeholder="500"
                  value={postForm.distance}
                  onChange={(e) =>
                    setPostForm((p) => ({ ...p, distance: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Weight (tons)</Label>
                <Input
                  type="number"
                  placeholder="10"
                  value={postForm.weight}
                  onChange={(e) =>
                    setPostForm((p) => ({ ...p, weight: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Truck Type</Label>
              <Select
                value={postForm.truckType}
                onValueChange={(v) =>
                  setPostForm((p) => ({ ...p, truckType: v }))
                }
              >
                <SelectTrigger data-ocid="dashboard.post_load_truck_select">
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
                value={postForm.price}
                onChange={(e) =>
                  setPostForm((p) => ({ ...p, price: e.target.value }))
                }
                data-ocid="dashboard.post_load_price_input"
              />
            </div>
            <div className="space-y-1">
              <Label>Notes</Label>
              <Textarea
                placeholder="Any special requirements..."
                value={postForm.notes}
                onChange={(e) =>
                  setPostForm((p) => ({ ...p, notes: e.target.value }))
                }
                rows={2}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setPostDialogOpen(false);
                resetPostForm();
              }}
              data-ocid="dashboard.post_load_cancel_button"
            >
              {t.cancel}
            </Button>
            <Button
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              onClick={handlePostLoad}
              data-ocid="dashboard.post_load_submit_button"
            >
              {t.postLoad}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={Users}
          label="Total Users"
          value={adminStats?.totalUsers?.toString() || "1,248"}
          sub="Registered"
          color="bg-blue-500"
          delay={0}
        />
        <StatCard
          icon={Activity}
          label={t.activeTrips}
          value={adminStats?.activeTrips?.toString() || "342"}
          sub="On Road"
          color="bg-orange-500"
          delay={0.08}
        />
        <StatCard
          icon={Clock}
          label="Pending KYC"
          value={adminStats?.pendingVerifications?.toString() || "47"}
          sub="To verify"
          color="bg-yellow-500"
          delay={0.16}
        />
        <StatCard
          icon={DollarSign}
          label="Revenue"
          value="₹24.8L"
          sub="This month"
          color="bg-green-500"
          delay={0.24}
        />
      </div>
    </>
  );

  const renderJobSeekerDashboard = () => (
    <>
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
        className="mb-4"
      >
        <div className="rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 p-4 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 -translate-x-4 -translate-y-8" />
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
              <Briefcase className="w-5 h-5 text-yellow-200" />
            </div>
            <div>
              <p className="font-display font-bold text-base leading-tight">
                Find Your Perfect Driving Job
              </p>
              <p className="text-white/80 text-xs mt-0.5">
                Post your profile and get noticed by employers near you
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={Eye}
          label="Profile Views"
          value="23"
          sub="This week"
          color="bg-teal-500"
          delay={0.08}
          ocid="dashboard.profile_views_stat"
        />
        <StatCard
          icon={Briefcase}
          label="Applications"
          value="3"
          sub="Submitted"
          color="bg-blue-500"
          delay={0.16}
        />
        <StatCard
          icon={Bell}
          label="Job Alerts"
          value="5"
          sub="New today"
          color="bg-orange-500"
          delay={0.24}
        />
        <StatCard
          icon={TrendingUp}
          label="Profile Complete"
          value="75%"
          sub="Add more details"
          color="bg-green-500"
          delay={0.32}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          {
            label: "Update Profile",
            icon: UserSearch,
            color:
              "bg-teal-500/10 text-teal-700 border-teal-200 hover:bg-teal-500/20",
            ocid: "dashboard.update_profile_button",
          },
          {
            label: "Browse Jobs",
            icon: Package,
            color:
              "bg-blue-500/10 text-blue-700 border-blue-200 hover:bg-blue-500/20",
            ocid: "dashboard.browse_jobs_button",
          },
          {
            label: "Join Community",
            icon: MessageSquare,
            color:
              "bg-purple-500/10 text-purple-700 border-purple-200 hover:bg-purple-500/20",
            ocid: "dashboard.join_community_button",
          },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${action.color}`}
              data-ocid={action.ocid}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-semibold text-center leading-tight">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="mb-2">
        <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-500" />
          Recent Activity
        </h3>
        <div className="space-y-2">
          {[
            {
              name: "Rajesh Transport Co.",
              city: "Delhi",
              time: "2 hrs ago",
              type: "Truck Owner",
            },
            {
              name: "Singh Logistics",
              city: "Gurgaon",
              time: "5 hrs ago",
              type: "Transporter",
            },
            {
              name: "Fast Freight Pvt Ltd",
              city: "Noida",
              time: "Yesterday",
              type: "Transporter",
            },
          ].map((activity) => (
            <Card
              key={activity.name}
              className="glass-card border-0 shadow-card"
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
                    <Eye className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {activity.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 inline mr-0.5" />
                      {activity.city} · {activity.type} viewed your profile
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {activity.time}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <p className="text-muted-foreground text-sm">
          {language === "HI" ? "नमस्ते 👋" : "Good morning 👋"}
        </p>
        <h1 className="font-display text-2xl font-black">
          {userName || "Welcome Back"}
        </h1>
        <p className="text-sm text-muted-foreground capitalize">
          {currentRole}
        </p>
      </motion.div>

      {/* Role-based stats */}
      {currentRole === "truckOwner" && renderTruckOwnerDashboard()}
      {currentRole === "driver" && renderDriverDashboard()}
      {currentRole === "transporter" && renderTransporterDashboard()}
      {currentRole === "admin" && renderAdminDashboard()}
      {currentRole === "jobSeeker" && renderJobSeekerDashboard()}

      {/* Recent Trips */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold">{t.activeTrips}</h2>
          <button
            type="button"
            className="text-xs text-primary flex items-center gap-1 hover:underline"
          >
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {displayTrips.map((trip, i) => {
            const isSample = "from" in trip;
            const from = isSample
              ? (trip as (typeof SAMPLE_TRIPS)[0]).from
              : trip.pickupLocation;
            const to = isSample
              ? (trip as (typeof SAMPLE_TRIPS)[0]).to
              : trip.deliveryLocation;
            const status = trip.status as string;
            const price = isSample
              ? (trip as (typeof SAMPLE_TRIPS)[0]).price
              : `₹${trip.agreedPriceRs}`;
            const statusKey = status === "inTransit" ? "intransit" : status;

            const tripKey = `${from}-${to}-${i}`;
            return (
              <Card
                key={tripKey}
                className="glass-card border-0 shadow-card"
                data-ocid={`trips.item.${i + 1}`}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-sm truncate">
                          {from} → {to}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          {isSample
                            ? (trip as (typeof SAMPLE_TRIPS)[0]).distance
                            : `${trip.distanceKm} km`}
                        </p>
                        <span className="text-xs text-muted-foreground">·</span>
                        <p className="text-xs font-semibold text-green-600">
                          {price}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={`shrink-0 text-[10px] border capitalize px-2 ${TRIP_STATUS_COLORS[status] || "status-pending"}`}
                      variant="outline"
                    >
                      {statusKey}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
