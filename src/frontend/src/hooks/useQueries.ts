import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  JobPosting,
  JobRoleType,
  LoadListing,
  LoadStatus,
  NotificationType,
  SubscriptionPlan,
  TransactionType,
  Trip,
  TripStatus,
  UserRoleType as UserRole,
} from "../types/appTypes";
import { useActor } from "./useActor";

// ─── User Profile ─────────────────────────────────────────
export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      userRole: UserRole;
      name: string;
      phone: string;
      location: string;
      subscriptionPlan: SubscriptionPlan;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createUserProfile(
        data.userRole,
        data.name,
        data.phone,
        data.location,
        data.subscriptionPlan,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["callerProfile"] }),
  });
}

export function useApproveUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      principal: import("@icp-sdk/core/principal").Principal,
    ) => {
      if (!actor) throw new Error("No actor");
      return actor.approveUser(principal);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allUsers"] }),
  });
}

export function useBlockUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      principal: import("@icp-sdk/core/principal").Principal,
    ) => {
      if (!actor) throw new Error("No actor");
      return actor.blockUser(principal);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allUsers"] }),
  });
}

// ─── Loads ────────────────────────────────────────────────
// Normalized shape returned by useAllLoads
export type LoadEntry = LoadListing & { id: string };

export function useAllLoads() {
  const { actor, isFetching } = useActor();
  return useQuery<LoadEntry[]>({
    queryKey: ["allLoads"],
    queryFn: async () => {
      if (!actor) return [];
      // getPublicLoadListings returns Array<[string, LoadListing]>
      const pairs = await actor.getPublicLoadListings();
      return pairs.map(([id, listing]) => ({ id, ...listing }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateLoad() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      pickupLocation: string;
      deliveryLocation: string;
      distanceKm: bigint;
      weightTons: bigint;
      truckTypeRequired: string;
      basePriceRs: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createLoadListing(
        data.id,
        data.pickupLocation,
        data.deliveryLocation,
        data.distanceKm,
        data.weightTons,
        data.truckTypeRequired,
        data.basePriceRs,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allLoads"] }),
  });
}

export function useUpdateLoad() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      pickupLocation: string;
      deliveryLocation: string;
      distanceKm: bigint;
      weightTons: bigint;
      truckTypeRequired: string;
      basePriceRs: bigint;
      status: LoadStatus;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateLoadListing(
        data.id,
        data.pickupLocation,
        data.deliveryLocation,
        data.distanceKm,
        data.weightTons,
        data.truckTypeRequired,
        data.basePriceRs,
        data.status,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allLoads"] }),
  });
}

// ─── Trips ────────────────────────────────────────────────
// Normalized shape returned by useAllTrips
export type TripEntry = Trip & { id: string };

export function useAllTrips() {
  const { actor, isFetching } = useActor();
  return useQuery<TripEntry[]>({
    queryKey: ["allTrips"],
    queryFn: async () => {
      if (!actor) return [];
      // getUserTrips returns Array<[string, Trip]>
      const pairs = await actor.getUserTrips();
      return pairs.map(([id, trip]) => ({ id, ...trip }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateTripStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string; status: TripStatus }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateTripStatus(data.id, data.status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allTrips"] }),
  });
}

export function useCreateTrip() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      loadId: string;
      truckId: string;
      driverId: string;
      agreedPriceRs: bigint;
      advanceAmountRs: bigint;
      remainingAmountRs: bigint;
      paymentStatus: string;
      pickupLocation: string;
      deliveryLocation: string;
      distanceKm: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createTrip(
        data.id,
        data.loadId,
        data.truckId,
        data.driverId,
        data.agreedPriceRs,
        data.advanceAmountRs,
        data.remainingAmountRs,
        data.paymentStatus,
        data.pickupLocation,
        data.deliveryLocation,
        data.distanceKm,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allTrips"] }),
  });
}

// ─── Drivers ──────────────────────────────────────────────
export function useAddDriver() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      aadhaarVerified: boolean;
      licenseNumber: string;
      licenseExpiry: bigint;
      experienceYears: bigint;
      currentLocation: string;
      availabilityStatus: boolean;
      emergencyContact: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addDriver(
        data.name,
        data.phone,
        data.aadhaarVerified,
        data.licenseNumber,
        data.licenseExpiry,
        data.experienceYears,
        data.currentLocation,
        data.availabilityStatus,
        data.emergencyContact,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allDrivers"] }),
  });
}

// ─── Helpers ──────────────────────────────────────────────
export function useAddHelper() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      aadhaarVerified: boolean;
      skills: string;
      experienceYears: bigint;
      availabilityStatus: boolean;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addHelper(
        data.name,
        data.phone,
        data.aadhaarVerified,
        data.skills,
        data.experienceYears,
        data.availabilityStatus,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allHelpers"] }),
  });
}

// ─── Trucks ───────────────────────────────────────────────
export function useAddTruck() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      truckNumber: string;
      truckType: string;
      loadCapacity: bigint;
      insuranceDetails: string;
      permitDetails: string;
      fastagNumber: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addTruck(
        data.truckNumber,
        data.truckType,
        data.loadCapacity,
        data.insuranceDetails,
        data.permitDetails,
        data.fastagNumber,
        null,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allTrucks"] }),
  });
}

// ─── Wallet ───────────────────────────────────────────────
export function useWallet() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWallet();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateWallet() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.createWallet();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wallet"] }),
  });
}

export function useAddTransaction() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      amount: bigint;
      transactionType: TransactionType;
      description: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addTransaction(
        data.amount,
        data.transactionType,
        data.description,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wallet"] }),
  });
}

// ─── Jobs ─────────────────────────────────────────────────
// Normalized shape returned by useAllJobs
export type JobEntry = JobPosting & { id: string };

export function useAllJobs() {
  const { actor, isFetching } = useActor();
  return useQuery<JobEntry[]>({
    queryKey: ["allJobs"],
    queryFn: async () => {
      if (!actor) return [];
      // getPublicJobPostings returns Array<[string, JobPosting]>
      const pairs = await actor.getPublicJobPostings();
      return pairs.map(([id, job]) => ({ id, ...job }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      roleType: JobRoleType;
      salary: bigint;
      location: string;
      experienceRequired: bigint;
      truckType: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createJobPosting(
        data.id,
        data.roleType,
        data.salary,
        data.location,
        data.experienceRequired,
        data.truckType,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allJobs"] }),
  });
}

export function useApplyForJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.applyForJob(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allJobs"] }),
  });
}

// ─── Notifications ────────────────────────────────────────
export function useNotifications() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkNotificationRead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (index: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.markNotificationAsRead(index);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useAddNotification() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      message: string;
      notificationType: NotificationType;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addNotification(data.message, data.notificationType);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

// ─── Admin ────────────────────────────────────────────────
export function useAdminStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAdminStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
