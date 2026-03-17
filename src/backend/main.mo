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

  // Kept for backward stable variable compatibility
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
    adminPassword : Text;
  };

  public type OTPRecord = {
    code : Text;
    expiresAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  public type MonthlyTraffic = {
    month : Text;
    visits : Nat;
  };

  public type AppDownloadStat = {
    appId : Text;
    appName : Text;
    downloads : Nat;
  };

  // ---- Legacy stable vars kept for migration compatibility ----
  let accessControlState = AccessControl.initState();
  let otpStorage = Map.empty<Text, OTPRecord>();
  let adminPhones = Map.empty<Text, Bool>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var otpCounter : Nat = 0;

  var siteSettings : SiteSettingsV1 = {
    siteTitle = "Crazy Earning";
    tagline = "Best Gaming Apps";
    footerNote = "\u{a9} 2024 Gaming Apps";
  };

  // ---- Stable vars for site settings ----
  stable var stableSiteTitle : Text = "Crazy Earning";
  stable var stableTagline : Text = "Best Gaming Apps";
  stable var stableFooterNote : Text = "\u{a9} 2024 Gaming Apps";

  // ---- Stable vars for social links ----
  stable var youtubeLink : Text = "";
  stable var telegramLink : Text = "";
  stable var instagramLink : Text = "";
  stable var facebookLink : Text = "";

  // ---- Admin password (stable, backend-stored) ----
  stable var adminPasswordHash : Text = "admin@123";

  // ---- Stable backup arrays for Maps ----
  stable var stableApps : [(Text, AppEntry)] = [];
  stable var stableDownloadStats : [(Text, Nat)] = [];
  stable var stableMonthlyVisits : [(Text, Nat)] = [];

  let apps = Map.fromIter<Text, AppEntry>(stableApps.vals());
  let downloadStats = Map.fromIter<Text, Nat>(stableDownloadStats.vals());
  let monthlyVisits = Map.fromIter<Text, Nat>(stableMonthlyVisits.vals());

  system func preupgrade() {
    stableApps := apps.entries().toArray();
    stableDownloadStats := downloadStats.entries().toArray();
    stableMonthlyVisits := monthlyVisits.entries().toArray();
  };

  system func postupgrade() {
    stableApps := [];
    stableDownloadStats := [];
    stableMonthlyVisits := [];
  };

  // ---- Admin Password Management ----
  public query func verifyAdminPassword(password : Text) : async Bool {
    password == adminPasswordHash
  };

  public shared func changeAdminPassword(currentPassword : Text, newPassword : Text) : async Bool {
    if (currentPassword != adminPasswordHash) {
      return false;
    };
    adminPasswordHash := newPassword;
    return true;
  };

  // App Management
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

  // Analytics
  public shared func recordDownload(appId : Text) : async () {
    let current = switch (downloadStats.get(appId)) {
      case (?n) n;
      case null 0;
    };
    downloadStats.add(appId, current + 1);
  };

  public shared func recordPageVisit(monthKey : Text) : async () {
    let current = switch (monthlyVisits.get(monthKey)) {
      case (?n) n;
      case null 0;
    };
    monthlyVisits.add(monthKey, current + 1);
  };

  public query func getDownloadStats() : async [AppDownloadStat] {
    let appList = apps.values().toArray();
    appList.vals().map(func(app : AppEntry) : AppDownloadStat {
      let count = switch (downloadStats.get(app.id)) {
        case (?n) n;
        case null 0;
      };
      { appId = app.id; appName = app.name; downloads = count }
    }).toArray()
  };

  public query func getMonthlyTraffic() : async [MonthlyTraffic] {
    monthlyVisits.entries().toArray().map(
      func(entry : (Text, Nat)) : MonthlyTraffic {
        { month = entry.0; visits = entry.1 }
      }
    ).sort(func(a, b) { Text.compare(a.month, b.month) })
  };

  // Site Settings
  public shared func updateSiteSettings(settings : SiteSettings) : async () {
    stableSiteTitle := settings.siteTitle;
    stableTagline := settings.tagline;
    stableFooterNote := settings.footerNote;
    youtubeLink := settings.youtubeLink;
    telegramLink := settings.telegramLink;
    instagramLink := settings.instagramLink;
    facebookLink := settings.facebookLink;
    // Only update password if a new one is provided
    if (settings.adminPassword != "") {
      adminPasswordHash := settings.adminPassword;
    };
  };

  public query func getSiteSettings() : async SiteSettings {
    {
      siteTitle = stableSiteTitle;
      tagline = stableTagline;
      footerNote = stableFooterNote;
      youtubeLink = youtubeLink;
      telegramLink = telegramLink;
      instagramLink = instagramLink;
      facebookLink = facebookLink;
      adminPassword = ""; // Never expose password
    };
  };
};
