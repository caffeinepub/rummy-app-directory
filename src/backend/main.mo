import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

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

  // Keep old SiteSettings type for stable variable compatibility
  type SiteSettingsV1 = {
    siteTitle : Text;
    tagline : Text;
    footerNote : Text;
  };

  public type SiteSettings = {
    siteTitle : Text;
    tagline : Text;
    footerNote : Text;
    youtubeLink : Text;
    telegramLink : Text;
    instagramLink : Text;
    facebookLink : Text;
  };

  public type OTPRecord = {
    code : Text;
    expiresAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  // Kept for stable variable compatibility with previous version
  let accessControlState = AccessControl.initState();
  let otpStorage = Map.empty<Text, OTPRecord>();
  let adminPhones = Map.empty<Text, Bool>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var otpCounter : Nat = 0;

  // Old stable var kept with original type for backward compatibility
  var siteSettings : SiteSettingsV1 = {
    siteTitle = "Gaming App Directory";
    tagline = "Best Gaming Apps";
    footerNote = "\u{a9} 2024 Gaming Apps";
  };

  // New stable vars for social links (added separately to avoid migration issues)
  var youtubeLink : Text = "";
  var telegramLink : Text = "";
  var instagramLink : Text = "";
  var facebookLink : Text = "";

  // App Entries
  let apps = Map.empty<Text, AppEntry>();

  // App Management - no auth check (admin auth handled in frontend)
  public shared func addApp(app : AppEntry) : async () {
    apps.add(app.id, app);
  };

  public shared func updateApp(app : AppEntry) : async () {
    apps.add(app.id, app);
  };

  public shared func deleteApp(appId : Text) : async () {
    apps.remove(appId);
  };

  public query func getAllApps() : async [AppEntry] {
    apps.values().toArray().sort(
      func(a, b) { Nat.compare(a.sortOrder, b.sortOrder) }
    );
  };

  public query func getFeaturedApps() : async [AppEntry] {
    apps.values().toArray().filter(
      func(app) { app.isFeatured }
    ).sort(
      func(a, b) { Nat.compare(a.sortOrder, b.sortOrder) }
    );
  };

  // Site Settings
  public shared func updateSiteSettings(settings : SiteSettings) : async () {
    siteSettings := {
      siteTitle = settings.siteTitle;
      tagline = settings.tagline;
      footerNote = settings.footerNote;
    };
    youtubeLink := settings.youtubeLink;
    telegramLink := settings.telegramLink;
    instagramLink := settings.instagramLink;
    facebookLink := settings.facebookLink;
  };

  public query func getSiteSettings() : async SiteSettings {
    {
      siteTitle = siteSettings.siteTitle;
      tagline = siteSettings.tagline;
      footerNote = siteSettings.footerNote;
      youtubeLink = youtubeLink;
      telegramLink = telegramLink;
      instagramLink = instagramLink;
      facebookLink = facebookLink;
    };
  };
};
