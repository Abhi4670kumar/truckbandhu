import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  Banknote,
  Bell,
  Briefcase,
  ChevronRight,
  CreditCard,
  Fuel,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Navigation,
  Package,
  Scale,
  Shield,
  Star,
  Truck,
  UserSearch,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import type { AppRole } from "../contexts/AppContext";
import { useLanguage } from "../contexts/LanguageContext";

import { useNotifications } from "../hooks/useQueries";
import AIRoutePlannerPage from "../pages/AIRoutePlannerPage";
import AdminPage from "../pages/AdminPage";
import DashboardPage from "../pages/DashboardPage";
import DieselCalculatorPage from "../pages/DieselCalculatorPage";
import DriverCommunityPage from "../pages/DriverCommunityPage";
import DriverLoanPage from "../pages/DriverLoanPage";
import DriversPage from "../pages/DriversPage";
import FasTagPage from "../pages/FasTagPage";
import GarageMechanicPage from "../pages/GarageMechanicPage";
import HelpersPage from "../pages/HelpersPage";
import HiringPage from "../pages/HiringPage";
import JobSeekerPage from "../pages/JobSeekerPage";
import LegalHelpPage from "../pages/LegalHelpPage";
import LoadsPage from "../pages/LoadsPage";
import NotificationsPage from "../pages/NotificationsPage";
import ParkingDhabaPage from "../pages/ParkingDhabaPage";
import RoadsideAssistancePage from "../pages/RoadsideAssistancePage";
import SubscriptionsPage from "../pages/SubscriptionsPage";
import TripsPage from "../pages/TripsPage";
import TrucksPage from "../pages/TrucksPage";
import WalletPage from "../pages/WalletPage";
import LanguageSelector from "./LanguageSelector";

interface AppShellProps {
  currentPage: string;
  setPage: (p: string) => void;
}

const PAGE_COMPONENTS: Record<string, React.ComponentType> = {
  home: DashboardPage,
  loads: LoadsPage,
  trips: TripsPage,
  drivers: DriversPage,
  helpers: HelpersPage,
  trucks: TrucksPage,
  wallet: WalletPage,
  calculator: DieselCalculatorPage,
  fastag: FasTagPage,
  hiring: HiringPage,
  notifications: NotificationsPage,
  subscriptions: SubscriptionsPage,
  admin: AdminPage,
  roadside: RoadsideAssistancePage,
  parking: ParkingDhabaPage,
  routeplanner: AIRoutePlannerPage,
  community: DriverCommunityPage,
  legal: LegalHelpPage,
  garage: GarageMechanicPage,
  loan: DriverLoanPage,
  jobseeker: JobSeekerPage,
};

interface NavItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: AppRole[];
  ocid?: string;
}

const ALL_NAV_ITEMS: NavItem[] = [
  {
    key: "home",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: [
      "driver" as AppRole,
      "truckOwner" as AppRole,
      "transporter" as AppRole,
      "admin" as AppRole,
      "jobSeeker" as AppRole,
    ],
  },
  {
    key: "loads",
    label: "Loads",
    icon: Package,
    roles: [
      "driver" as AppRole,
      "truckOwner" as AppRole,
      "transporter" as AppRole,
      "admin" as AppRole,
      "jobSeeker" as AppRole,
    ],
    ocid: "nav.loads_link",
  },
  {
    key: "trips",
    label: "Trips",
    icon: Truck,
    roles: [
      "driver" as AppRole,
      "truckOwner" as AppRole,
      "transporter" as AppRole,
      "admin" as AppRole,
    ],
    ocid: "nav.trips_link",
  },
  {
    key: "drivers",
    label: "Drivers",
    icon: Users,
    roles: [
      "truckOwner" as AppRole,
      "transporter" as AppRole,
      "admin" as AppRole,
    ],
    ocid: "nav.drivers_link",
  },
  {
    key: "helpers",
    label: "Hire Helper",
    icon: Users,
    roles: ["truckOwner" as AppRole, "admin" as AppRole],
  },
  {
    key: "trucks",
    label: "My Trucks",
    icon: Truck,
    roles: [
      "truckOwner" as AppRole,
      "transporter" as AppRole,
      "admin" as AppRole,
    ],
  },
  {
    key: "wallet",
    label: "Wallet",
    icon: Wallet,
    roles: [
      "driver" as AppRole,
      "truckOwner" as AppRole,
      "transporter" as AppRole,
      "admin" as AppRole,
    ],
  },
  {
    key: "calculator",
    label: "Diesel Calculator",
    icon: Fuel,
    roles: ["driver" as AppRole, "truckOwner" as AppRole, "admin" as AppRole],
  },
  {
    key: "fastag",
    label: "FASTag",
    icon: CreditCard,
    roles: ["driver" as AppRole, "truckOwner" as AppRole, "admin" as AppRole],
  },
  {
    key: "hiring",
    label: "Hiring",
    icon: Briefcase,
    roles: [
      "truckOwner" as AppRole,
      "transporter" as AppRole,
      "admin" as AppRole,
    ],
  },
  {
    key: "jobseeker",
    label: "Job Seekers",
    icon: UserSearch,
    roles: [
      "driver" as AppRole,
      "truckOwner" as AppRole,
      "transporter" as AppRole,
      "admin" as AppRole,
      "jobSeeker" as AppRole,
    ],
  },
  {
    key: "roadside",
    label: "Roadside Help",
    icon: AlertTriangle,
    roles: [
      "driver" as AppRole,
      "truckOwner" as AppRole,
      "admin" as AppRole,
      "jobSeeker" as AppRole,
    ],
  },
  {
    key: "parking",
    label: "Parking & Dhaba",
    icon: MapPin,
    roles: ["driver" as AppRole, "truckOwner" as AppRole, "admin" as AppRole],
  },
  {
    key: "routeplanner",
    label: "AI Route Planner",
    icon: Navigation,
    roles: [
      "driver" as AppRole,
      "truckOwner" as AppRole,
      "transporter" as AppRole,
      "admin" as AppRole,
    ],
  },
  {
    key: "community",
    label: "Community",
    icon: MessageSquare,
    roles: [
      "driver" as AppRole,
      "truckOwner" as AppRole,
      "transporter" as AppRole,
      "admin" as AppRole,
      "jobSeeker" as AppRole,
    ],
  },
  {
    key: "legal",
    label: "Legal Help",
    icon: Scale,
    roles: [
      "driver" as AppRole,
      "truckOwner" as AppRole,
      "admin" as AppRole,
      "jobSeeker" as AppRole,
    ],
  },
  {
    key: "garage",
    label: "Garage & Mechanic",
    icon: Wrench,
    roles: ["driver" as AppRole, "truckOwner" as AppRole, "admin" as AppRole],
  },
  {
    key: "loan",
    label: "Driver Loan",
    icon: Banknote,
    roles: ["driver" as AppRole, "admin" as AppRole],
  },
  {
    key: "subscriptions",
    label: "Subscriptions",
    icon: Star,
    roles: [
      "driver" as AppRole,
      "truckOwner" as AppRole,
      "transporter" as AppRole,
      "admin" as AppRole,
    ],
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: Bell,
    roles: [
      "driver" as AppRole,
      "truckOwner" as AppRole,
      "transporter" as AppRole,
      "admin" as AppRole,
      "jobSeeker" as AppRole,
    ],
  },
  {
    key: "admin",
    label: "Admin Panel",
    icon: Shield,
    roles: ["admin" as AppRole],
  },
];

const ROLE_LABELS: Record<AppRole, string> = {
  driver: "Driver",
  truckOwner: "Truck Owner",
  transporter: "Transporter",
  admin: "Admin",
  jobSeeker: "Job Seeker",
};

const BOTTOM_NAV_KEYS: Record<AppRole, string[]> = {
  driver: ["home", "loads", "trips", "wallet"],
  truckOwner: ["home", "loads", "trips", "trucks"],
  transporter: ["home", "loads", "trips", "hiring"],
  admin: ["home", "loads", "trips", "admin"],
  jobSeeker: ["home", "jobseeker", "community", "loads"],
};

export default function AppShell({ currentPage, setPage }: AppShellProps) {
  const { currentRole, setIsLoggedIn, userName } = useApp();
  const { t } = useLanguage();
  const [moreOpen, setMoreOpen] = useState(false);
  const { data: notifications = [] } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const PageComponent = PAGE_COMPONENTS[currentPage] || DashboardPage;

  const allowedItems = ALL_NAV_ITEMS.filter((item) =>
    item.roles.includes(currentRole),
  );

  const bottomNavKeys = BOTTOM_NAV_KEYS[currentRole] || [
    "home",
    "loads",
    "trips",
  ];
  const bottomNavItems = allowedItems.filter((item) =>
    bottomNavKeys.includes(item.key),
  );
  const moreItems = allowedItems.filter(
    (item) => !bottomNavKeys.includes(item.key),
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 nav-gradient text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/truckbandhu-logo-transparent.dim_300x100.png"
              alt="TruckBandhu"
              className="h-8 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector />

            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white hover:bg-white/10 relative w-9 h-9"
              onClick={() => setPage("notifications")}
              data-ocid="header.notification_button"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px] bg-secondary text-secondary-foreground border-0">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/80 hover:text-white hover:bg-white/10 w-9 h-9"
                  data-ocid="header.user_menu"
                >
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-bold">
                      {userName ? userName[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{userName || "User"}</p>
                  <p className="text-xs text-muted-foreground">
                    {ROLE_LABELS[currentRole]}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setPage("subscriptions")}>
                  <Star className="w-4 h-4 mr-2" />
                  {t.subscriptions}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setIsLoggedIn(false)}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Role badge strip */}
        <div className="px-4 pb-2 flex items-center gap-2">
          <span className="text-xs text-white/50">Logged in as</span>
          <span className="text-xs font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full">
            {ROLE_LABELS[currentRole]}
          </span>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex flex-col w-56 nav-gradient text-white min-h-screen sticky top-[72px] h-[calc(100vh-72px)]">
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-0.5 px-2">
              {allowedItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.key;
                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-secondary text-secondary-foreground shadow-md"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                      onClick={() => setPage(item.key)}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                      {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-3 border-t border-white/10">
            <button
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setIsLoggedIn(false)}
            >
              <LogOut className="w-4 h-4" />
              <span>{t.logout}</span>
            </button>
          </div>
        </aside>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="pb-24 md:pb-8">
            <PageComponent />
          </div>
        </main>
      </div>

      {/* Bottom Navigation (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg bottom-nav-safe">
        <div className="flex items-center justify-around py-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.key;
            return (
              <button
                type="button"
                key={item.key}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors min-w-[60px] ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setPage(item.key)}
                data-ocid={item.ocid}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                <span className="text-[10px] font-medium leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}

          {moreItems.length > 0 && (
            <DropdownMenu open={moreOpen} onOpenChange={setMoreOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors min-w-[60px] ${
                    moreOpen ? "text-primary" : "text-muted-foreground"
                  }`}
                  data-ocid="nav.more_link"
                >
                  <MoreHorizontal className="w-5 h-5" />
                  <span className="text-[10px] font-medium leading-tight">
                    {t.more}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" className="w-48 mb-2">
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem
                      key={item.key}
                      onClick={() => {
                        setPage(item.key);
                        setMoreOpen(false);
                      }}
                      className="gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </div>
  );
}
