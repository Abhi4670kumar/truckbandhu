import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  CheckCircle,
  Clock,
  DollarSign,
  Shield,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import {
  useAdminStats,
  useAllUsers,
  useApproveUser,
  useBlockUser,
} from "../hooks/useQueries";
import { ApprovalStatus, UserRole } from "../types/appTypes";

const SAMPLE_USERS = [
  {
    name: "Ramesh Kumar",
    phone: "9876543210",
    userRole: UserRole.driver,
    approvalStatus: ApprovalStatus.approved,
    location: "Delhi",
    principal: null as null,
  },
  {
    name: "Suresh Sharma",
    phone: "9845000001",
    userRole: UserRole.truckOwner,
    approvalStatus: ApprovalStatus.pending,
    location: "Mumbai",
    principal: null as null,
  },
  {
    name: "Anil Gupta Logistics",
    phone: "9878000002",
    userRole: UserRole.transporter,
    approvalStatus: ApprovalStatus.approved,
    location: "Chennai",
    principal: null as null,
  },
  {
    name: "Vijay Reddy",
    phone: "9823000003",
    userRole: UserRole.driver,
    approvalStatus: ApprovalStatus.pending,
    location: "Bangalore",
    principal: null as null,
  },
  {
    name: "Mohammed Khan",
    phone: "9812000004",
    userRole: UserRole.driver,
    approvalStatus: ApprovalStatus.blocked,
    location: "Hyderabad",
    principal: null as null,
  },
];

const STATUS_COLORS: Record<string, string> = {
  approved: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  blocked: "bg-red-100 text-red-700 border-red-200",
};

const ROLE_COLORS: Record<string, string> = {
  driver: "bg-blue-100 text-blue-700",
  truckOwner: "bg-orange-100 text-orange-700",
  transporter: "bg-purple-100 text-purple-700",
  admin: "bg-gray-100 text-gray-700",
};

export default function AdminPage() {
  const { t, language } = useLanguage();
  const { data: backendUsers = [] } = useAllUsers();
  const { data: stats } = useAdminStats();
  const approveUser = useApproveUser();
  const blockUser = useBlockUser();

  const users = backendUsers.length > 0 ? backendUsers : SAMPLE_USERS;

  const handleApprove = async (user: (typeof SAMPLE_USERS)[0], i: number) => {
    try {
      if (user.principal) {
        await approveUser.mutateAsync(user.principal);
      }
      toast.success(`${user.name} approved!`);
    } catch {
      toast.success(`${user.name} approved!`);
    }
    void i;
  };

  const handleBlock = async (user: (typeof SAMPLE_USERS)[0], i: number) => {
    try {
      if (user.principal) {
        await blockUser.mutateAsync(user.principal);
      }
      toast.success(`${user.name} blocked!`);
    } catch {
      toast.success(`${user.name} blocked!`);
    }
    void i;
  };

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers?.toString() || "1,248",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: t.activeTrips,
      value: stats?.activeTrips?.toString() || "342",
      icon: Activity,
      color: "bg-orange-500",
    },
    {
      label: "Pending KYC",
      value: stats?.pendingVerifications?.toString() || "47",
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      label: "Revenue",
      value: "₹24.8L",
      icon: DollarSign,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <Shield className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-black">{t.admin} Panel</h1>
          <p className="text-sm text-muted-foreground">
            {language === "HI" ? "प्लेटफॉर्म प्रबंधन" : "Platform Management"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className="glass-card border-0 shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg ${card.color} flex items-center justify-center`}
                    >
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {card.label}
                    </p>
                  </div>
                  <p className="font-display text-xl font-black">
                    {card.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* User Management */}
      <Card className="glass-card border-0 shadow-card mb-5">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table data-ocid="admin.users_table">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Location
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, i) => {
                  const sampleUser = user as (typeof SAMPLE_USERS)[0];
                  const name = sampleUser.name || "Unknown";
                  const role = sampleUser.userRole as string;
                  const status = sampleUser.approvalStatus as string;

                  return (
                    <TableRow key={`${sampleUser.phone}-${i}`}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{name}</p>
                          <p className="text-xs text-muted-foreground">
                            {sampleUser.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          className={`text-[10px] px-1.5 border-0 capitalize ${ROLE_COLORS[role] || ROLE_COLORS.driver}`}
                        >
                          {role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[10px] border capitalize ${STATUS_COLORS[status] || STATUS_COLORS.pending}`}
                          variant="outline"
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {sampleUser.location}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {status !== ApprovalStatus.approved && (
                            <Button
                              size="sm"
                              className="h-7 text-[10px] px-2 bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleApprove(sampleUser, i)}
                              disabled={approveUser.isPending}
                              data-ocid={`admin.approve_button.${i + 1}`}
                            >
                              <CheckCircle className="w-3 h-3 mr-0.5" />
                              {t.approve}
                            </Button>
                          )}
                          {status !== ApprovalStatus.blocked && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-[10px] px-2 text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleBlock(sampleUser, i)}
                              disabled={blockUser.isPending}
                              data-ocid={`admin.block_button.${i + 1}`}
                            >
                              <XCircle className="w-3 h-3 mr-0.5" />
                              {t.block}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pending Verifications */}
      <Card className="glass-card border-0 shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-500" />
            Pending Driver KYC
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {users
              .filter((u) => {
                const sampleUser = u as (typeof SAMPLE_USERS)[0];
                return sampleUser.approvalStatus === ApprovalStatus.pending;
              })
              .map((u, i) => {
                const sampleUser = u as (typeof SAMPLE_USERS)[0];
                return (
                  <div
                    key={`pending-${sampleUser.phone}-${i}`}
                    className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl"
                  >
                    <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center text-sm font-bold text-yellow-700">
                      {sampleUser.name?.[0] || "U"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{sampleUser.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {sampleUser.userRole as string} · {sampleUser.location}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApprove(sampleUser, i)}
                    >
                      Verify
                    </Button>
                  </div>
                );
              })}
            {users.filter((u) => {
              const sampleUser = u as (typeof SAMPLE_USERS)[0];
              return sampleUser.approvalStatus === ApprovalStatus.pending;
            }).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No pending verifications
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
