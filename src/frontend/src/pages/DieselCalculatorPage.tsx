import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Calculator,
  Fuel,
  IndianRupee,
  Minus,
  Ruler,
  TrendingDown,
  TrendingUp,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface CalcResult {
  fuelCost: number;
  tollCost: number;
  totalCost: number;
  profit: number | null;
  litersNeeded: number;
  perKmCost: number;
}

const VEHICLE_TYPES = [
  { label: "Tata 407", value: "tata407", mileage: "4" },
  { label: "14 Tyre", value: "14tyre", mileage: "3.5" },
  { label: "32 Ft", value: "32ft", mileage: "3" },
  { label: "Container", value: "container", mileage: "2.8" },
];

export default function DieselCalculatorPage() {
  const { t, language } = useLanguage();
  const [vehicleType, setVehicleType] = useState("tata407");
  const [distance, setDistance] = useState("");
  const [dieselPrice, setDieselPrice] = useState("92");
  const [mileage, setMileage] = useState("4");
  const [freightAmount, setFreightAmount] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);

  const handleVehicleTypeChange = (val: string) => {
    setVehicleType(val);
    const found = VEHICLE_TYPES.find((v) => v.value === val);
    if (found) {
      setMileage(found.mileage);
    }
  };

  const calculate = () => {
    const d = Number.parseFloat(distance);
    const dp = Number.parseFloat(dieselPrice);
    const m = Number.parseFloat(mileage);
    const fa = freightAmount ? Number.parseFloat(freightAmount) : null;

    if (!d || !dp || !m) return;

    const litersNeeded = d / m;
    const fuelCost = Math.round(litersNeeded * dp);
    const tollCost = Math.round(d * 2.5);
    const totalCost = fuelCost + tollCost;
    const profit = fa !== null ? fa - totalCost : null;
    const perKmCost = d > 0 ? Math.round(totalCost / d) : 0;

    setResult({
      fuelCost,
      tollCost,
      totalCost,
      profit,
      litersNeeded: Math.round(litersNeeded),
      perKmCost,
    });
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <Fuel className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-black">
            {t.dieselCalculator}
          </h1>
          <p className="text-sm text-muted-foreground">
            {language === "HI"
              ? "यात्रा लाभ अनुमान"
              : "Estimate your trip profit"}
          </p>
        </div>
      </div>

      {/* Input Card */}
      <Card className="glass-card border-0 shadow-card mb-5">
        <CardContent className="p-5 space-y-4">
          {/* Vehicle Type Selector */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-muted-foreground" />
              {language === "HI" ? "वाहन प्रकार" : "Vehicle Type"}
            </Label>
            <Select value={vehicleType} onValueChange={handleVehicleTypeChange}>
              <SelectTrigger
                className="h-12 text-base"
                data-ocid="calculator.vehicle_type_select"
              >
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_TYPES.map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    {v.label}{" "}
                    <span className="text-muted-foreground text-xs">
                      ({v.mileage} km/L)
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-2">
              <Ruler className="w-3.5 h-3.5 text-muted-foreground" />
              {language === "HI" ? "दूरी (किमी)" : "Distance (km)"}
            </Label>
            <Input
              type="number"
              placeholder="500"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="h-12 text-base"
              data-ocid="calculator.distance_input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2">
                <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                {language === "HI" ? "डीजल मूल्य (₹/L)" : "Diesel Price (₹/L)"}
              </Label>
              <Input
                type="number"
                placeholder="92"
                value={dieselPrice}
                onChange={(e) => setDieselPrice(e.target.value)}
                className="h-12 text-base"
                data-ocid="calculator.diesel_price_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2">
                <Fuel className="w-3.5 h-3.5 text-muted-foreground" />
                {language === "HI" ? "माइलेज (km/L)" : "Mileage (km/L)"}
              </Label>
              <Input
                type="number"
                placeholder="4"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="h-12 text-base"
                data-ocid="calculator.mileage_input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-2">
              <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
              {language === "HI"
                ? "माल भाड़ा (₹) — वैकल्पिक"
                : "Freight Amount (₹) — optional"}
            </Label>
            <Input
              type="number"
              placeholder="25000"
              value={freightAmount}
              onChange={(e) => setFreightAmount(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          <Button
            className="w-full h-12 text-base font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-glow"
            onClick={calculate}
            data-ocid="calculator.calculate_button"
          >
            <Calculator className="w-4 h-4 mr-2" />
            {t.calculate}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h2 className="font-display text-lg font-bold">
            {language === "HI" ? "परिणाम" : "Results"}
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <Card className="border-0 bg-orange-50 shadow-card">
              <CardContent className="p-4">
                <Fuel className="w-5 h-5 text-orange-500 mb-2" />
                <p className="text-xs text-muted-foreground">
                  {language === "HI" ? "ईंधन लागत" : "Fuel Cost"}
                </p>
                <p className="font-display text-xl font-black text-orange-600">
                  ₹{result.fuelCost.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {result.litersNeeded}L needed
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-blue-50 shadow-card">
              <CardContent className="p-4">
                <Ruler className="w-5 h-5 text-blue-500 mb-2" />
                <p className="text-xs text-muted-foreground">
                  {language === "HI" ? "टोल अनुमान" : "Est. Toll"}
                </p>
                <p className="font-display text-xl font-black text-blue-600">
                  ₹{result.tollCost.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-muted-foreground">~₹2.5/km</p>
              </CardContent>
            </Card>
          </div>

          <Card
            className={`border-0 shadow-card ${result.profit !== null && result.profit < 0 ? "bg-red-50" : "bg-primary/5"}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {language === "HI" ? "कुल यात्रा लागत" : "Total Trip Cost"}
                  </p>
                  <p className="font-display text-2xl font-black">
                    ₹{result.totalCost.toLocaleString("en-IN")}
                  </p>
                </div>
                <Minus className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {result.profit !== null && (
            <Card
              className={`border-0 shadow-card ${
                result.profit >= 0 ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {language === "HI" ? "अनुमानित लाभ" : "Estimated Profit"}
                    </p>
                    <p
                      className={`font-display text-2xl font-black ${
                        result.profit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {result.profit >= 0 ? "+" : ""}₹
                      {result.profit.toLocaleString("en-IN")}
                    </p>
                  </div>
                  {result.profit >= 0 ? (
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  ) : (
                    <TrendingDown className="w-8 h-8 text-red-400" />
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          <Card className="border-0 bg-muted shadow-xs">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                TRIP SUMMARY
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distance</span>
                  <span className="font-medium">{distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle type</span>
                  <span className="font-medium">
                    {VEHICLE_TYPES.find((v) => v.value === vehicleType)
                      ?.label || vehicleType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diesel required</span>
                  <span className="font-medium">{result.litersNeeded}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Fuel cost (@ ₹{dieselPrice}/L)
                  </span>
                  <span className="font-medium">
                    ₹{result.fuelCost.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated toll</span>
                  <span className="font-medium">
                    ₹{result.tollCost.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-1.5">
                  <span className="text-muted-foreground">Per km cost</span>
                  <span className="font-semibold text-primary">
                    ₹{result.perKmCost}/km
                  </span>
                </div>
                {freightAmount && (
                  <div className="flex justify-between border-t border-border pt-1.5">
                    <span className="font-semibold">Freight received</span>
                    <span className="font-bold text-green-600">
                      ₹
                      {Number.parseFloat(freightAmount).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
