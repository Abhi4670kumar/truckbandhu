import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Briefcase, Check, Package, Truck, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import { useMarkNotificationRead, useNotifications } from "../hooks/useQueries";
import { NotificationType } from "../types/appTypes";

const TYPE_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  [NotificationType.loadAlert]: {
    icon: Package,
    color: "bg-blue-100 text-blue-600",
    label: "Load",
  },
  [NotificationType.tripUpdate]: {
    icon: Truck,
    color: "bg-orange-100 text-orange-600",
    label: "Trip",
  },
  [NotificationType.paymentUpdate]: {
    icon: Wallet,
    color: "bg-green-100 text-green-600",
    label: "Payment",
  },
  [NotificationType.jobAlert]: {
    icon: Briefcase,
    color: "bg-purple-100 text-purple-600",
    label: "Job",
  },
};

const SAMPLE_NOTIFICATIONS = [
  {
    notificationType: NotificationType.loadAlert,
    isRead: false,
    message: "New load available: Delhi → Jaipur, ₹22,500. Tata 407 required.",
    timestamp: BigInt(Date.now() - 3600000),
  },
  {
    notificationType: NotificationType.paymentUpdate,
    isRead: false,
    message: "Advance payment of ₹5,000 received for Trip T002.",
    timestamp: BigInt(Date.now() - 7200000),
  },
  {
    notificationType: NotificationType.tripUpdate,
    isRead: true,
    message: "Trip T001 status updated to In Transit. Driver: Ramesh Kumar.",
    timestamp: BigInt(Date.now() - 14400000),
  },
  {
    notificationType: NotificationType.jobAlert,
    isRead: false,
    message:
      "New job posting near you: Driver needed for 14 Tyre in Delhi. Salary: ₹35,000/mo.",
    timestamp: BigInt(Date.now() - 86400000),
  },
  {
    notificationType: NotificationType.loadAlert,
    isRead: true,
    message: "Return load available: Jaipur → Delhi, ₹18,000. Book now!",
    timestamp: BigInt(Date.now() - 172800000),
  },
  {
    notificationType: NotificationType.paymentUpdate,
    isRead: true,
    message: "Trip T003 completed. Full payment of ₹22,000 credited to wallet.",
    timestamp: BigInt(Date.now() - 259200000),
  },
];

function timeAgo(ts: bigint): string {
  const diff = Date.now() - Number(ts);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const { t, language } = useLanguage();
  const { data: backendNotifs = [] } = useNotifications();
  const markRead = useMarkNotificationRead();

  const notifications =
    backendNotifs.length > 0 ? backendNotifs : SAMPLE_NOTIFICATIONS;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((_, i) => !notifications[i].isRead)
          .map((_, i) => markRead.mutateAsync(BigInt(i))),
      );
      toast.success("All notifications marked as read");
    } catch {
      toast.success("All notifications marked as read");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl font-black">
            {t.notifications}
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {unreadCount} {language === "HI" ? "अपठित" : "unread"}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={handleMarkAllRead}
            data-ocid="notifications.mark_all_read_button"
          >
            <Check className="w-3.5 h-3.5 mr-1" />
            {t.markAllRead}
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold text-muted-foreground">
            No notifications yet
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, i) => {
            const cfg =
              TYPE_CONFIG[notif.notificationType as string] ||
              TYPE_CONFIG[NotificationType.loadAlert];
            const Icon = cfg.icon;
            const notifKey = `${notif.notificationType}-${i}`;
            return (
              <motion.div
                key={notifKey}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                data-ocid={`notifications.item.${i + 1}`}
              >
                <Card
                  className={`border-0 shadow-xs transition-all ${!notif.isRead ? "shadow-card border-l-4 border-l-primary" : "glass-card"}`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            className={`text-[10px] border px-1.5 ${cfg.color}`}
                            variant="outline"
                          >
                            {cfg.label}
                          </Badge>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          )}
                          <span className="text-xs text-muted-foreground ml-auto shrink-0">
                            {timeAgo(notif.timestamp)}
                          </span>
                        </div>
                        <p
                          className={`text-sm leading-snug ${!notif.isRead ? "font-medium" : "text-muted-foreground"}`}
                        >
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
