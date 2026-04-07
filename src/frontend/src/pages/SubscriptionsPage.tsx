import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";
import { useLanguage } from "../contexts/LanguageContext";

const PLANS = [
  {
    key: "basic",
    name: "Basic",
    nameHi: "बेसिक",
    price: "Free",
    priceHi: "मुफ्त",
    icon: Star,
    color: "border-border",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    badge: null,
    features: [
      "Post up to 5 loads/month",
      "Register 1 truck",
      "Basic trip management",
      "Email support",
    ],
    featuresHi: [
      "5 माल/महीना पोस्ट करें",
      "1 ट्रक रजिस्टर करें",
      "बेसिक यात्रा प्रबंधन",
      "ईमेल सहायता",
    ],
  },
  {
    key: "standard",
    name: "Standard",
    nameHi: "स्टैंडर्ड",
    price: "₹999",
    priceHi: "₹999",
    icon: Zap,
    color: "border-primary shadow-glow-blue",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    badge: "Popular",
    features: [
      "Post unlimited loads",
      "Register up to 5 trucks",
      "GPS tracking",
      "Price negotiation",
      "FASTag management",
      "Priority support",
    ],
    featuresHi: [
      "असीमित माल पोस्ट करें",
      "5 ट्रक रजिस्टर करें",
      "GPS ट्रैकिंग",
      "मूल्य वार्ता",
      "FASTag प्रबंधन",
      "प्राथमिकता सहायता",
    ],
  },
  {
    key: "premium",
    name: "Premium",
    nameHi: "प्रीमियम",
    price: "₹2,499",
    priceHi: "₹2,499",
    icon: Crown,
    color: "border-secondary shadow-glow",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
    badge: "Best Value",
    features: [
      "Everything in Standard",
      "Unlimited trucks & drivers",
      "Advanced analytics",
      "Hiring module access",
      "PDF invoice generation",
      "Dedicated account manager",
      "API access",
    ],
    featuresHi: [
      "स्टैंडर्ड सब कुछ",
      "असीमित ट्रक और ड्राइवर",
      "उन्नत विश्लेषण",
      "भर्ती मॉड्यूल",
      "PDF चालान",
      "समर्पित खाता प्रबंधक",
      "API एक्सेस",
    ],
  },
];

export default function SubscriptionsPage() {
  const { language } = useLanguage();

  // Since AppContext doesn't store subscription, we'll use local state
  const currentPlan = "basic";

  const handleUpgrade = (planKey: string) => {
    if (planKey === currentPlan) return;
    toast.success(`Upgraded to ${planKey} plan! (Demo)`);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-display text-2xl font-black mb-1">
          {language === "HI" ? "सदस्यता योजनाएं" : "Subscription Plans"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {language === "HI"
            ? "अपने व्यवसाय के लिए सही योजना चुनें"
            : "Choose the right plan for your business"}
        </p>
      </div>

      <div className="space-y-4">
        {PLANS.map((plan, i) => {
          const Icon = plan.icon;
          const isCurrentPlan = plan.key === currentPlan;
          const features = language === "HI" ? plan.featuresHi : plan.features;

          return (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className={`border-2 overflow-hidden ${plan.color} ${isCurrentPlan ? "bg-primary/2" : ""}`}
              >
                <CardHeader className="p-4 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${plan.iconBg} flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${plan.iconColor}`} />
                      </div>
                      <div>
                        <CardTitle className="font-display text-lg">
                          {language === "HI" ? plan.nameHi : plan.name}
                        </CardTitle>
                        <p className="text-xl font-black">
                          {language === "HI" ? plan.priceHi : plan.price}
                          {plan.price !== "Free" && (
                            <span className="text-sm font-normal text-muted-foreground">
                              /mo
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {plan.badge && (
                        <Badge className="bg-secondary text-secondary-foreground border-0 text-xs">
                          {plan.badge}
                        </Badge>
                      )}
                      {isCurrentPlan && (
                        <Badge
                          variant="outline"
                          className="text-xs border-primary text-primary"
                        >
                          Current
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ul className="space-y-1.5 mb-4">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full h-10 font-bold ${
                      isCurrentPlan
                        ? "bg-muted text-muted-foreground cursor-default"
                        : plan.key === "premium"
                          ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    }`}
                    onClick={() => handleUpgrade(plan.key)}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan
                      ? language === "HI"
                        ? "वर्तमान योजना"
                        : "Current Plan"
                      : language === "HI"
                        ? "अपग्रेड करें"
                        : "Upgrade"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-muted-foreground mt-6 px-4">
        {language === "HI"
          ? "सभी योजनाओं में GST अतिरिक्त है। प्रीमियम प्लान वार्षिक भुगतान पर 20% छूट।"
          : "All plans + GST. 20% discount on annual payment for Premium plan."}
      </p>
    </div>
  );
}
