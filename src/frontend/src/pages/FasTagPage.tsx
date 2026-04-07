import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CreditCard,
  Download,
  Link,
  Mail,
  Plus,
  RefreshCw,
  Settings,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";

const SAMPLE_TRANSACTIONS = [
  {
    type: "debit",
    amount: 185,
    description: "Delhi-Gurgaon Expressway",
    time: "Today 14:30",
    tollName: "Rajokri Toll",
    group: "Today",
  },
  {
    type: "debit",
    amount: 240,
    description: "NH48 - Manesar",
    time: "Yesterday 09:15",
    tollName: "Kherki Daula Toll",
    group: "Yesterday",
  },
  {
    type: "credit",
    amount: 1000,
    description: "FASTag Recharge",
    time: "2 days ago",
    tollName: "Account Top-up",
    group: "This Week",
  },
  {
    type: "debit",
    amount: 125,
    description: "Eastern Peripheral Expressway",
    time: "3 days ago",
    tollName: "DND Flyover",
    group: "This Week",
  },
  {
    type: "debit",
    amount: 315,
    description: "Mumbai-Pune Expressway",
    time: "5 days ago",
    tollName: "Khopoli Toll",
    group: "This Week",
  },
];

const GROUPED_TRANSACTIONS = SAMPLE_TRANSACTIONS.reduce<
  Record<string, typeof SAMPLE_TRANSACTIONS>
>((acc, tx) => {
  if (!acc[tx.group]) acc[tx.group] = [];
  acc[tx.group].push(tx);
  return acc;
}, {});

const GROUP_ORDER = ["Today", "Yesterday", "This Week"];

export default function FasTagPage() {
  const { t, language } = useLanguage();
  const [rechargeOpen, setRechargeOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [rechargeMethod, setRechargeMethod] = useState<"upi" | "bank" | "card">(
    "upi",
  );
  const [upiId, setUpiId] = useState("");
  const [emailAddress, setEmailAddress] = useState("driver@example.com");
  const [autoRecharge, setAutoRecharge] = useState(false);
  const [lowBalanceAlert, setLowBalanceAlert] = useState(true);
  const [linkedVehicle, setLinkedVehicle] = useState("DL 01 T 1234");
  const [fastagNumber, setFastagNumber] = useState("");
  const [balance] = useState(2340);
  const openingBalance = 3340;
  const netUsed = openingBalance - balance;

  const handleRecharge = () => {
    if (!rechargeAmount || Number.parseFloat(rechargeAmount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (rechargeMethod === "upi" && !upiId) {
      toast.error("Enter your UPI ID");
      return;
    }
    toast.success(
      `FASTag recharged with ₹${rechargeAmount} via ${rechargeMethod.toUpperCase()}!`,
    );
    setRechargeOpen(false);
    setRechargeAmount("");
    setUpiId("");
  };

  const handleSendEmail = () => {
    if (!emailAddress || !emailAddress.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    toast.success(`FASTag history sent to ${emailAddress}!`);
    setEmailDialogOpen(false);
  };

  const handleLinkFastag = () => {
    if (!fastagNumber) {
      toast.error("Enter FASTag number");
      return;
    }
    toast.success("FASTag linked successfully!");
    setLinkOpen(false);
    setFastagNumber("");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-black mb-5">{t.fastag}</h1>

      {/* FASTag Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/5 -translate-x-6 -translate-y-6" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/5" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-300" />
                <p className="font-bold text-sm">FASTag Balance</p>
              </div>
              <Badge className="bg-white/20 text-white border-0 text-xs">
                Active
              </Badge>
            </div>
            <p className="text-4xl font-display font-black mb-1">
              ₹{balance.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-white/70">FASTag No: DL-FT-001234</p>
            <p className="text-xs text-white/50 mt-1">
              Vehicle: {linkedVehicle}
            </p>
            <div className="mt-4 pt-3 border-t border-white/20 flex gap-6">
              <div>
                <p className="text-[11px] text-white/60 uppercase tracking-wide">
                  Opening Balance
                </p>
                <p className="text-base font-bold text-white">
                  ₹{openingBalance.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-white/60 uppercase tracking-wide">
                  Net Used
                </p>
                <p className="text-base font-bold text-yellow-300">
                  ₹{netUsed.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Monthly Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mb-5"
      >
        <Card className="glass-card border-0 shadow-card">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              This Month
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="font-display text-xl font-black text-primary">
                  4
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Toll Transactions
                </p>
              </div>
              <div>
                <p className="font-display text-xl font-black text-orange-600">
                  ₹865
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Total Paid
                </p>
              </div>
              <div>
                <p className="font-display text-xs font-black text-foreground truncate">
                  DL-FT-001234
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  FASTag No
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Primary Action Buttons */}
      <div className="flex gap-2 mb-3">
        <Button
          className="flex-1 h-12 font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-glow"
          onClick={() => setRechargeOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t.recharge} FASTag
        </Button>
        <Button
          variant="outline"
          className="h-12 font-semibold px-4 border-2"
          onClick={() => setEmailDialogOpen(true)}
        >
          <Download className="w-4 h-4 mr-1.5" />
          <span className="hidden sm:inline">Download &amp; Email</span>
          <span className="sm:hidden">Email</span>
        </Button>
      </div>

      {/* Secondary Options Row */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button
          type="button"
          onClick={() => setLinkOpen(true)}
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 border-dashed border-border hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Link className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-xs font-semibold text-center leading-tight">
            Link FASTag
          </span>
        </button>
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 border-dashed border-border hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Settings className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-xs font-semibold text-center leading-tight">
            Settings
          </span>
        </button>
        <button
          type="button"
          onClick={() => setDisputeOpen(true)}
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 border-dashed border-border hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <span className="text-xs font-semibold text-center leading-tight">
            Dispute
          </span>
        </button>
      </div>

      {/* Transaction History */}
      <h2 className="font-display text-lg font-bold mb-3">
        {language === "HI" ? "टोल लेनदेन" : "Toll Transactions"}
      </h2>

      <div className="space-y-5">
        {GROUP_ORDER.filter((g) => GROUPED_TRANSACTIONS[g]).map((group) => (
          <div key={group}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">
              {group}
            </p>
            <div className="space-y-2">
              {GROUPED_TRANSACTIONS[group].map((tx, i) => (
                <motion.div
                  key={`${tx.tollName}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="glass-card border-0 shadow-xs">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tx.type === "credit" ? "bg-green-100" : "bg-orange-100"}`}
                        >
                          {tx.type === "credit" ? (
                            <ArrowDownRight className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {tx.tollName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tx.time}
                          </p>
                        </div>
                        <p
                          className={`font-bold text-sm shrink-0 ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}
                        >
                          {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recharge Dialog with Payment Options */}
      <Dialog open={rechargeOpen} onOpenChange={setRechargeOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Recharge FASTag</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="p-3 bg-muted rounded-xl text-center">
              <p className="text-xs text-muted-foreground">Current Balance</p>
              <p className="font-display text-2xl font-black">
                ₹{balance.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["200", "500", "1000", "1500", "2000", "5000"].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setRechargeAmount(preset)}
                  className={`py-2 rounded-xl text-sm font-semibold border transition-all ${rechargeAmount === preset ? "bg-green-600 text-white border-green-600" : "border-border hover:border-green-500"}`}
                >
                  ₹{preset}
                </button>
              ))}
            </div>
            <div className="space-y-1">
              <Label>Custom Amount (₹)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
              />
            </div>
            {/* Payment Method */}
            <div className="space-y-1.5">
              <Label>Pay via</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["upi", "bank", "card"] as const).map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setRechargeMethod(method)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center gap-1 ${
                      rechargeMethod === method
                        ? "bg-green-600 text-white border-green-600"
                        : "border-border hover:border-green-500"
                    }`}
                  >
                    {method === "upi" && <span className="text-base">📱</span>}
                    {method === "bank" && <span className="text-base">🏦</span>}
                    {method === "card" && <span className="text-base">💳</span>}
                    {method === "upi"
                      ? "UPI"
                      : method === "bank"
                        ? "Bank"
                        : "Card"}
                  </button>
                ))}
              </div>
            </div>
            {rechargeMethod === "upi" && (
              <div className="space-y-1">
                <Label>UPI ID</Label>
                <Input
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            )}
            {rechargeMethod === "bank" && (
              <div className="p-3 bg-muted rounded-xl text-sm text-muted-foreground flex items-center gap-2">
                <span className="text-lg">🏦</span>
                Linked: SBI ****1234
              </div>
            )}
            {rechargeMethod === "card" && (
              <div className="space-y-1">
                <Label>Card Number</Label>
                <Input placeholder="XXXX XXXX XXXX XXXX" maxLength={19} />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRechargeOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleRecharge}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Recharge ₹{rechargeAmount || "0"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email History Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Email FASTag History
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Your complete FASTag transaction history will be sent as a PDF to
              the email address below.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="email-input">Email Address</Label>
              <Input
                id="email-input"
                type="email"
                placeholder="driver@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
            <div className="p-3 bg-muted rounded-xl text-xs text-muted-foreground">
              Includes: 5 transactions · FASTag No: DL-FT-001234 · Generated{" "}
              {new Date().toLocaleDateString("en-IN")}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleSendEmail}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send to Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link FASTag Dialog */}
      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Link className="w-5 h-5 text-blue-600" />
              Link FASTag Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Enter your FASTag number to link your account and sync balance
              automatically.
            </p>
            <div className="space-y-1.5">
              <Label>FASTag Number</Label>
              <Input
                placeholder="e.g. DL-FT-001234"
                value={fastagNumber}
                onChange={(e) => setFastagNumber(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Vehicle Number</Label>
              <Input
                placeholder="e.g. DL 01 T 1234"
                value={linkedVehicle}
                onChange={(e) => setLinkedVehicle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Issuing Bank</Label>
              <select className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm">
                <option>SBI</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
                <option>Paytm Payments Bank</option>
                <option>IDFC First Bank</option>
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setLinkOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleLinkFastag}
            >
              <Link className="w-4 h-4 mr-2" />
              Link Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FASTag Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              FASTag Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-semibold">Auto Recharge</p>
                  <p className="text-xs text-muted-foreground">
                    Recharge when balance below ₹200
                  </p>
                </div>
              </div>
              <Switch
                checked={autoRecharge}
                onCheckedChange={setAutoRecharge}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-sm font-semibold">Low Balance Alert</p>
                  <p className="text-xs text-muted-foreground">
                    Alert when balance below ₹500
                  </p>
                </div>
              </div>
              <Switch
                checked={lowBalanceAlert}
                onCheckedChange={setLowBalanceAlert}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Preferred Recharge UPI</Label>
              <Input placeholder="yourname@upi" />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => {
                toast.success("Settings saved!");
                setSettingsOpen(false);
              }}
            >
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispute Dialog */}
      <Dialog open={disputeOpen} onOpenChange={setDisputeOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Raise Dispute
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Report a wrong toll deduction or FASTag issue.
            </p>
            <div className="space-y-1.5">
              <Label>Issue Type</Label>
              <select className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm">
                <option>Wrong toll deduction</option>
                <option>Double charge</option>
                <option>Balance not updated</option>
                <option>FASTag not scanned</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Transaction Reference (optional)</Label>
              <Input placeholder="e.g. TXN123456" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <textarea
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm min-h-[72px] resize-none"
                placeholder="Describe the issue..."
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDisputeOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                toast.success(
                  "Dispute raised! You will receive an update within 3-5 business days.",
                );
                setDisputeOpen(false);
              }}
            >
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
