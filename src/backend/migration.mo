import Map "mo:core/Map";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Storage "blob-storage/Storage";

module {
  // ---- Old types (from previous deployed version) ----
  type OldUserRole = {
    #driver;
    #truckOwner;
    #transporter;
    #admin;
  };

  type ApprovalStatus = {
    #pending;
    #approved;
    #blocked;
  };

  type SubscriptionPlan = {
    #basic;
    #standard;
    #premium;
  };

  type OldUserProfile = {
    userRole : OldUserRole;
    name : Text;
    phone : Text;
    location : Text;
    approvalStatus : ApprovalStatus;
    subscriptionPlan : SubscriptionPlan;
    principal : Principal;
  };

  // ---- New types (match current main.mo) ----
  type NewUserRole = {
    #driver;
    #truckOwner;
    #transporter;
    #admin;
    #jobSeeker;
  };

  type NewUserProfile = {
    userRole : NewUserRole;
    name : Text;
    phone : Text;
    location : Text;
    approvalStatus : ApprovalStatus;
    subscriptionPlan : SubscriptionPlan;
    principal : Principal;
  };

  // ---- Stable state shapes ----
  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let migratedProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_key, profile) {
        let newRole : NewUserRole = switch (profile.userRole) {
          case (#driver) { #driver };
          case (#truckOwner) { #truckOwner };
          case (#transporter) { #transporter };
          case (#admin) { #admin };
        };
        {
          userRole = newRole;
          name = profile.name;
          phone = profile.phone;
          location = profile.location;
          approvalStatus = profile.approvalStatus;
          subscriptionPlan = profile.subscriptionPlan;
          principal = profile.principal;
        };
      }
    );
    { userProfiles = migratedProfiles };
  };
};
