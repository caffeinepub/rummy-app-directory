import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SiteSettings {
    siteTitle: string;
    tagline: string;
    footerNote: string;
    youtubeLink: string;
    telegramLink: string;
    instagramLink: string;
    facebookLink: string;
    adminPassword: string;
}
export interface AppEntry {
    id: string;
    signUpBonus: bigint;
    referralLink: string;
    sortOrder: bigint;
    name: string;
    logoUrl: string;
    isFeatured: boolean;
    minWithdrawal: bigint;
    downloadCount: string;
}
export interface UserProfile {
    name: string;
}
export interface AppDownloadStat {
    appId: string;
    appName: string;
    downloads: bigint;
}
export interface MonthlyTraffic {
    month: string;
    visits: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addApp(app: AppEntry): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteApp(appId: string): Promise<void>;
    generateOTP(phone: string): Promise<string>;
    getAllApps(): Promise<Array<AppEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedApps(): Promise<Array<AppEntry>>;
    getSiteSettings(): Promise<SiteSettings>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAdminPhone(phone: string): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    registerAdminPhone(phone: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateApp(app: AppEntry): Promise<void>;
    updateSiteSettings(settings: SiteSettings): Promise<void>;
    verifyOTP(phone: string, otp: string): Promise<boolean>;
    recordDownload(appId: string): Promise<void>;
    recordPageVisit(monthKey: string): Promise<void>;
    getDownloadStats(): Promise<Array<AppDownloadStat>>;
    getMonthlyTraffic(): Promise<Array<MonthlyTraffic>>;
    verifyAdminPassword(password: string): Promise<boolean>;
    changeAdminPassword(currentPassword: string, newPassword: string): Promise<boolean>;
}
