import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Trip {
    status: TripStatus;
    truckId: string;
    driverId: string;
    paymentStatus: string;
    createdAt: bigint;
    loadId: string;
    distanceKm: bigint;
    deliveryLocation: string;
    remainingAmountRs: bigint;
    advanceAmountRs: bigint;
    pickupLocation: string;
    agreedPriceRs: bigint;
}
export interface Driver {
    assignedTruckId?: Principal;
    ownerId: Principal;
    name: string;
    emergencyContact: string;
    experienceYears: bigint;
    licenseNumber: string;
    aadhaarVerified: boolean;
    currentLocation: string;
    phone: string;
    licenseExpiry: bigint;
    availabilityStatus: boolean;
}
export interface JobPosting {
    status: boolean;
    roleType: JobRoleType;
    postedBy: Principal;
    salary: bigint;
    experienceRequired: bigint;
    truckType: string;
    location: string;
    applicants: Array<Principal>;
}
export interface Transaction {
    transactionType: TransactionType;
    description: string;
    timestamp: bigint;
    amount: bigint;
}
export interface LoadListing {
    status: LoadStatus;
    postedBy: Principal;
    weightTons: bigint;
    distanceKm: bigint;
    deliveryLocation: string;
    basePriceRs: bigint;
    truckTypeRequired: string;
    pickupLocation: string;
}
export interface Wallet {
    balance: bigint;
    transactions: Array<Transaction>;
}
export interface Truck {
    ownerId: Principal;
    fastagNumber: string;
    insuranceDetails: string;
    assignedDriverId?: Principal;
    truckType: string;
    loadCapacity: bigint;
    permitDetails: string;
    photo?: ExternalBlob;
    truckNumber: string;
}
export interface Notification {
    notificationType: NotificationType;
    isRead: boolean;
    message: string;
    timestamp: bigint;
}
export interface Helper {
    assignedTruckId?: string;
    ownerId: Principal;
    name: string;
    experienceYears: bigint;
    aadhaarVerified: boolean;
    phone: string;
    skills: string;
    availabilityStatus: boolean;
}
export interface UserProfile {
    userRole: UserRole;
    principal: Principal;
    name: string;
    subscriptionPlan: SubscriptionPlan;
    approvalStatus: ApprovalStatus;
    phone: string;
    location: string;
}
export enum ApprovalStatus {
    pending = "pending",
    blocked = "blocked",
    approved = "approved"
}
export enum JobRoleType {
    helper = "helper",
    driver = "driver"
}
export enum LoadStatus {
    open = "open",
    completed = "completed",
    confirmed = "confirmed",
    negotiating = "negotiating"
}
export enum NotificationType {
    loadAlert = "loadAlert",
    tripUpdate = "tripUpdate",
    paymentUpdate = "paymentUpdate",
    jobAlert = "jobAlert"
}
export enum SubscriptionPlan {
    premium = "premium",
    basic = "basic",
    standard = "standard"
}
export enum TransactionType {
    credit = "credit",
    debit = "debit"
}
export enum TripStatus {
    loading = "loading",
    cancelled = "cancelled",
    pending = "pending",
    inTransit = "inTransit",
    delivered = "delivered",
    accepted = "accepted"
}
export enum UserRole {
    admin = "admin",
    transporter = "transporter",
    jobSeeker = "jobSeeker",
    truckOwner = "truckOwner",
    driver = "driver"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDriver(name: string, phone: string, aadhaarVerified: boolean, licenseNumber: string, licenseExpiry: bigint, experienceYears: bigint, currentLocation: string, availabilityStatus: boolean, emergencyContact: string): Promise<void>;
    addHelper(name: string, phone: string, aadhaarVerified: boolean, skills: string, experienceYears: bigint, availabilityStatus: boolean): Promise<void>;
    addNotification(message: string, notificationType: NotificationType): Promise<void>;
    addTransaction(amount: bigint, transactionType: TransactionType, description: string): Promise<void>;
    addTruck(truckNumber: string, truckType: string, loadCapacity: bigint, insuranceDetails: string, permitDetails: string, fastagNumber: string, photo: ExternalBlob | null): Promise<void>;
    applyForJob(id: string): Promise<void>;
    approveUser(user: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    blockUser(user: Principal): Promise<void>;
    closeJobPosting(id: string): Promise<void>;
    createJobPosting(id: string, roleType: JobRoleType, salary: bigint, location: string, experienceRequired: bigint, truckType: string): Promise<void>;
    createLoadListing(id: string, pickupLocation: string, deliveryLocation: string, distanceKm: bigint, weightTons: bigint, truckTypeRequired: string, basePriceRs: bigint): Promise<void>;
    createTrip(id: string, loadId: string, truckId: string, driverId: string, agreedPriceRs: bigint, advanceAmountRs: bigint, remainingAmountRs: bigint, paymentStatus: string, pickupLocation: string, deliveryLocation: string, distanceKm: bigint): Promise<void>;
    createUserProfile(userRole: UserRole, name: string, phone: string, location: string, subscriptionPlan: SubscriptionPlan): Promise<void>;
    createWallet(): Promise<void>;
    getAdminStats(): Promise<{
        activeTrips: bigint;
        totalUsers: bigint;
        pendingVerifications: bigint;
    }>;
    getAllJobPostings(): Promise<Array<JobPosting>>;
    getAllLoads(): Promise<Array<LoadListing>>;
    getAllTrips(): Promise<Array<Trip>>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getDriver(user: Principal): Promise<Driver>;
    getHelper(user: Principal): Promise<Helper>;
    getJobPosting(id: string): Promise<JobPosting>;
    getLoadListing(id: string): Promise<LoadListing>;
    getMyLoadListings(): Promise<Array<LoadListing>>;
    getNotifications(): Promise<Array<Notification>>;
    getPublicJobPostings(): Promise<Array<[string, JobPosting]>>;
    getPublicLoadListings(): Promise<Array<[string, LoadListing]>>;
    getTrip(id: string): Promise<Trip>;
    getTruck(truckNumber: string): Promise<Truck>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserTrips(): Promise<Array<[string, Trip]>>;
    getWallet(): Promise<Wallet | null>;
    isCallerAdmin(): Promise<boolean>;
    markNotificationAsRead(index: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateDriver(user: Principal, name: string, phone: string, aadhaarVerified: boolean, licenseNumber: string, licenseExpiry: bigint, experienceYears: bigint, currentLocation: string, availabilityStatus: boolean, assignedTruckId: Principal | null, emergencyContact: string): Promise<void>;
    updateHelper(user: Principal, name: string, phone: string, aadhaarVerified: boolean, skills: string, experienceYears: bigint, assignedTruckId: string | null, availabilityStatus: boolean): Promise<void>;
    updateLoadListing(id: string, pickupLocation: string, deliveryLocation: string, distanceKm: bigint, weightTons: bigint, truckTypeRequired: string, basePriceRs: bigint, status: LoadStatus): Promise<void>;
    updateTripStatus(id: string, status: TripStatus): Promise<void>;
    updateTruck(truckNumber: string, truckType: string, loadCapacity: bigint, insuranceDetails: string, permitDetails: string, fastagNumber: string, photo: ExternalBlob | null, assignedDriverId: Principal | null): Promise<void>;
}
