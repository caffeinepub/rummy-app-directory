import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Type Definitions
  public type AppEntry = {
    id : Text;
    name : Text;
    logoUrl : Text;
    signUpBonus : Nat;
    minWithdrawal : Nat;
    downloadCount : Text;
    referralLink : Text;
    isFeatured : Bool;
    sortOrder : Nat;
  };

  public type SiteSettings = {
    siteTitle : Text;
    tagline : Text;
    footerNote : Text;
  };

  public type OTPRecord = {
    code : Text;
    expiresAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  // Site Settings - Persistent Storage (mutable)
  var siteSettings : SiteSettings = {
    siteTitle = "Gaming App Directory";
    tagline = "Best Gaming Apps";
    footerNote = "© 2024 Gaming Apps";
  };

  // App Entries - Persistent Storage
  let apps = Map.empty<Text, AppEntry>();

  // OTP Storage (phoneNumber -> OTPRecord)
  let otpStorage = Map.empty<Text, OTPRecord>();

  // Admin Phones (phoneNumber -> true)
  let adminPhones = Map.empty<Text, Bool>();

  // User Profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // OTP counter for generating unique OTPs
  var otpCounter : Nat = 0;

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // App Management Functions
  public shared ({ caller }) func addApp(app : AppEntry) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add apps");
    };
    apps.add(app.id, app);
  };

  public shared ({ caller }) func updateApp(app : AppEntry) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update apps");
    };
    apps.add(app.id, app);
  };

  public shared ({ caller }) func deleteApp(appId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete apps");
    };
    apps.remove(appId);
  };

  public query ({ caller }) func getAllApps() : async [AppEntry] {
    let appArray = apps.values().toArray();
    let sortedArray = appArray.sort(
      func(a, b) {
        Nat.compare(a.sortOrder, b.sortOrder);
      }
    );
    sortedArray;
  };

  public query ({ caller }) func getFeaturedApps() : async [AppEntry] {
    let featuredArray = apps.values().toArray().filter(
      func(app) {
        app.isFeatured;
      }
    );
    let sortedArray = featuredArray.sort(
      func(a, b) {
        Nat.compare(a.sortOrder, b.sortOrder);
      }
    );
    sortedArray;
  };

  // Site Settings Functions
  public shared ({ caller }) func updateSiteSettings(settings : SiteSettings) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update site settings");
    };
    siteSettings := settings;
  };

  public query ({ caller }) func getSiteSettings() : async SiteSettings {
    siteSettings;
  };

  // Admin Phone Management
  public shared ({ caller }) func registerAdminPhone(phone : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can register new admin phones");
    };
    adminPhones.add(phone, true);
  };

  public query ({ caller }) func isAdminPhone(phone : Text) : async Bool {
    adminPhones.containsKey(phone);
  };

  // OTP Functions - Public (no authorization needed)
  public shared ({ caller }) func generateOTP(phone : Text) : async Text {
    // Generate a 6-digit OTP using time and counter
    otpCounter += 1;
    let seed = Time.now() + otpCounter;
    let seedNat : Nat = (seed % 900000).toNat();
    let otp = (seedNat + 100000).toText();

    let expiresAt = Time.now() + 5_000_000_000; // 5 minutes in nanoseconds
    let record : OTPRecord = {
      code = otp;
      expiresAt;
    };
    otpStorage.add(phone, record);
    otp;
  };

  public shared ({ caller }) func verifyOTP(phone : Text, otp : Text) : async Bool {
    switch (otpStorage.get(phone)) {
      case (null) { false };
      case (?record) {
        let valid = (record.code == otp) and (Time.now() <= record.expiresAt);
        if (valid) { otpStorage.remove(phone) };
        valid;
      };
    };
  };
};
