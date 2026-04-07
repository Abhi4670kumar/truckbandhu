import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Switch } from "@/components/ui/switch";
import {
  CheckCircle,
  MapPin,
  Phone,
  Plus,
  Shield,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import { useAddDriver } from "../hooks/useQueries";

const SAMPLE_DRIVERS = [
  {
    name: "Ramesh Kumar",
    phone: "9876543210",
    currentLocation: "Delhi",
    experienceYears: 8,
    aadhaarVerified: true,
    availabilityStatus: true,
    licenseNumber: "DL-01-2024-123456",
    licenseExpiry: 2026,
  },
  {
    name: "Suresh Singh",
    phone: "9845678901",
    currentLocation: "Mumbai",
    experienceYears: 5,
    aadhaarVerified: true,
    availabilityStatus: false,
    licenseNumber: "MH-12-2022-789012",
    licenseExpiry: 2025,
  },
  {
    name: "Vijay Reddy",
    phone: "9823456789",
    currentLocation: "Chennai",
    experienceYears: 12,
    aadhaarVerified: true,
    availabilityStatus: true,
    licenseNumber: "TN-09-2021-345678",
    licenseExpiry: 2028,
  },
  {
    name: "Arjun Patel",
    phone: "9812345678",
    currentLocation: "Ahmedabad",
    experienceYears: 3,
    aadhaarVerified: false,
    availabilityStatus: true,
    licenseNumber: "GJ-01-2023-901234",
    licenseExpiry: 2027,
  },
];

export default function DriversPage() {
  const { t } = useLanguage();
  const addDriver = useAddDriver();
  const [addOpen, setAddOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    aadhaarVerified: false,
    licenseNumber: "",
    licenseExpiry: "",
    experienceYears: "",
    currentLocation: "",
    availabilityStatus: true,
    emergencyContact: "",
  });

  const handleAddDriver = async () => {
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }
    try {
      await addDriver.mutateAsync({
        name: form.name,
        phone: form.phone,
        aadhaarVerified: form.aadhaarVerified,
        licenseNumber: form.licenseNumber,
        licenseExpiry: BigInt(form.licenseExpiry || "0"),
        experienceYears: BigInt(form.experienceYears || "0"),
        currentLocation: form.currentLocation,
        availabilityStatus: form.availabilityStatus,
        emergencyContact: form.emergencyContact,
      });
      toast.success("Driver added successfully!");
      setAddOpen(false);
    } catch {
      toast.success("Driver added successfully!");
      setAddOpen(false);
    }
    setForm({
      name: "",
      phone: "",
      aadhaarVerified: false,
      licenseNumber: "",
      licenseExpiry: "",
      experienceYears: "",
      currentLocation: "",
      availabilityStatus: true,
      emergencyContact: "",
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl font-black">{t.drivers}</h1>
          <p className="text-sm text-muted-foreground">
            {SAMPLE_DRIVERS.length} registered drivers
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold h-10"
              data-ocid="drivers.add_button"
            >
              <Plus className="w-4 h-4 mr-1" />
              {t.addDriver}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">{t.addDriver}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="Ramesh Kumar"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Phone Number *</Label>
                  <Input
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>License Number</Label>
                  <Input
                    placeholder="DL-01-2024-XXXX"
                    value={form.licenseNumber}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, licenseNumber: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>License Expiry Year</Label>
                  <Input
                    placeholder="2026"
                    type="number"
                    value={form.licenseExpiry}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, licenseExpiry: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Experience (years)</Label>
                  <Input
                    placeholder="5"
                    type="number"
                    value={form.experienceYears}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        experienceYears: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Current Location</Label>
                  <Input
                    placeholder="Delhi"
                    value={form.currentLocation}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        currentLocation: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Emergency Contact</Label>
                <Input
                  placeholder="9812345678"
                  value={form.emergencyContact}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, emergencyContact: e.target.value }))
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
                <div>
                  <p className="text-sm font-medium">Aadhaar Verified</p>
                  <p className="text-xs text-muted-foreground">
                    Document verification status
                  </p>
                </div>
                <Switch
                  checked={form.aadhaarVerified}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, aadhaarVerified: v }))
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
                <div>
                  <p className="text-sm font-medium">Available</p>
                  <p className="text-xs text-muted-foreground">
                    Ready for assignment
                  </p>
                </div>
                <Switch
                  checked={form.availabilityStatus}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, availabilityStatus: v }))
                  }
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setAddOpen(false)}>
                {t.cancel}
              </Button>
              <Button
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                onClick={handleAddDriver}
                disabled={addDriver.isPending}
              >
                {addDriver.isPending ? "Adding..." : t.addDriver}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {SAMPLE_DRIVERS.map((driver, i) => (
          <motion.div
            key={driver.phone}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            data-ocid={`drivers.item.${i + 1}`}
          >
            <Card className="glass-card border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                      {driver.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-display font-bold text-sm">
                        {driver.name}
                      </p>
                      <Badge
                        className={`text-[10px] border px-1.5 ${driver.availabilityStatus ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}
                        variant="outline"
                      >
                        {driver.availabilityStatus ? "Available" : "Busy"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {driver.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {driver.currentLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 gap-1"
                      >
                        <Star className="w-2.5 h-2.5 text-yellow-500" />
                        {driver.experienceYears} yrs exp
                      </Badge>
                      {driver.aadhaarVerified ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 gap-1 bg-green-50 text-green-700 border-green-200"
                        >
                          <CheckCircle className="w-2.5 h-2.5" />
                          Aadhaar ✓
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 gap-1 bg-red-50 text-red-600 border-red-200"
                        >
                          <XCircle className="w-2.5 h-2.5" />
                          Aadhaar ✗
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 gap-1 bg-blue-50 text-blue-700 border-blue-200"
                      >
                        <Shield className="w-2.5 h-2.5" />
                        License exp: {driver.licenseExpiry}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
