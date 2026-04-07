import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Banknote,
  CheckCircle,
  Clock,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const myLoans = [
  {
    id: 1,
    type: "Truck Loan",
    amount: "₹2,50,000",
    emi: "₹8,500/mo",
    remaining: "₹1,85,000",
    status: "Active",
    nextDue: "25 Mar 2026",
  },
  {
    id: 2,
    type: "Working Capital",
    amount: "₹50,000",
    emi: "₹5,200/mo",
    remaining: "₹0",
    status: "Closed",
    nextDue: "—",
  },
  {
    id: 3,
    type: "Emergency Loan",
    amount: "₹20,000",
    emi: "₹2,100/mo",
    remaining: "₹8,400",
    status: "Active",
    nextDue: "1 Apr 2026",
  },
];

const repayments = [
  {
    id: 1,
    date: "10 Mar 2026",
    description: "Trip deduction – Delhi to Jaipur",
    amount: "-₹2,100",
    type: "debit",
  },
  {
    id: 2,
    date: "5 Mar 2026",
    description: "Manual EMI payment",
    amount: "-₹8,500",
    type: "debit",
  },
  {
    id: 3,
    date: "28 Feb 2026",
    description: "Trip deduction – Agra to Kanpur",
    amount: "-₹1,050",
    type: "debit",
  },
  {
    id: 4,
    date: "20 Feb 2026",
    description: "Loan disbursement received",
    amount: "+₹20,000",
    type: "credit",
  },
  {
    id: 5,
    date: "15 Feb 2026",
    description: "Manual EMI payment",
    amount: "-₹8,500",
    type: "debit",
  },
];

const sponsoredLoans = [
  {
    id: 1,
    sponsor: "Jaipur Cargo Pvt. Ltd.",
    maxAmount: "₹1,00,000",
    interest: "0%",
    commitment: "20 trips in 6 months",
    eligible: true,
  },
  {
    id: 2,
    sponsor: "North India Logistics",
    maxAmount: "₹75,000",
    interest: "0%",
    commitment: "15 trips in 4 months",
    eligible: true,
  },
  {
    id: 3,
    sponsor: "Maharashtra Transport Co.",
    maxAmount: "₹50,000",
    interest: "0%",
    commitment: "10 trips in 3 months",
    eligible: false,
  },
];

const creditScore = 680;

export default function DriverLoanPage() {
  const [loanType, setLoanType] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [applied, setApplied] = useState(false);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Driver Loan & Finance
        </h1>
        <p className="text-muted-foreground text-sm">
          0% interest sponsored loans & financial support
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-3">
            <p className="text-xs opacity-75">Total Loan</p>
            <p className="text-xl font-bold mt-0.5">₹3,20,000</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-500 text-white">
          <CardContent className="p-3">
            <p className="text-xs opacity-75">Remaining</p>
            <p className="text-xl font-bold mt-0.5">₹1,93,400</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Next EMI</p>
            <p className="text-lg font-bold">₹10,600</p>
            <p className="text-xs text-muted-foreground">Due: 25 Mar</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Credit Score</p>
            <p className="text-lg font-bold text-green-600">
              {creditScore}/800
            </p>
            <Progress
              value={(creditScore / 800) * 100}
              className="h-1.5 mt-1"
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="my-loans">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger
            value="my-loans"
            className="text-xs"
            data-ocid="loan.my_loans_tab"
          >
            My Loans
          </TabsTrigger>
          <TabsTrigger
            value="apply"
            className="text-xs"
            data-ocid="loan.apply_tab"
          >
            Apply
          </TabsTrigger>
          <TabsTrigger
            value="repayment"
            className="text-xs"
            data-ocid="loan.repayment_tab"
          >
            Repayment
          </TabsTrigger>
          <TabsTrigger
            value="sponsored"
            className="text-xs"
            data-ocid="loan.sponsored_tab"
          >
            0% Loans
          </TabsTrigger>
        </TabsList>

        {/* My Loans */}
        <TabsContent value="my-loans" className="space-y-3 mt-4">
          {myLoans.map((l, i) => (
            <Card key={l.id} data-ocid={`loan.item.${i + 1}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">{l.type}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      l.status === "Active"
                        ? "text-green-700 border-green-300 bg-green-50"
                        : "text-muted-foreground"
                    }
                  >
                    {l.status === "Active" ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : null}
                    {l.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-bold text-sm">{l.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">EMI</p>
                    <p className="font-bold text-sm">{l.emi}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                    <p className="font-bold text-sm">{l.remaining}</p>
                  </div>
                </div>
                {l.status === "Active" && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Next due: {l.nextDue}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Apply */}
        <TabsContent value="apply" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Apply for Loan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {applied && (
                <div
                  className="p-3 bg-green-50 border border-green-200 rounded-lg"
                  data-ocid="loan.success_state"
                >
                  <p className="text-sm text-green-700">
                    ✅ Loan application submitted! Processing in 24–48 hours.
                  </p>
                </div>
              )}
              <div className="space-y-1">
                <Label>Loan Type</Label>
                <Select value={loanType} onValueChange={setLoanType}>
                  <SelectTrigger data-ocid="loan.type_select">
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">
                      Truck Purchase / Repair
                    </SelectItem>
                    <SelectItem value="emergency">Emergency Loan</SelectItem>
                    <SelectItem value="working">Working Capital</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Loan Amount (₹)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 50000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  data-ocid="loan.amount_input"
                />
              </div>
              <div className="space-y-1">
                <Label>Purpose</Label>
                <Textarea
                  placeholder="Loan ka use kahan hoga?"
                  rows={2}
                  value={loanPurpose}
                  onChange={(e) => setLoanPurpose(e.target.value)}
                  data-ocid="loan.purpose_textarea"
                />
              </div>
              <Button
                className="w-full"
                disabled={!loanType || !loanAmount}
                onClick={() => {
                  setApplied(true);
                  setTimeout(() => setApplied(false), 4000);
                }}
                data-ocid="loan.apply_submit_button"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Submit Application
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Repayment */}
        <TabsContent value="repayment" className="space-y-3 mt-4">
          {repayments.map((r, i) => (
            <div
              key={r.id}
              className="flex items-center gap-3 p-3 border rounded-lg"
              data-ocid={`loan.repayment.item.${i + 1}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${r.type === "credit" ? "bg-green-100" : "bg-red-100"}`}
              >
                <TrendingUp
                  className={`w-4 h-4 ${r.type === "credit" ? "text-green-600" : "text-red-600 rotate-180"}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{r.description}</p>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </div>
              <p
                className={`font-bold text-sm shrink-0 ${r.type === "credit" ? "text-green-600" : "text-red-600"}`}
              >
                {r.amount}
              </p>
            </div>
          ))}
        </TabsContent>

        {/* Sponsored Loans */}
        <TabsContent value="sponsored" className="space-y-3 mt-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              🎉 0% Interest Loans sponsored by transporters!
            </p>
            <p className="text-xs text-blue-700 mt-0.5">
              Repay through trip deductions. No extra charges.
            </p>
          </div>
          {sponsoredLoans.map((sl, i) => (
            <Card key={sl.id} data-ocid={`loan.sponsored.item.${i + 1}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{sl.sponsor}</p>
                    <Badge className="mt-1 bg-green-500 text-white text-xs">
                      0% Interest
                    </Badge>
                  </div>
                  {sl.eligible ? (
                    <Badge
                      variant="outline"
                      className="text-green-700 border-green-300 bg-green-50 text-xs"
                    >
                      Eligible
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-muted-foreground text-xs"
                    >
                      Not Eligible
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Max Loan</p>
                    <p className="font-bold">{sl.maxAmount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Commitment</p>
                    <p className="font-medium text-xs">{sl.commitment}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={!sl.eligible}
                  data-ocid={`loan.sponsored.apply.button.${i + 1}`}
                >
                  {sl.eligible ? "Apply for Sponsored Loan" : "Not Eligible"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
