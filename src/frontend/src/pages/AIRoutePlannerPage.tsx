import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Fuel,
  MapPin,
  Navigation,
  ParkingSquare,
  Utensils,
} from "lucide-react";
import { useState } from "react";

interface RouteResult {
  distance: string;
  duration: string;
  toll: string;
  fuel: string;
  savings: string;
  warnings: string[];
  waypoints: {
    type: string;
    name: string;
    location: string;
    distance: string;
  }[];
}

const routeData: Record<string, RouteResult> = {
  "delhi-mumbai": {
    distance: "1,420 km",
    duration: "22-24 hrs",
    toll: "₹1,850",
    fuel: "₹8,200",
    savings: "₹3,200 vs. alternate route",
    warnings: [
      "Low bridge at Nashik bypass (4.2m height limit)",
      "No-truck zone: Mumbai city 8am–10pm",
    ],
    waypoints: [
      {
        type: "fuel",
        name: "HPCL Pump – Mathura",
        location: "Mathura, UP",
        distance: "160 km",
      },
      {
        type: "parking",
        name: "Agra Truck Terminal",
        location: "Agra, UP",
        distance: "220 km",
      },
      {
        type: "dhaba",
        name: "Bhopal Highway Dhaba",
        location: "Bhopal, MP",
        distance: "780 km",
      },
      {
        type: "fuel",
        name: "Indian Oil – Nagpur",
        location: "Nagpur, MH",
        distance: "1,090 km",
      },
      {
        type: "parking",
        name: "Pune Freight Hub",
        location: "Pune, MH",
        distance: "1,280 km",
      },
    ],
  },
  "delhi-kolkata": {
    distance: "1,460 km",
    duration: "24-26 hrs",
    toll: "₹1,550",
    fuel: "₹8,400",
    savings: "₹1,800 vs. NH-2",
    warnings: ["Heavy rain possible near Varanasi (seasonal)"],
    waypoints: [
      {
        type: "fuel",
        name: "BPCL Pump – Kanpur",
        location: "Kanpur, UP",
        distance: "480 km",
      },
      {
        type: "dhaba",
        name: "Allahabad Dhaba",
        location: "Prayagraj, UP",
        distance: "680 km",
      },
      {
        type: "parking",
        name: "Varanasi Truck Stand",
        location: "Varanasi, UP",
        distance: "780 km",
      },
      {
        type: "fuel",
        name: "HP Fuel Station – Dhanbad",
        location: "Dhanbad, JH",
        distance: "1,150 km",
      },
    ],
  },
  default: {
    distance: "320 km",
    duration: "5-6 hrs",
    toll: "₹420",
    fuel: "₹1,840",
    savings: "₹640 vs. alternate",
    warnings: [],
    waypoints: [
      {
        type: "fuel",
        name: "Nearest HPCL",
        location: "Midway point",
        distance: "160 km",
      },
      {
        type: "dhaba",
        name: "Highway Dhaba",
        location: "Midway",
        distance: "180 km",
      },
    ],
  },
};

const waypointIcon = (type: string) => {
  if (type === "fuel") return <Fuel className="w-4 h-4 text-orange-500" />;
  if (type === "parking")
    return <ParkingSquare className="w-4 h-4 text-blue-500" />;
  return <Utensils className="w-4 h-4 text-green-600" />;
};

export default function AIRoutePlannerPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [result, setResult] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);

  const planRoute = () => {
    if (!from || !to) return;
    setLoading(true);
    setTimeout(() => {
      const key = `${from.toLowerCase()}-${to.toLowerCase()}`;
      setResult(routeData[key] || routeData.default);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Route Planner</h1>
        <p className="text-muted-foreground text-sm">
          Truck-friendly routes with toll, fuel & stop details
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Plan Your Route</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>From City</Label>
              <Input
                placeholder="e.g. Delhi"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                data-ocid="route.from_input"
              />
            </div>
            <div className="space-y-1">
              <Label>To City</Label>
              <Input
                placeholder="e.g. Mumbai"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                data-ocid="route.to_input"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Truck Type</Label>
            <Select>
              <SelectTrigger data-ocid="route.truck_type_select">
                <SelectValue placeholder="Select truck type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tata407">Tata 407</SelectItem>
                <SelectItem value="14tyre">14 Tyre Truck</SelectItem>
                <SelectItem value="trailer">Trailer / Container</SelectItem>
                <SelectItem value="tanker">Tanker</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full"
            onClick={planRoute}
            disabled={loading || !from || !to}
            data-ocid="route.plan_button"
          >
            {loading ? (
              <span className="animate-pulse">AI Planning Route...</span>
            ) : (
              <>
                <Navigation className="w-4 h-4 mr-2" />
                Plan Route
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Navigation className="w-4 h-4 text-primary" />
                Route Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Distance", value: result.distance },
                  { label: "Est. Duration", value: result.duration },
                  { label: "Total Toll", value: result.toll },
                  { label: "Fuel Cost", value: result.fuel },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center p-2 bg-background rounded-lg border"
                  >
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="font-bold text-foreground mt-0.5">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  💰 Savings: {result.savings}
                </p>
              </div>
            </CardContent>
          </Card>

          {result.warnings.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold text-orange-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Alerts & Warnings
                </h3>
                {result.warnings.map((w) => (
                  <p key={w} className="text-sm text-orange-700">
                    {w}
                  </p>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Stops Along Route</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.waypoints.map((wp, i) => (
                <div
                  key={wp.name}
                  className="flex items-center gap-3 p-2 bg-muted/40 rounded-lg"
                  data-ocid={`route.waypoint.item.${i + 1}`}
                >
                  <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center shrink-0">
                    {waypointIcon(wp.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{wp.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {wp.location}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {wp.distance}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
