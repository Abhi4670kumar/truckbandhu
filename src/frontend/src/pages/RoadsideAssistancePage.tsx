import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Moon, Phone, Star, Wrench } from "lucide-react";
import { useState } from "react";

const serviceProviders = [
  {
    id: 1,
    name: "Sharma Puncture Wala",
    type: "Puncture Repair",
    distance: "0.8 km",
    rating: 4.5,
    phone: "9876543210",
    nightService: true,
    address: "NH-44, Near Toll Plaza, Panipat",
  },
  {
    id: 2,
    name: "Singh Truck Garage",
    type: "Truck Mechanic",
    distance: "1.2 km",
    rating: 4.8,
    phone: "9765432109",
    nightService: true,
    address: "GT Road, Ambala Cantt",
  },
  {
    id: 3,
    name: "Raju Tow Service",
    type: "Tow Truck",
    distance: "2.1 km",
    rating: 4.3,
    phone: "9654321098",
    nightService: false,
    address: "NH-48, Manesar, Gurgaon",
  },
  {
    id: 4,
    name: "Vijay Battery Works",
    type: "Battery Repair",
    distance: "1.5 km",
    rating: 4.6,
    phone: "9543210987",
    nightService: true,
    address: "Industrial Area, Ludhiana",
  },
  {
    id: 5,
    name: "Om Sai Mechanics",
    type: "Truck Mechanic",
    distance: "3.0 km",
    rating: 4.2,
    phone: "9432109876",
    nightService: false,
    address: "Bypass Road, Agra",
  },
  {
    id: 6,
    name: "Balaji Tyre Centre",
    type: "Puncture Repair",
    distance: "0.5 km",
    rating: 4.7,
    phone: "9321098765",
    nightService: true,
    address: "Delhi-Jaipur Highway, Gurgaon",
  },
  {
    id: 7,
    name: "Rahul Breakdown Service",
    type: "Tow Truck",
    distance: "4.2 km",
    rating: 4.1,
    phone: "9210987654",
    nightService: true,
    address: "NH-19, Kanpur Bypass",
  },
  {
    id: 8,
    name: "Mahindra Battery Hub",
    type: "Battery Repair",
    distance: "2.8 km",
    rating: 4.4,
    phone: "9109876543",
    nightService: false,
    address: "Truck Terminal, Nagpur",
  },
];

const typeColors: Record<string, string> = {
  "Puncture Repair": "bg-orange-100 text-orange-700 border-orange-200",
  "Truck Mechanic": "bg-blue-100 text-blue-700 border-blue-200",
  "Tow Truck": "bg-red-100 text-red-700 border-red-200",
  "Battery Repair": "bg-green-100 text-green-700 border-green-200",
};

const filters = [
  "All",
  "Puncture Repair",
  "Truck Mechanic",
  "Tow Truck",
  "Battery Repair",
];

export default function RoadsideAssistancePage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sosPressed, setSosPressed] = useState(false);

  const filtered =
    activeFilter === "All"
      ? serviceProviders
      : serviceProviders.filter((p) => p.type === activeFilter);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Roadside Assistance
        </h1>
        <p className="text-muted-foreground text-sm">
          Emergency help — tyre, mechanic, tow, battery
        </p>
      </div>

      {/* SOS Button */}
      <button
        type="button"
        data-ocid="roadside.sos_button"
        className={`w-full py-5 rounded-2xl text-white text-xl font-bold flex items-center justify-center gap-3 shadow-lg transition-all duration-200 ${
          sosPressed
            ? "bg-red-700 scale-95"
            : "bg-red-500 hover:bg-red-600 active:scale-95"
        }`}
        onClick={() => {
          setSosPressed(true);
          setTimeout(() => setSosPressed(false), 2000);
        }}
      >
        <AlertTriangle className="w-7 h-7" />
        {sosPressed ? "SOS Sent! Help Coming..." : "🆘 Emergency SOS"}
      </button>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            data-ocid="roadside.filter.tab"
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
              activeFilter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary"
            }`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Providers */}
      <div className="space-y-3">
        {filtered.map((p, i) => (
          <Card key={p.id} data-ocid={`roadside.item.${i + 1}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{p.name}</h3>
                    {p.nightService && (
                      <Badge
                        variant="outline"
                        className="text-purple-700 border-purple-300 bg-purple-50 text-xs gap-1"
                      >
                        <Moon className="w-3 h-3" /> Night
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {p.address}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${typeColors[p.type]}`}
                    >
                      <Wrench className="w-3 h-3 mr-1" />
                      {p.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {p.distance}
                    </span>
                    <span className="flex items-center gap-0.5 text-xs text-amber-600">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {p.rating}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white shrink-0"
                  data-ocid={`roadside.call.button.${i + 1}`}
                >
                  <Phone className="w-4 h-4 mr-1" /> Call
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
