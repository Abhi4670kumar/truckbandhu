import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Role Definitions
  public type UserRole = {
    #driver;
    #truckOwner;
    #transporter;
    #admin;
    #jobSeeker;
  };

  public type ApprovalStatus = {
    #pending;
    #approved;
    #blocked;
  };

  public type SubscriptionPlan = {
    #basic;
    #standard;
    #premium;
  };

  public type LoadStatus = {
    #open;
    #negotiating;
    #confirmed;
    #completed;
  };

  public type TripStatus = {
    #pending;
    #accepted;
    #loading;
    #inTransit;
    #delivered;
    #cancelled;
  };

  public type TransactionType = {
    #credit;
    #debit;
  };

  public type JobRoleType = {
    #driver;
    #helper;
  };

  public type NotificationType = {
    #loadAlert;
    #paymentUpdate;
    #tripUpdate;
    #jobAlert;
  };

  // Core Entities
  public type UserProfile = {
    userRole : UserRole;
    name : Text;
    phone : Text;
    location : Text;
    approvalStatus : ApprovalStatus;
    subscriptionPlan : SubscriptionPlan;
    principal : Principal;
  };

  public type Truck = {
    truckNumber : Text;
    truckType : Text;
    loadCapacity : Nat;
    insuranceDetails : Text;
    permitDetails : Text;
    fastagNumber : Text;
    photo : ?Storage.ExternalBlob;
    assignedDriverId : ?Principal;
    ownerId : Principal;
  };

  public type Driver = {
    name : Text;
    phone : Text;
    aadhaarVerified : Bool;
    licenseNumber : Text;
    licenseExpiry : Int;
    experienceYears : Nat;
    currentLocation : Text;
    availabilityStatus : Bool;
    assignedTruckId : ?Principal;
    emergencyContact : Text;
    ownerId : Principal;
  };

  public type Helper = {
    name : Text;
    phone : Text;
    aadhaarVerified : Bool;
    skills : Text;
    experienceYears : Nat;
    assignedTruckId : ?Text;
    availabilityStatus : Bool;
    ownerId : Principal;
  };

  public type LoadListing = {
    pickupLocation : Text;
    deliveryLocation : Text;
    distanceKm : Nat;
    weightTons : Nat;
    truckTypeRequired : Text;
    basePriceRs : Nat;
    status : LoadStatus;
    postedBy : Principal;
  };

  public type Trip = {
    loadId : Text;
    truckId : Text;
    driverId : Text;
    status : TripStatus;
    agreedPriceRs : Nat;
    advanceAmountRs : Nat;
    remainingAmountRs : Nat;
    paymentStatus : Text;
    pickupLocation : Text;
    deliveryLocation : Text;
    distanceKm : Nat;
    createdAt : Int;
  };

  public type Transaction = {
    amount : Nat;
    transactionType : TransactionType;
    description : Text;
    timestamp : Int;
  };

  public type Wallet = {
    balance : Nat;
    transactions : [Transaction];
  };

  public type JobPosting = {
    roleType : JobRoleType;
    salary : Nat;
    location : Text;
    experienceRequired : Nat;
    truckType : Text;
    status : Bool; // True for Open, False for Closed
    postedBy : Principal;
    applicants : [Principal];
  };

  public type Notification = {
    message : Text;
    notificationType : NotificationType;
    isRead : Bool;
    timestamp : Int;
  };

  // Storage Maps
  let userProfiles = Map.empty<Principal, UserProfile>();
  let trucks = Map.empty<Text, Truck>();
  let drivers = Map.empty<Principal, Driver>();
  let helpers = Map.empty<Principal, Helper>();
  let loadListings = Map.empty<Text, LoadListing>();
  let trips = Map.empty<Text, Trip>();
  let wallets = Map.empty<Principal, Wallet>();
  let jobPostings = Map.empty<Text, JobPosting>();
  let notifications = Map.empty<Principal, List.List<Notification>>();

  // Required User Profile Functions for Frontend
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or be an admin");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  // User Profile Functions
  public shared ({ caller }) func createUserProfile(userRole : UserRole, name : Text, phone : Text, location : Text, subscriptionPlan : SubscriptionPlan) : async () {
    let profile : UserProfile = {
      userRole;
      name;
      phone;
      location;
      approvalStatus = #pending;
      subscriptionPlan;
      principal = caller;
    };
    userProfiles.add(caller, profile);
  };

  // Truck Functions
  public shared ({ caller }) func addTruck(truckNumber : Text, truckType : Text, loadCapacity : Nat, insuranceDetails : Text, permitDetails : Text, fastagNumber : Text, photo : ?Storage.ExternalBlob) : async () {
    let truck : Truck = {
      truckNumber;
      truckType;
      loadCapacity;
      insuranceDetails;
      permitDetails;
      fastagNumber;
      photo;
      assignedDriverId = null;
      ownerId = caller;
    };
    trucks.add(truckNumber, truck);
  };

  public query ({ caller }) func getTruck(truckNumber : Text) : async Truck {
    switch (trucks.get(truckNumber)) {
      case (null) { Runtime.trap("Truck does not exist") };
      case (?truck) {
        // Allow owner or admin to view
        if (truck.ownerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own trucks");
        };
        truck;
      };
    };
  };

  public shared ({ caller }) func updateTruck(truckNumber : Text, truckType : Text, loadCapacity : Nat, insuranceDetails : Text, permitDetails : Text, fastagNumber : Text, photo : ?Storage.ExternalBlob, assignedDriverId : ?Principal) : async () {
    switch (trucks.get(truckNumber)) {
      case (null) { Runtime.trap("Truck does not exist") };
      case (?truck) {
        if (truck.ownerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own trucks");
        };
        let updatedTruck : Truck = {
          truckNumber;
          truckType;
          loadCapacity;
          insuranceDetails;
          permitDetails;
          fastagNumber;
          photo;
          assignedDriverId;
          ownerId = truck.ownerId;
        };
        trucks.add(truckNumber, updatedTruck);
      };
    };
  };

  // Driver Functions
  public shared ({ caller }) func addDriver(name : Text, phone : Text, aadhaarVerified : Bool, licenseNumber : Text, licenseExpiry : Int, experienceYears : Nat, currentLocation : Text, availabilityStatus : Bool, emergencyContact : Text) : async () {
    let driver : Driver = {
      name;
      phone;
      aadhaarVerified;
      licenseNumber;
      licenseExpiry;
      experienceYears;
      currentLocation;
      availabilityStatus;
      assignedTruckId = null;
      emergencyContact;
      ownerId = caller;
    };
    drivers.add(caller, driver);
  };

  public query ({ caller }) func getDriver(user : Principal) : async Driver {
    switch (drivers.get(user)) {
      case (null) { Runtime.trap("Driver does not exist") };
      case (?driver) {
        // Allow owner or admin to view
        if (driver.ownerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own drivers");
        };
        driver;
      };
    };
  };

  public shared ({ caller }) func updateDriver(user : Principal, name : Text, phone : Text, aadhaarVerified : Bool, licenseNumber : Text, licenseExpiry : Int, experienceYears : Nat, currentLocation : Text, availabilityStatus : Bool, assignedTruckId : ?Principal, emergencyContact : Text) : async () {
    switch (drivers.get(user)) {
      case (null) { Runtime.trap("Driver does not exist") };
      case (?driver) {
        if (driver.ownerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own drivers");
        };
        let updatedDriver : Driver = {
          name;
          phone;
          aadhaarVerified;
          licenseNumber;
          licenseExpiry;
          experienceYears;
          currentLocation;
          availabilityStatus;
          assignedTruckId;
          emergencyContact;
          ownerId = driver.ownerId;
        };
        drivers.add(user, updatedDriver);
      };
    };
  };

  // Helper Functions
  public shared ({ caller }) func addHelper(name : Text, phone : Text, aadhaarVerified : Bool, skills : Text, experienceYears : Nat, availabilityStatus : Bool) : async () {
    let helper : Helper = {
      name;
      phone;
      aadhaarVerified;
      skills;
      experienceYears;
      assignedTruckId = null;
      availabilityStatus;
      ownerId = caller;
    };
    helpers.add(caller, helper);
  };

  public query ({ caller }) func getHelper(user : Principal) : async Helper {
    switch (helpers.get(user)) {
      case (null) { Runtime.trap("Helper does not exist") };
      case (?helper) {
        // Allow owner or admin to view
        if (helper.ownerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own helpers");
        };
        helper;
      };
    };
  };

  public shared ({ caller }) func updateHelper(user : Principal, name : Text, phone : Text, aadhaarVerified : Bool, skills : Text, experienceYears : Nat, assignedTruckId : ?Text, availabilityStatus : Bool) : async () {
    switch (helpers.get(user)) {
      case (null) { Runtime.trap("Helper does not exist") };
      case (?helper) {
        if (helper.ownerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own helpers");
        };
        let updatedHelper : Helper = {
          name;
          phone;
          aadhaarVerified;
          skills;
          experienceYears;
          assignedTruckId;
          availabilityStatus;
          ownerId = helper.ownerId;
        };
        helpers.add(user, updatedHelper);
      };
    };
  };

  // Load Listing Functions
  public shared ({ caller }) func createLoadListing(id : Text, pickupLocation : Text, deliveryLocation : Text, distanceKm : Nat, weightTons : Nat, truckTypeRequired : Text, basePriceRs : Nat) : async () {
    let loadListing : LoadListing = {
      pickupLocation;
      deliveryLocation;
      distanceKm;
      weightTons;
      truckTypeRequired;
      basePriceRs;
      status = #open;
      postedBy = caller;
    };
    loadListings.add(id, loadListing);
  };

  public query ({ caller }) func getLoadListing(id : Text) : async LoadListing {
    switch (loadListings.get(id)) {
      case (null) { Runtime.trap("Load listing does not exist") };
      case (?loadListing) { loadListing };
    };
  };

  public shared ({ caller }) func updateLoadListing(id : Text, pickupLocation : Text, deliveryLocation : Text, distanceKm : Nat, weightTons : Nat, truckTypeRequired : Text, basePriceRs : Nat, status : LoadStatus) : async () {
    switch (loadListings.get(id)) {
      case (null) { Runtime.trap("Load listing does not exist") };
      case (?loadListing) {
        if (loadListing.postedBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own load listings");
        };
        let updatedLoadListing : LoadListing = {
          pickupLocation;
          deliveryLocation;
          distanceKm;
          weightTons;
          truckTypeRequired;
          basePriceRs;
          status;
          postedBy = loadListing.postedBy;
        };
        loadListings.add(id, updatedLoadListing);
      };
    };
  };

  // Trip Functions
  public shared ({ caller }) func createTrip(id : Text, loadId : Text, truckId : Text, driverId : Text, agreedPriceRs : Nat, advanceAmountRs : Nat, remainingAmountRs : Nat, paymentStatus : Text, pickupLocation : Text, deliveryLocation : Text, distanceKm : Nat) : async () {
    let trip : Trip = {
      loadId;
      truckId;
      driverId;
      status = #pending;
      agreedPriceRs;
      advanceAmountRs;
      remainingAmountRs;
      paymentStatus;
      pickupLocation;
      deliveryLocation;
      distanceKm;
      createdAt = Time.now();
    };
    trips.add(id, trip);
  };

  public query ({ caller }) func getTrip(id : Text) : async Trip {
    switch (trips.get(id)) {
      case (null) { Runtime.trap("Trip does not exist") };
      case (?trip) { trip };
    };
  };

  public shared ({ caller }) func updateTripStatus(id : Text, status : TripStatus) : async () {
    switch (trips.get(id)) {
      case (null) { Runtime.trap("Trip does not exist") };
      case (?trip) {
        let updatedTrip : Trip = {
          loadId = trip.loadId;
          truckId = trip.truckId;
          driverId = trip.driverId;
          status;
          agreedPriceRs = trip.agreedPriceRs;
          advanceAmountRs = trip.advanceAmountRs;
          remainingAmountRs = trip.remainingAmountRs;
          paymentStatus = trip.paymentStatus;
          pickupLocation = trip.pickupLocation;
          deliveryLocation = trip.deliveryLocation;
          distanceKm = trip.distanceKm;
          createdAt = trip.createdAt;
        };
        trips.add(id, updatedTrip);
      };
    };
  };

  // Wallet Functions
  public shared ({ caller }) func createWallet() : async () {
    let wallet : Wallet = {
      balance = 0;
      transactions = [];
    };
    wallets.add(caller, wallet);
  };

  public query ({ caller }) func getWallet() : async ?Wallet {
    wallets.get(caller);
  };

  public shared ({ caller }) func addTransaction(amount : Nat, transactionType : TransactionType, description : Text) : async () {
    let transaction : Transaction = {
      amount;
      transactionType;
      description;
      timestamp = Time.now();
    };

    switch (wallets.get(caller)) {
      case (null) {
        Runtime.trap("Wallet does not exist. Create one first.");
      };
      case (?wallet) {
        let updatedTransactions = wallet.transactions.concat([transaction]);
        let newBalance = switch (transactionType) {
          case (#credit) { wallet.balance + amount };
          case (#debit) {
            if (wallet.balance < amount) {
              Runtime.trap("Insufficient balance");
            };
            wallet.balance - amount;
          };
        };
        wallets.add(
          caller,
          {
            balance = newBalance;
            transactions = updatedTransactions;
          },
        );
      };
    };
  };

  // Job Posting Functions
  public shared ({ caller }) func createJobPosting(id : Text, roleType : JobRoleType, salary : Nat, location : Text, experienceRequired : Nat, truckType : Text) : async () {
    let jobPosting : JobPosting = {
      roleType;
      salary;
      location;
      experienceRequired;
      truckType;
      status = true;
      postedBy = caller;
      applicants = [];
    };
    jobPostings.add(id, jobPosting);
  };

  public query ({ caller }) func getJobPosting(id : Text) : async JobPosting {
    switch (jobPostings.get(id)) {
      case (null) { Runtime.trap("Job posting does not exist") };
      case (?job) { job };
    };
  };

  public shared ({ caller }) func applyForJob(id : Text) : async () {
    switch (jobPostings.get(id)) {
      case (null) {
        Runtime.trap("Job posting does not exist");
      };
      case (?job) {
        let newApplicants = job.applicants.concat([caller]);
        let updatedJob = {
          roleType = job.roleType;
          salary = job.salary;
          location = job.location;
          experienceRequired = job.experienceRequired;
          truckType = job.truckType;
          status = job.status;
          postedBy = job.postedBy;
          applicants = newApplicants;
        };
        jobPostings.add(id, updatedJob);
      };
    };
  };

  public shared ({ caller }) func closeJobPosting(id : Text) : async () {
    switch (jobPostings.get(id)) {
      case (null) { Runtime.trap("Job posting does not exist") };
      case (?job) {
        if (job.postedBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only close your own job postings");
        };
        let updatedJob = {
          roleType = job.roleType;
          salary = job.salary;
          location = job.location;
          experienceRequired = job.experienceRequired;
          truckType = job.truckType;
          status = false;
          postedBy = job.postedBy;
          applicants = job.applicants;
        };
        jobPostings.add(id, updatedJob);
      };
    };
  };

  // Notification Functions
  public shared ({ caller }) func addNotification(message : Text, notificationType : NotificationType) : async () {
    let newNotification : Notification = {
      message;
      notificationType;
      isRead = false;
      timestamp = Time.now();
    };

    let userNotifications = switch (notifications.get(caller)) {
      case (null) { List.empty<Notification>() };
      case (?notifs) { notifs };
    };

    userNotifications.add(newNotification);
    notifications.add(caller, userNotifications);
  };

  public query ({ caller }) func getNotifications() : async [Notification] {
    switch (notifications.get(caller)) {
      case (null) { [] };
      case (?notifs) { notifs.reverse().toArray() };
    };
  };

  public shared ({ caller }) func markNotificationAsRead(index : Nat) : async () {
    switch (notifications.get(caller)) {
      case (null) { Runtime.trap("No notifications found") };
      case (?notifs) {
        let notifsArray = notifs.reverse().toArray();
        if (index >= notifsArray.size()) {
          Runtime.trap("Invalid notification index");
        };
        let updatedNotifs = Array.tabulate(
          notifsArray.size(),
          func(i : Nat) : Notification {
            if (i == index) {
              {
                message = notifsArray[i].message;
                notificationType = notifsArray[i].notificationType;
                isRead = true;
                timestamp = notifsArray[i].timestamp;
              };
            } else {
              notifsArray[i];
            };
          },
        );
        let newList = List.empty<Notification>();
        for (notif in updatedNotifs.vals()) {
          newList.add(notif);
        };
        notifications.add(caller, newList);
      };
    };
  };

  // Admin Functions
  public shared ({ caller }) func approveUser(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can approve users");
    };
    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?profile) {
        let updatedProfile = {
          userRole = profile.userRole;
          name = profile.name;
          phone = profile.phone;
          location = profile.location;
          approvalStatus = #approved;
          subscriptionPlan = profile.subscriptionPlan;
          principal = user;
        };
        userProfiles.add(user, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func blockUser(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can block users");
    };
    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?profile) {
        let updatedProfile = {
          userRole = profile.userRole;
          name = profile.name;
          phone = profile.phone;
          location = profile.location;
          approvalStatus = #blocked;
          subscriptionPlan = profile.subscriptionPlan;
          principal = user;
        };
        userProfiles.add(user, updatedProfile);
      };
    };
  };

  // Public Queries for Real-time Data Access
  public query ({ caller }) func getPublicLoadListings() : async [(Text, LoadListing)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access public load listings");
    };

    loadListings.toArray().filter(
      func((_, l)) { l.status == #open }
    );
  };

  public query ({ caller }) func getUserTrips() : async [(Text, Trip)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access user trips");
    };

    let callerText = caller.toText();

    trips.toArray().filter(
      func((_, t)) {
        // Check if caller is the driver
        if (t.driverId == callerText) {
          return true;
        };

        // Check if caller posted the load for this trip
        switch (loadListings.get(t.loadId)) {
          case (null) { false };
          case (?load) { load.postedBy == caller };
        };
      }
    );
  };

  public query ({ caller }) func getPublicJobPostings() : async [(Text, JobPosting)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access job postings");
    };

    jobPostings.toArray().filter(
      func((_, j)) { j.status }
    );
  };

  public query ({ caller }) func getMyLoadListings() : async [LoadListing] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access load listings");
    };

    loadListings.values().toArray().filter(
      func(l) { l.postedBy == caller }
    );
  };

  public query ({ caller }) func getAllLoads() : async [LoadListing] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all loads");
    };
    loadListings.values().toArray();
  };

  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userProfiles.values().toArray();
  };

  public query ({ caller }) func getAdminStats() : async { totalUsers : Nat; activeTrips : Nat; pendingVerifications : Nat } {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view stats");
    };
    let totalUsers = userProfiles.size();
    var activeTrips = 0;
    for (trip in trips.values()) {
      switch (trip.status) {
        case (#pending or #accepted or #loading or #inTransit) {
          activeTrips += 1;
        };
        case (_) {};
      };
    };
    var pendingVerifications = 0;
    for (profile in userProfiles.values()) {
      switch (profile.approvalStatus) {
        case (#pending) {
          pendingVerifications += 1;
        };
        case (_) {};
      };
    };
    { totalUsers; activeTrips; pendingVerifications };
  };

  public query ({ caller }) func getAllTrips() : async [Trip] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all trips");
    };
    trips.values().toArray();
  };

  public query ({ caller }) func getAllJobPostings() : async [JobPosting] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all job postings");
    };
    jobPostings.values().toArray();
  };
};
