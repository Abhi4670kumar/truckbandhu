import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Phone, Scale, ShieldCheck, Upload } from "lucide-react";
import { useState } from "react";

const complaints = [
  {
    id: 1,
    type: "Police Harassment",
    description: "Demanded money at NH-44 checkpoint without valid reason.",
    date: "12 Mar 2026",
    status: "Under Review",
  },
  {
    id: 2,
    type: "RTO Issue",
    description:
      "Vehicle documents rejected at RTO Ludhiana despite valid permit.",
    date: "5 Mar 2026",
    status: "Resolved",
  },
  {
    id: 3,
    type: "Illegal Demand",
    description:
      "Toll plaza staff demanded extra ₹500 beyond official toll rate.",
    date: "1 Mar 2026",
    status: "Submitted",
  },
];

const statusColor: Record<string, string> = {
  Submitted: "bg-blue-100 text-blue-700 border-blue-200",
  "Under Review": "bg-orange-100 text-orange-700 border-orange-200",
  Resolved: "bg-green-100 text-green-700 border-green-200",
};

const helplines = [
  { name: "National Highway Helpline", number: "1033" },
  { name: "Motor Vehicles Department", number: "1800-180-1551" },
  { name: "Police Emergency", number: "100" },
  { name: "NHAI Toll-Free", number: "1800-11-8500" },
  { name: "Legal Aid Services", number: "15100" },
];

export default function LegalHelpPage() {
  const [complaintType, setComplaintType] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!complaintType || !description) return;
    setSubmitted(true);
    setComplaintType("");
    setDescription("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Legal Help</h1>
        <p className="text-muted-foreground text-sm">
          File complaints, get legal guidance, emergency helplines
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Scale className="w-4 h-4" />
            File a Complaint
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {submitted && (
            <div
              className="p-3 bg-green-50 border border-green-200 rounded-lg"
              data-ocid="legal.success_state"
            >
              <p className="text-sm text-green-700 font-medium">
                ✅ Complaint submitted successfully! You will receive an update
                within 48 hours.
              </p>
            </div>
          )}
          <div className="space-y-1">
            <Label>Complaint Type</Label>
            <Select value={complaintType} onValueChange={setComplaintType}>
              <SelectTrigger data-ocid="legal.complaint_type_select">
                <SelectValue placeholder="Select complaint type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="illegal">
                  Illegal Demand / Bribery
                </SelectItem>
                <SelectItem value="police">Police Harassment</SelectItem>
                <SelectItem value="rto">RTO Issue</SelectItem>
                <SelectItem value="toll">Toll Overcharge</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              placeholder="Kya hua? Kab aur kahan? Detail mein batayein..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-ocid="legal.complaint_textarea"
            />
          </div>
          <Button
            variant="outline"
            className="w-full"
            data-ocid="legal.upload_button"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Evidence (Photo/Video)
          </Button>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!complaintType || !description}
            data-ocid="legal.submit_button"
          >
            <FileText className="w-4 h-4 mr-2" />
            Submit Complaint
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">My Complaints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {complaints.map((c, i) => (
            <div
              key={c.id}
              className="p-3 border rounded-lg space-y-1"
              data-ocid={`legal.complaint.item.${i + 1}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-sm">{c.type}</p>
                <Badge
                  variant="outline"
                  className={`text-xs ${statusColor[c.status]}`}
                >
                  {c.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{c.description}</p>
              <p className="text-xs text-muted-foreground">{c.date}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Legal Guidance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="rights">
              <AccordionTrigger className="text-sm">
                Know Your Rights as a Driver
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-1">
                <p>
                  • You have the right to see the FIR if charged with any
                  offense.
                </p>
                <p>
                  • Police cannot detain your vehicle without a valid reason.
                </p>
                <p>
                  • You can record video of any illegal checkpoint activity.
                </p>
                <p>• You are entitled to a receipt for any fine paid.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="docs">
              <AccordionTrigger className="text-sm">
                Documents to Always Carry
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-1">
                <p>• Driving License (original or Digilocker)</p>
                <p>• Vehicle RC (Registration Certificate)</p>
                <p>• Vehicle Insurance Certificate</p>
                <p>• Fitness Certificate & Permit</p>
                <p>• Pollution Under Control (PUC) Certificate</p>
                <p>• Load / Consignment documents (LR / Bilty)</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="rto">
              <AccordionTrigger className="text-sm">
                Dealing with RTO Issues
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-1">
                <p>
                  • Keep all permits up-to-date before entering a new state.
                </p>
                <p>• For overloading fines, request a written challan.</p>
                <p>• You can appeal any RTO decision within 30 days.</p>
                <p>• Contact Motor Vehicles Department: 1800-180-1551</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Emergency Helplines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {helplines.map((h, i) => (
            <div
              key={h.name}
              className="flex items-center justify-between p-2 bg-muted/40 rounded-lg"
              data-ocid={`legal.helpline.item.${i + 1}`}
            >
              <p className="text-sm">{h.name}</p>
              <Button
                size="sm"
                variant="outline"
                className="text-green-700 border-green-300 h-7 text-xs"
                data-ocid={`legal.call.button.${i + 1}`}
              >
                <Phone className="w-3 h-3 mr-1" />
                {h.number}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
