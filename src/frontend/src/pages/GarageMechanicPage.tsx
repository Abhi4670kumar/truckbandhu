import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Star, Wrench } from "lucide-react";
import { useState } from "react";

const garages = [
  {
    id: 1,
    name: "Singh Auto Works",
    owner: "Jaswant Singh",
    location: "GT Road, Ambala",
    services: ["Engine", "Tyres", "Brakes", "AC"],
    rating: 4.7,
    available: true,
    phone: "9876543210",
  },
  {
    id: 2,
    name: "Sharma Truck Centre",
    owner: "Vinod Sharma",
    location: "NH-44, Panipat",
    services: ["Engine", "Body Work", "Welding"],
    rating: 4.4,
    available: true,
    phone: "9765432109",
  },
  {
    id: 3,
    name: "Patel Diesel Workshop",
    owner: "Ramesh Patel",
    location: "Ring Road, Surat",
    services: ["Diesel Engine", "Fuel Pump", "Injector"],
    rating: 4.6,
    available: false,
    phone: "9654321098",
  },
  {
    id: 4,
    name: "Nair Mechanics Hub",
    owner: "Suresh Nair",
    location: "NH-66, Ernakulam",
    services: ["All Repairs", "FASTag", "AC"],
    rating: 4.8,
    available: true,
    phone: "9543210987",
  },
  {
    id: 5,
    name: "Gupta Truck Garage",
    owner: "Arvind Gupta",
    location: "Transport Nagar, Kanpur",
    services: ["Engine", "Tyres", "Suspension"],
    rating: 4.3,
    available: false,
    phone: "9432109876",
  },
  {
    id: 6,
    name: "Rao Multi Service",
    owner: "Krishna Rao",
    location: "Highway Bypass, Vijayawada",
    services: ["Body Work", "Painting", "Engine"],
    rating: 4.5,
    available: true,
    phone: "9321098765",
  },
];

const serviceOptions = [
  "Engine Repair",
  "Tyre Change",
  "Brakes",
  "Body Work",
  "Welding",
  "AC Repair",
  "Electrical",
  "FASTag Help",
  "Fuel System",
  "Suspension",
];

export default function GarageMechanicPage() {
  const [search, setSearch] = useState("");
  const [garageForm, setGarageForm] = useState({
    name: "",
    owner: "",
    phone: "",
    location: "",
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const filtered = garages.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.location.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleService = (s: string) => {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  const handleRegister = () => {
    setSubmitted(true);
    setGarageForm({ name: "", owner: "", phone: "", location: "" });
    setSelectedServices([]);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Garage & Mechanic
        </h1>
        <p className="text-muted-foreground text-sm">
          Find trusted mechanics or register your garage
        </p>
      </div>

      <Tabs defaultValue="find">
        <TabsList className="w-full">
          <TabsTrigger
            value="find"
            className="flex-1"
            data-ocid="garage.find_tab"
          >
            <Wrench className="w-4 h-4 mr-1" />
            Find Mechanic
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="flex-1"
            data-ocid="garage.register_tab"
          >
            Register Garage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="find" className="space-y-4 mt-4">
          <Input
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="garage.search_input"
          />
          {filtered.length === 0 && (
            <div
              className="text-center py-8 text-muted-foreground"
              data-ocid="garage.empty_state"
            >
              No garages found
            </div>
          )}
          {filtered.map((g, i) => (
            <Card key={g.id} data-ocid={`garage.item.${i + 1}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{g.name}</h3>
                      {g.available ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs border">
                          Available Now
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-red-700 border-red-200 text-xs"
                        >
                          Busy
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {g.location}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Owner: {g.owner}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {g.services.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-amber-600 font-medium">
                        {g.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    data-ocid={`garage.call.button.${i + 1}`}
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    data-ocid={`garage.book.button.${i + 1}`}
                  >
                    Book Mechanic
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="register" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Register Your Garage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {submitted && (
                <div
                  className="p-3 bg-green-50 border border-green-200 rounded-lg"
                  data-ocid="garage.success_state"
                >
                  <p className="text-sm text-green-700">
                    ✅ Garage registered! Our team will verify and list it
                    within 24 hours.
                  </p>
                </div>
              )}
              {[
                {
                  key: "name",
                  label: "Garage Name",
                  placeholder: "e.g. Singh Auto Works",
                },
                {
                  key: "owner",
                  label: "Owner Name",
                  placeholder: "Your full name",
                },
                {
                  key: "phone",
                  label: "Contact Number",
                  placeholder: "10-digit mobile number",
                },
                {
                  key: "location",
                  label: "Location / Address",
                  placeholder: "City, Highway, District",
                },
              ].map((f) => (
                <div key={f.key} className="space-y-1">
                  <Label htmlFor={`garage-field-${f.key}`}>{f.label}</Label>
                  <Input
                    id={`garage-field-${f.key}`}
                    placeholder={f.placeholder}
                    value={garageForm[f.key as keyof typeof garageForm]}
                    onChange={(e) =>
                      setGarageForm((prev) => ({
                        ...prev,
                        [f.key]: e.target.value,
                      }))
                    }
                    data-ocid={`garage.${f.key}_input`}
                  />
                </div>
              ))}
              <div className="space-y-2">
                <Label>Services Offered</Label>
                <div className="grid grid-cols-2 gap-2">
                  {serviceOptions.map((s) => {
                    const cbId = `svc-${s.replace(/\s+/g, "-").toLowerCase()}`;
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <Checkbox
                          id={cbId}
                          checked={selectedServices.includes(s)}
                          onCheckedChange={() => toggleService(s)}
                          data-ocid="garage.service_checkbox"
                        />
                        <Label
                          htmlFor={cbId}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {s}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleRegister}
                data-ocid="garage.register_submit_button"
              >
                Register Garage
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
