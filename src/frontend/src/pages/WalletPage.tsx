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
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CreditCard,
  IndianRupee,
  Link,
  Plus,
  Smartphone,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import { useWallet } from "../hooks/useQueries";

const SAMPLE_TRANSACTIONS = [
  {
    transactionType: "credit" as const,
    amount: BigInt(18500),
    description: "Trip T001 - Delhi to Jaipur",
    timestamp: BigInt(Date.now() - 86400000 * 1),
  },
  {
    transactionType: "debit" as const,
    amount: BigInt(925),
    description: "Platform commission (5%) T001",
    timestamp: BigInt(Date.now() - 86400000 * 1),
  },
  {
    transactionType: "credit" as const,
    amount: BigInt(8200),
    description: "Trip T002 - Mumbai to Pune",
    timestamp: BigInt(Date.now() - 86400000 * 3),
  },
  {
    transactionType: "debit" as const,
    amount: BigInt(410),
    description: "Platform commission (5%) T002",
    timestamp: BigInt(Date.now() - 86400000 * 3),
  },
  {
    transactionType: "credit" as const,
    amount: BigInt(5000),
    description: "Advance Payment - Trip T003",
    timestamp: BigInt(Date.now() - 86400000 * 5),
  },
  {
    transactionType: "debit" as const,
    amount: BigInt(3500),
    description: "Diesel reimbursement",
    timestamp: BigInt(Date.now() - 86400000 * 7),
  },
];

type AddMoneyTab = "upi" | "link_account" | "card";

export default function WalletPage() {
  const { t, language } = useLanguage();
  const { data: wallet } = useWallet();
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addTab, setAddTab] = useState<AddMoneyTab>("upi");
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [linkedBank, setLinkedBank] = useState<string | null>("SBI ****1234");

  const transactions = wallet?.transactions || SAMPLE_TRANSACTIONS;
  const balance = wallet?.balance || BigInt(127365);

  const totalCredit = transactions
    .filter((tx) => tx.transactionType === "credit")
    .reduce((sum, tx) => sum + tx.amount, BigInt(0));
  const totalDebit = transactions
    .filter((tx) => tx.transactionType === "debit")
    .reduce((sum, tx) => sum + tx.amount, BigInt(0));

  const formatDate = (ts: bigint) => {
    const d = new Date(Number(ts));
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const handleWithdraw = () => {
    if (!amount) {
      toast.error("Please enter amount");
      return;
    }
    toast.success(`₹${amount} withdrawal request submitted!`);
    setWithdrawOpen(false);
    setAmount("");
  };

  const handleAddMoney = () => {
    if (!amount) {
      toast.error("Please enter amount");
      return;
    }
    if (addTab === "upi" && !upiId) {
      toast.error("Enter UPI ID");
      return;
    }
    if (addTab === "link_account" && !linkedBank && !accountNo) {
      toast.error("Enter account details");
      return;
    }
    toast.success(
      `₹${amount} added to wallet via ${addTab === "upi" ? "UPI" : addTab === "link_account" ? "Bank Account" : "Card"}!`,
    );
    setAddOpen(false);
    setAmount("");
    setUpiId("");
  };

  const handleLinkAccount = () => {
    if (!accountNo || !ifsc) {
      toast.error("Enter account number and IFSC");
      return;
    }
    setLinkedBank(`Bank ****${accountNo.slice(-4)}`);
    toast.success("Bank account linked successfully!");
    setAccountNo("");
    setIfsc("");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-black mb-5">{t.wallet}</h1>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="rounded-2xl nav-gradient p-5 text-white shadow-glow-blue relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-x-8 -translate-y-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-x-4 translate-y-4" />
          <div className="relative">
            <p className="text-sm text-white/70 mb-1">
              {language === "HI" ? "उपलब्ध शेष" : "Available Balance"}
            </p>
            <div className="flex items-start gap-1">
              <IndianRupee className="w-5 h-5 mt-1.5 text-white/80" />
              <p className="font-display text-4xl font-black">
                {balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <div className="flex items-center gap-1.5 text-sm">
                <TrendingUp className="w-3.5 h-3.5 text-green-300" />
                <span className="text-white/70">In:</span>
                <span className="font-semibold text-green-300">
                  ₹{totalCredit.toString()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <TrendingDown className="w-3.5 h-3.5 text-red-300" />
                <span className="text-white/70">Out:</span>
                <span className="font-semibold text-red-300">
                  ₹{totalDebit.toString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button
          className="h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold"
          onClick={() => setWithdrawOpen(true)}
        >
          <ArrowUpRight className="w-4 h-4 mr-2" />
          {t.withdraw}
        </Button>
        <Button
          variant="outline"
          className="h-12 font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={() => {
            setAddOpen(true);
            setAddTab("upi");
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t.addMoney}
        </Button>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="font-display text-lg font-bold mb-3">Transactions</h2>
        <div className="space-y-2">
          {transactions.map((tx, i) => {
            const isCredit = tx.transactionType === "credit";
            const txKey = `${tx.description}-${i}`;
            return (
              <motion.div
                key={txKey}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="glass-card border-0 shadow-xs">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isCredit ? "bg-green-100" : "bg-red-100"}`}
                      >
                        {isCredit ? (
                          <ArrowDownRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {tx.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(tx.timestamp)}
                        </p>
                      </div>
                      <p
                        className={`font-bold text-sm shrink-0 ${isCredit ? "text-green-600" : "text-red-600"}`}
                      >
                        {isCredit ? "+" : "-"}₹{tx.amount.toString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">
              {t.withdraw} to Bank
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="p-3 bg-muted rounded-xl flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Linked Account</p>
                <p className="text-sm font-medium">
                  {linkedBank || "No account linked"}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setWithdrawOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              onClick={handleWithdraw}
            >
              <Wallet className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Money Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">{t.addMoney}</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-4">
            {/* Tab switcher */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-muted">
              {(
                [
                  {
                    key: "upi",
                    icon: <Smartphone className="w-3.5 h-3.5" />,
                    label: "UPI",
                  },
                  {
                    key: "link_account",
                    icon: <Building2 className="w-3.5 h-3.5" />,
                    label: "Bank",
                  },
                  {
                    key: "card",
                    icon: <CreditCard className="w-3.5 h-3.5" />,
                    label: "Card",
                  },
                ] as const
              ).map(({ key, icon, label }) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setAddTab(key)}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    addTab === key
                      ? "bg-background shadow text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>

            {/* Amount presets (all tabs) */}
            <div className="grid grid-cols-3 gap-2">
              {["500", "1000", "2000", "5000", "10000", "20000"].map(
                (preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className={`py-2 rounded-xl text-sm font-semibold border transition-all ${
                      amount === preset
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    ₹{preset}
                  </button>
                ),
              )}
            </div>
            <div className="space-y-1">
              <Label>Custom Amount (₹)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* UPI Tab */}
            {addTab === "upi" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>UPI ID</Label>
                  <Input
                    placeholder="yourname@upi or phone@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "GPay",
                    "PhonePe",
                    "Paytm",
                    "BHIM",
                    "Amazon Pay",
                    "WhatsApp",
                  ].map((app) => (
                    <button
                      type="button"
                      key={app}
                      onClick={() => toast.info(`Opening ${app}...`)}
                      className="py-2 px-1 rounded-xl border border-border hover:border-primary text-xs font-semibold transition-all"
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Link Bank Account Tab */}
            {addTab === "link_account" && (
              <div className="space-y-3">
                {linkedBank ? (
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                        Linked: {linkedBank}
                      </p>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground underline"
                        onClick={() => setLinkedBank(null)}
                      >
                        Change account
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <Label>Account Number</Label>
                      <Input
                        placeholder="Enter account number"
                        value={accountNo}
                        onChange={(e) => setAccountNo(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>IFSC Code</Label>
                      <Input
                        placeholder="e.g. SBIN0001234"
                        value={ifsc}
                        onChange={(e) => setIfsc(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleLinkAccount}
                    >
                      <Link className="w-4 h-4 mr-2" />
                      Link Account
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Card Tab */}
            {addTab === "card" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Card Number</Label>
                  <Input placeholder="XXXX XXXX XXXX XXXX" maxLength={19} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label>Expiry</Label>
                    <Input placeholder="MM/YY" maxLength={5} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>CVV</Label>
                    <Input placeholder="XXX" type="password" maxLength={3} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handleAddMoney}
            >
              Add ₹{amount || "0"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
