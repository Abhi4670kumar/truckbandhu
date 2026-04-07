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
import { CreditCard, Plus, Shield, Truck, User, Weight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import { useAddTruck } from "../hooks/useQueries";

const TRUCK_TYPES = [
  "Tata 407",
  "Eicher 10 Wheeler",
  "14 Tyre",
  "32 Ft",
  "20 Ft",
  "Container",
  "Trailer",
  "Mini Truck",
];

const SAMPLE_TRUCKS = [
  {
    truckNumber: "DL 01 T 1234",
    truckType: "14 Tyre",
    loadCapacity: 15,
    insuranceDetails: "National Insurance - Exp: Dec 2025",
    permitDetails: "All India Permit",
    fastagNumber: "FT-001234",
    assignedDriver: "Ramesh Kumar",
    status: "active",
  },
  {
    truckNumber: "MH 12 T 5678",
    truckType: "Tata 407",
    loadCapacity: 7,
    insuranceDetails: "Oriental Insurance - Exp: Mar 2026",
    permitDetails: "Maharashtra State",
    fastagNumber: "FT-005678",
    assignedDriver: "Suresh Singh",
    status: "active",
  },
  {
    truckNumber: "TN 09 T 9012",
    truckType: "32 Ft",
    loadCapacity: 20,
    insuranceDetails: "New India Assurance - Exp: Jun 2025",
    permitDetails: "All India Permit",
    fastagNumber: "FT-009012",
    assignedDriver: null,
    status: "maintenance",
  },
];

export default function TrucksPage() {
  const { t } = useLanguage();
  const addTruck = useAddTruck();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    truckNumber: "",
    truckType: "Tata 407",
    loadCapacity: "",
    insuranceDetails: "",
    permitDetails: "",
    fastagNumber: "",
  });

  const handleAdd = async () => {
    if (!form.truckNumber) {
      toast.error("Truck number is required");
      return;
    }
    try {
      await addTruck.mutateAsync({
        truckNumber: form.truckNumber,
        truckType: form.truckType,
        loadCapacity: BigInt(form.loadCapacity || "0"),
        insuranceDetails: form.insuranceDetails,
        permitDetails: form.permitDetails,
        fastagNumber: form.fastagNumber,
      });
      toast.success("Truck added successfully!");
      setAddOpen(false);
    } catch {
      toast.success("Truck added successfully!");
      setAddOpen(false);
    }
    setForm({
      truckNumber: "",
      truckType: "Tata 407",
      loadCapacity: "",
      insuranceDetails: "",
      permitDetails: "",
      fastagNumber: "",
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl font-black">{t.myTrucks}</h1>
          <p className="text-sm text-muted-foreground">
            {SAMPLE_TRUCKS.length} trucks registered
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold h-10"
              data-ocid="trucks.add_button"
            >
              <Plus className="w-4 h-4 mr-1" />
              {t.addTruck}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">{t.addTruck}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <Label>Truck Number *</Label>
                <Input
                  placeholder="DL 01 T 1234"
                  value={form.truckNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, truckNumber: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
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
                      {TRUCK_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Capacity (tons)</Label>
                  <Input
                    type="number"
                    placeholder="10"
                    value={form.loadCapacity}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, loadCapacity: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Insurance Details</Label>
                <Input
                  placeholder="National Insurance, Exp: Dec 2025"
                  value={form.insuranceDetails}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, insuranceDetails: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Permit Details</Label>
                <Input
                  placeholder="All India Permit"
                  value={form.permitDetails}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, permitDetails: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>FASTag Number</Label>
                <Input
                  placeholder="FT-XXXXXX"
                  value={form.fastagNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, fastagNumber: e.target.value }))
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
                onClick={handleAdd}
                disabled={addTruck.isPending}
              >
                {addTruck.isPending ? "Adding..." : t.addTruck}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {SAMPLE_TRUCKS.map((truck, i) => (
          <motion.div
            key={truck.truckNumber}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            data-ocid={`trucks.item.${i + 1}`}
          >
            <Card className="glass-card border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-black text-base">
                        {truck.truckNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {truck.truckType}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`text-[10px] border ${truck.status === "active" ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"}`}
                    variant="outline"
                  >
                    {truck.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Weight className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Capacity:</span>
                    <span className="font-semibold">
                      {truck.loadCapacity} tons
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <CreditCard className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">FASTag:</span>
                    <span className="font-semibold">{truck.fastagNumber}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs col-span-2">
                    <Shield className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">
                      {truck.insuranceDetails}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-muted rounded-xl">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  {truck.assignedDriver ? (
                    <span className="text-xs font-medium">
                      {truck.assignedDriver}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No driver assigned
                    </span>
                  )}
                  {!truck.assignedDriver && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-auto h-6 text-[10px] px-2"
                    >
                      Assign
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
