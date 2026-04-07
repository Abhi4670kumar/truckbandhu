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
import {
  Briefcase,
  Clock,
  IndianRupee,
  MapPin,
  Plus,
  Truck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";
import { useLanguage } from "../contexts/LanguageContext";
import type { JobEntry } from "../hooks/useQueries";
import { useAllJobs, useApplyForJob, useCreateJob } from "../hooks/useQueries";
import { JobRoleType, UserRole } from "../types/appTypes";

const TRUCK_TYPES = [
  "Tata 407",
  "14 Tyre",
  "32 Ft",
  "20 Ft",
  "Container",
  "Trailer",
];

const SAMPLE_JOBS: JobEntry[] = [
  {
    id: "J001",
    roleType: JobRoleType.driver,
    salary: BigInt(25000),
    location: "Delhi",
    experienceRequired: BigInt(3),
    truckType: "Tata 407",
    status: true,
    applicants: [],
    postedBy: {} as any,
  },
  {
    id: "J002",
    roleType: JobRoleType.driver,
    salary: BigInt(35000),
    location: "Mumbai",
    experienceRequired: BigInt(5),
    truckType: "14 Tyre",
    status: true,
    applicants: [],
    postedBy: {} as any,
  },
  {
    id: "J003",
    roleType: JobRoleType.helper,
    salary: BigInt(15000),
    location: "Chennai",
    experienceRequired: BigInt(1),
    truckType: "Any",
    status: true,
    applicants: [],
    postedBy: {} as any,
  },
  {
    id: "J004",
    roleType: JobRoleType.driver,
    salary: BigInt(42000),
    location: "Bangalore",
    experienceRequired: BigInt(8),
    truckType: "32 Ft",
    status: true,
    applicants: [],
    postedBy: {} as any,
  },
];

export default function HiringPage() {
  const { t } = useLanguage();
  const { currentRole } = useApp();
  const { data: backendJobs = [] } = useAllJobs();
  const createJob = useCreateJob();
  const applyJob = useApplyForJob();

  const [postOpen, setPostOpen] = useState(false);
  const [form, setForm] = useState<{
    roleType: JobRoleType;
    salary: string;
    location: string;
    experienceRequired: string;
    truckType: string;
  }>({
    roleType: JobRoleType.driver,
    salary: "",
    location: "",
    experienceRequired: "",
    truckType: "Tata 407",
  });

  const jobs: JobEntry[] = backendJobs.length > 0 ? backendJobs : SAMPLE_JOBS;

  const handlePost = async () => {
    if (!form.location || !form.salary) {
      toast.error("Location and salary are required");
      return;
    }
    try {
      await createJob.mutateAsync({
        id: `J${Date.now()}`,
        roleType: form.roleType,
        salary: BigInt(form.salary || "0"),
        location: form.location,
        experienceRequired: BigInt(form.experienceRequired || "0"),
        truckType: form.truckType,
      });
      toast.success("Job posted successfully!");
      setPostOpen(false);
    } catch {
      toast.error("Failed to post job. Please try again.");
    }
    setForm({
      roleType: JobRoleType.driver,
      salary: "",
      location: "",
      experienceRequired: "",
      truckType: "Tata 407",
    });
  };

  const handleApply = async (jobId: string) => {
    try {
      await applyJob.mutateAsync(jobId);
      toast.success("Application submitted!");
    } catch {
      toast.error("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl font-black">{t.hiring}</h1>
          <p className="text-sm text-muted-foreground">
            {jobs.filter((j) => j.status).length} open positions
          </p>
        </div>
        {(currentRole === UserRole.truckOwner ||
          currentRole === UserRole.transporter) && (
          <Dialog open={postOpen} onOpenChange={setPostOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold h-10"
                data-ocid="jobs.post_job_button"
              >
                <Plus className="w-4 h-4 mr-1" />
                {t.postJob}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md" data-ocid="jobs.post_job_modal">
              <DialogHeader>
                <DialogTitle className="font-display">{t.postJob}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1">
                  <Label>Role Type</Label>
                  <Select
                    value={form.roleType}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, roleType: v as JobRoleType }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={JobRoleType.driver}>Driver</SelectItem>
                      <SelectItem value={JobRoleType.helper}>Helper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Salary (₹/month)</Label>
                    <Input
                      type="number"
                      placeholder="25000"
                      value={form.salary}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, salary: e.target.value }))
                      }
                      data-ocid="jobs.salary_input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Location</Label>
                    <Input
                      placeholder="Delhi"
                      value={form.location}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, location: e.target.value }))
                      }
                      data-ocid="jobs.location_input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Experience (years)</Label>
                    <Input
                      type="number"
                      placeholder="3"
                      value={form.experienceRequired}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          experienceRequired: e.target.value,
                        }))
                      }
                    />
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
                        {TRUCK_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setPostOpen(false)}>
                  {t.cancel}
                </Button>
                <Button
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  onClick={handlePost}
                  disabled={createJob.isPending}
                  data-ocid="jobs.submit_button"
                >
                  {t.postJob}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-3">
        {jobs.length === 0 ? (
          <div className="text-center py-16" data-ocid="jobs.empty_state">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-muted-foreground">
              No job postings yet
            </p>
          </div>
        ) : (
          jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              data-ocid={`jobs.item.${i + 1}`}
            >
              <Card className="glass-card border-0 shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        job.roleType === JobRoleType.driver
                          ? "bg-blue-100"
                          : "bg-orange-100"
                      }`}
                    >
                      {job.roleType === JobRoleType.driver ? (
                        <Truck className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Users className="w-5 h-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-display font-bold text-sm capitalize">
                          {job.roleType === JobRoleType.driver
                            ? "Driver"
                            : "Helper"}{" "}
                          Needed
                        </p>
                        <Badge
                          className={`text-[10px] border ${
                            job.status
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-gray-100 text-gray-500 border-gray-200"
                          }`}
                          variant="outline"
                        >
                          {job.status ? "Open" : "Closed"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <IndianRupee className="w-3 h-3" />₹
                          {Number(job.salary).toLocaleString("en-IN")}/mo
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Number(job.experienceRequired)}+ yrs
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          {job.truckType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {(job.applicants as unknown[])?.length ?? 0} applicant(s)
                    </p>
                    {(currentRole === UserRole.driver ||
                      currentRole === UserRole.transporter) &&
                      job.status && (
                        <Button
                          size="sm"
                          className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => handleApply(job.id)}
                          disabled={applyJob.isPending}
                          data-ocid={`jobs.apply_button.${i + 1}`}
                        >
                          <Briefcase className="w-3 h-3 mr-1" />
                          {t.apply}
                        </Button>
                      )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
