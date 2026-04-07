/**
 * Local type definitions for TruckBandhu frontend.
 * These supplement the auto-generated backend.d.ts with enums and types
 * needed for UI role management and data display.
 */

// ─── Roles ─────────────────────────────────────────────────
export type AppRole =
  | "driver"
  | "truckOwner"
  | "transporter"
  | "admin"
  | "jobSeeker";

// ─── Enums (mirroring backend values) ──────────────────────
export const UserRole = {
  driver: "driver" as const,
  truckOwner: "truckOwner" as const,
  transporter: "transporter" as const,
  admin: "admin" as const,
  jobSeeker: "jobSeeker" as const,
};
export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const SubscriptionPlan = {
  basic: "basic" as const,
  pro: "pro" as const,
  enterprise: "enterprise" as const,
};
export type SubscriptionPlan =
  (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan];

export const LoadStatus = {
  available: "available" as const,
  open: "open" as const,
  assigned: "assigned" as const,
  inTransit: "inTransit" as const,
  negotiating: "negotiating" as const,
  confirmed: "confirmed" as const,
  delivered: "delivered" as const,
  cancelled: "cancelled" as const,
};
export type LoadStatus = (typeof LoadStatus)[keyof typeof LoadStatus];

export const TripStatus = {
  pending: "pending" as const,
  accepted: "accepted" as const,
  loading: "loading" as const,
  inTransit: "inTransit" as const,
  delivered: "delivered" as const,
  cancelled: "cancelled" as const,
};
export type TripStatus = (typeof TripStatus)[keyof typeof TripStatus];

export const TransactionType = {
  credit: "credit" as const,
  debit: "debit" as const,
};
export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export const NotificationType = {
  load: "load" as const,
  loadAlert: "loadAlert" as const,
  trip: "trip" as const,
  tripUpdate: "tripUpdate" as const,
  payment: "payment" as const,
  paymentUpdate: "paymentUpdate" as const,
  jobAlert: "jobAlert" as const,
  system: "system" as const,
};
export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const ApprovalStatus = {
  pending: "pending" as const,
  approved: "approved" as const,
  rejected: "rejected" as const,
  blocked: "blocked" as const,
};
export type ApprovalStatus =
  (typeof ApprovalStatus)[keyof typeof ApprovalStatus];

export const JobRoleType = {
  driver: "driver" as const,
  helper: "helper" as const,
};
export type JobRoleType = (typeof JobRoleType)[keyof typeof JobRoleType];

// ─── Data interfaces ───────────────────────────────────────
export interface LoadListing {
  pickupLocation: string;
  deliveryLocation: string;
  distanceKm: bigint;
  weightTons?: bigint;
  truckTypeRequired?: string;
  basePriceRs: bigint;
  agreedPriceRs?: bigint;
  status: LoadStatus;
  pickupCoords?: string;
  postedBy?: unknown;
  [key: string]: unknown;
}

export interface Trip {
  loadId?: string;
  truckId?: string;
  driverId?: string;
  agreedPriceRs: bigint;
  advanceAmountRs?: bigint;
  remainingAmountRs?: bigint;
  paymentStatus?: string;
  pickupLocation: string;
  deliveryLocation: string;
  distanceKm: bigint;
  status: TripStatus;
  startTime?: bigint;
  endTime?: bigint;
  createdAt?: bigint;
  [key: string]: unknown;
}

export interface JobPosting {
  roleType: JobRoleType;
  salary: bigint;
  location: string;
  experienceRequired: bigint;
  truckType: string;
  // biome-ignore lint/suspicious/noExplicitAny: status can be string or boolean depending on backend version
  status: any;
  applicants?: unknown[];
  [key: string]: unknown;
}
