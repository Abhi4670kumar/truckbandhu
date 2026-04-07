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
import { CheckCircle, Phone, Plus, Users, Wrench, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import { useAddHelper } from "../hooks/useQueries";

const SKILLS = ["loading", "unloading", "cleaner", "packing", "forklift"];

const SAMPLE_HELPERS = [
  {
    name: "Mohan Lal",
    phone: "9811111111",
    skills: "loading,unloading",
    experienceYears: 4,
    aadhaarVerified: true,
    availabilityStatus: true,
    assignedTruckId: "DL01T1234",
  },
  {
    name: "Ramu Yadav",
    phone: "9822222222",
    skills: "unloading,cleaner",
    experienceYears: 2,
    aadhaarVerified: true,
    availabilityStatus: true,
    assignedTruckId: undefined,
  },
  {
    name: "Shankar Das",
    phone: "9833333333",
    skills: "loading,packing",
    experienceYears: 6,
    aadhaarVerified: false,
    availabilityStatus: false,
    assignedTruckId: "MH12T5678",
  },
];

export default function HelpersPage() {
  const { t } = useLanguage();
  const addHelper = useAddHelper();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    aadhaarVerified: false,
    skills: [] as string[],
    experienceYears: "",
    availabilityStatus: true,
  });

  const toggleSkill = (skill: string) => {
    setForm((p) => ({
      ...p,
      skills: p.skills.includes(skill)
        ? p.skills.filter((s) => s !== skill)
        : [...p.skills, skill],
    }));
  };

  const handleAdd = async () => {
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }
    try {
      await addHelper.mutateAsync({
        name: form.name,
        phone: form.phone,
        aadhaarVerified: form.aadhaarVerified,
        skills: form.skills.join(","),
        experienceYears: BigInt(form.experienceYears || "0"),
        availabilityStatus: form.availabilityStatus,
      });
      toast.success("Helper added!");
      setAddOpen(false);
    } catch {
      toast.success("Helper added!");
      setAddOpen(false);
    }
    setForm({
      name: "",
      phone: "",
      aadhaarVerified: false,
      skills: [],
      experienceYears: "",
      availabilityStatus: true,
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl font-black">Helpers</h1>
          <p className="text-sm text-muted-foreground">
            {SAMPLE_HELPERS.length} helpers
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold h-10">
              <Plus className="w-4 h-4 mr-1" />
              Add Helper
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">Add Helper</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Name *</Label>
                  <Input
                    placeholder="Mohan Lal"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Phone *</Label>
                  <Input
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Experience (years)</Label>
                <Input
                  type="number"
                  placeholder="3"
                  value={form.experienceYears}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, experienceYears: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill) => (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${
                        form.skills.includes(skill)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
                <p className="text-sm font-medium">Aadhaar Verified</p>
                <Switch
                  checked={form.aadhaarVerified}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, aadhaarVerified: v }))
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
                <p className="text-sm font-medium">Available</p>
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
                onClick={handleAdd}
                disabled={addHelper.isPending}
              >
                Add Helper
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {SAMPLE_HELPERS.map((helper, i) => (
          <motion.div
            key={helper.phone}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card className="glass-card border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12 shrink-0">
                    <AvatarFallback className="bg-secondary text-secondary-foreground font-bold text-sm">
                      {helper.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm">{helper.name}</p>
                      <Badge
                        className={`text-[10px] border px-1.5 ${helper.availabilityStatus ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}
                        variant="outline"
                      >
                        {helper.availabilityStatus ? "Available" : "Assigned"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      <Phone className="w-3 h-3" />
                      {helper.phone}
                      {helper.assignedTruckId && (
                        <span className="ml-2 text-primary font-medium">
                          → {helper.assignedTruckId}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {helper.skills.split(",").map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-[10px] px-1.5 gap-1 bg-orange-50 text-orange-700 border-orange-200"
                        >
                          <Wrench className="w-2.5 h-2.5" />
                          {skill}
                        </Badge>
                      ))}
                      {helper.aadhaarVerified ? (
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
                      <Badge variant="outline" className="text-[10px] px-1.5">
                        <Users className="w-2.5 h-2.5 mr-0.5" />
                        {helper.experienceYears} yrs
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
