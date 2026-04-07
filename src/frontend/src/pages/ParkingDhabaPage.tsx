import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Navigation,
  ParkingSquare,
  Phone,
  Star,
  Utensils,
} from "lucide-react";

const parkingSpots = [
  {
    id: 1,
    name: "Kundli Truck Parking",
    distance: "1.2 km",
    slots: 15,
    total: 50,
    rating: 4.2,
    phone: "9876543210",
    address: "NH-44, Kundli, Haryana",
    amenities: ["Security", "Toilet", "Water"],
  },
  {
    id: 2,
    name: "Panipat Depot Parking",
    distance: "3.5 km",
    slots: 0,
    total: 80,
    rating: 3.9,
    phone: "9765432109",
    address: "GT Road, Panipat",
    amenities: ["CCTV", "Dhaba nearby"],
  },
  {
    id: 3,
    name: "Murthal Truck Stand",
    distance: "0.9 km",
    slots: 32,
    total: 60,
    rating: 4.6,
    phone: "9654321098",
    address: "NH-44, Murthal, Sonepat",
    amenities: ["Security", "Toilet", "Mechanic", "Dhaba"],
  },
  {
    id: 4,
    name: "Ambala Freight Hub",
    distance: "7.1 km",
    slots: 5,
    total: 120,
    rating: 4.1,
    phone: "9543210987",
    address: "Ambala Cantt, Haryana",
    amenities: ["CCTV", "Water", "Toilet"],
  },
  {
    id: 5,
    name: "Shahabad Bypass Parking",
    distance: "4.8 km",
    slots: 22,
    total: 40,
    rating: 4.4,
    phone: "9432109876",
    address: "NH-44, Shahabad",
    amenities: ["Security", "Water"],
  },
];

const dhabas = [
  {
    id: 1,
    name: "Amrik Sukhdev Dhaba",
    distance: "0.3 km",
    rating: 4.9,
    specialty: "Rajma Chawal, Lassi",
    phone: "9876500001",
    address: "Murthal, Sonepat, Haryana",
    open24h: true,
  },
  {
    id: 2,
    name: "Gulshan Dhaba",
    distance: "1.1 km",
    rating: 4.5,
    specialty: "Dal Makhni, Butter Roti",
    phone: "9876500002",
    address: "GT Karnal Road, Panipat",
    open24h: false,
  },
  {
    id: 3,
    name: "Highway King Dhaba",
    distance: "2.4 km",
    rating: 4.3,
    specialty: "Sarson Ka Saag, Makki Roti",
    phone: "9876500003",
    address: "NH-48, Manesar",
    open24h: true,
  },
  {
    id: 4,
    name: "Punjab Da Swad",
    distance: "3.8 km",
    rating: 4.7,
    specialty: "Chicken Curry, Naan",
    phone: "9876500004",
    address: "Ambala City Bypass",
    open24h: false,
  },
  {
    id: 5,
    name: "Kake Di Hatti Dhaba",
    distance: "1.7 km",
    rating: 4.4,
    specialty: "Chole Bhature, Chai",
    phone: "9876500005",
    address: "Delhi-Agra Highway, Faridabad",
    open24h: true,
  },
  {
    id: 6,
    name: "Desi Tadka Restaurant",
    distance: "5.2 km",
    rating: 4.2,
    specialty: "Thali, Lassi",
    phone: "9876500006",
    address: "NH-19, Mathura Road",
    open24h: false,
  },
];

export default function ParkingDhabaPage() {
  return (
    <div className="p-4 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Parking & Dhaba Finder
        </h1>
        <p className="text-muted-foreground text-sm">
          Find safe parking and highway rest spots
        </p>
      </div>

      <Tabs defaultValue="parking">
        <TabsList className="w-full">
          <TabsTrigger
            value="parking"
            className="flex-1"
            data-ocid="parking.parking_tab"
          >
            <ParkingSquare className="w-4 h-4 mr-1" />
            Parking
          </TabsTrigger>
          <TabsTrigger
            value="dhabas"
            className="flex-1"
            data-ocid="parking.dhabas_tab"
          >
            <Utensils className="w-4 h-4 mr-1" />
            Dhabas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parking" className="space-y-3 mt-4">
          {parkingSpots.map((p, i) => (
            <Card key={p.id} data-ocid={`parking.item.${i + 1}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{p.name}</h3>
                      <Badge
                        variant="outline"
                        className={
                          p.slots > 0
                            ? "text-green-700 border-green-300 bg-green-50"
                            : "text-red-700 border-red-300 bg-red-50"
                        }
                      >
                        {p.slots > 0 ? `${p.slots} slots free` : "Full"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {p.address}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {p.distance}
                      </span>
                      <span className="flex items-center gap-0.5 text-xs text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {p.rating}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.amenities.map((a) => (
                        <Badge key={a} variant="secondary" className="text-xs">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    data-ocid={`parking.call.button.${i + 1}`}
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    data-ocid={`parking.directions.button.${i + 1}`}
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="dhabas" className="space-y-3 mt-4">
          {dhabas.map((d, i) => (
            <Card key={d.id} data-ocid={`parking.dhaba.item.${i + 1}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{d.name}</h3>
                      {d.open24h && (
                        <Badge className="bg-orange-500 text-white text-xs">
                          24 घंटे
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {d.address}
                    </p>
                    <p className="text-xs text-primary mt-1 font-medium">
                      <Utensils className="w-3 h-3 inline mr-1" />
                      {d.specialty}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {d.distance}
                      </span>
                      <span className="flex items-center gap-0.5 text-xs text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {d.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    data-ocid={`parking.dhaba.call.button.${i + 1}`}
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    data-ocid={`parking.dhaba.directions.button.${i + 1}`}
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
