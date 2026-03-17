import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AppDownloadStat {
  'appId' : string,
  'appName' : string,
  'downloads' : bigint,
}
export interface AppEntry {
  'id' : string,
  'isFeatured' : boolean,
  'signUpBonus' : bigint,
  'downloadCount' : string,
  'sortOrder' : bigint,
  'referralLink' : string,
  'name' : string,
  'logoUrl' : string,
  'minWithdrawal' : bigint,
}
export interface MonthlyTraffic { 'month' : string, 'visits' : bigint }
export interface SiteSettings {
  'siteTitle' : string,
  'tagline' : string,
  'footerNote' : string,
  'youtubeLink' : string,
  'telegramLink' : string,
  'instagramLink' : string,
  'facebookLink' : string,
  'adminPassword' : string,
}
export interface UserProfile { 'name' : string }
export type UserRole = { 'admin' : null } |
  { 'user' : null } |
  { 'guest' : null };
export interface _SERVICE {
  '_initializeAccessControlWithSecret' : ActorMethod<[string], undefined>,
  'addApp' : ActorMethod<[AppEntry], undefined>,
  'changeAdminPassword' : ActorMethod<[string, string], boolean>,
  'deleteApp' : ActorMethod<[string], undefined>,
  'generateOTP' : ActorMethod<[string], string>,
  'getAllApps' : ActorMethod<[], Array<AppEntry>>,
  'getDownloadStats' : ActorMethod<[], Array<AppDownloadStat>>,
  'getFeaturedApps' : ActorMethod<[], Array<AppEntry>>,
  'getMonthlyTraffic' : ActorMethod<[], Array<MonthlyTraffic>>,
  'getSiteSettings' : ActorMethod<[], SiteSettings>,
  'getUserProfile' : ActorMethod<[], [] | [UserProfile]>,
  'getUserRole' : ActorMethod<[], UserRole>,
  'isApproved' : ActorMethod<[], boolean>,
  'recordDownload' : ActorMethod<[string], undefined>,
  'recordPageVisit' : ActorMethod<[string], undefined>,
  'updateApp' : ActorMethod<[AppEntry], undefined>,
  'updateSiteSettings' : ActorMethod<[SiteSettings], undefined>,
  'updateUserProfile' : ActorMethod<[UserProfile], undefined>,
  'verifyAdminPassword' : ActorMethod<[string], boolean>,
  'verifyOTP' : ActorMethod<[string, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
