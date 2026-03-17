import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AppDownloadStat,
  AppEntry,
  MonthlyTraffic,
  SiteSettings,
} from "../backend.d";
import { useActor } from "./useActor";

// Extended actor type for analytics methods not yet in generated interface
type AnalyticsActor = {
  recordDownload(appId: string): Promise<void>;
  recordPageVisit(monthKey: string): Promise<void>;
  getDownloadStats(): Promise<Array<AppDownloadStat>>;
  getMonthlyTraffic(): Promise<Array<MonthlyTraffic>>;
};

export function useGetAllApps() {
  const { actor, isFetching } = useActor();
  return useQuery<AppEntry[]>({
    queryKey: ["apps"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllApps();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedApps() {
  const { actor, isFetching } = useActor();
  return useQuery<AppEntry[]>({
    queryKey: ["apps", "featured"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedApps();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSiteSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<SiteSettings>({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      if (!actor)
        return {
          siteTitle: "GameZone",
          tagline: "Top Gaming Apps",
          footerNote: "",
          youtubeLink: "",
          telegramLink: "",
          instagramLink: "",
          facebookLink: "",
          adminPassword: "",
        };
      const result = await actor.getSiteSettings();
      return {
        ...result,
        adminPassword: result.adminPassword ?? "",
      } as SiteSettings;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddApp() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (app: AppEntry) => {
      if (!actor) throw new Error("No actor");
      return actor.addApp(app);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["apps"] }),
  });
}

export function useUpdateApp() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (app: AppEntry) => {
      if (!actor) throw new Error("No actor");
      return actor.updateApp(app);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["apps"] }),
  });
}

export function useDeleteApp() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (appId: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteApp(appId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["apps"] }),
  });
}

export function useUpdateSiteSettings() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings: SiteSettings) => {
      if (!actor) throw new Error("No actor");
      return actor.updateSiteSettings(settings);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["siteSettings"] }),
  });
}

export function useGenerateOTP() {
  const { actor } = useActor();
  return useMutation<string, Error, string>({
    mutationFn: async (phone: string) => {
      if (!actor) throw new Error("No actor");
      return actor.generateOTP(phone);
    },
  });
}

export function useVerifyOTP() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.verifyOTP(phone, otp);
    },
  });
}

export function useRegisterAdminPhone() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: (phone: string) => {
      if (!actor) throw new Error("No actor");
      return actor.registerAdminPhone(phone);
    },
  });
}

export function useIsAdminPhone() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: (phone: string) => {
      if (!actor) throw new Error("No actor");
      return actor.isAdminPhone(phone);
    },
  });
}

export function useRecordDownload() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: (appId: string) => {
      if (!actor) throw new Error("No actor");
      return (actor as unknown as AnalyticsActor).recordDownload(appId);
    },
  });
}

export function useRecordPageVisit() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: (monthKey: string) => {
      if (!actor) throw new Error("No actor");
      return (actor as unknown as AnalyticsActor).recordPageVisit(monthKey);
    },
  });
}

export function useGetDownloadStats() {
  const { actor, isFetching } = useActor();
  return useQuery<AppDownloadStat[]>({
    queryKey: ["downloadStats"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as AnalyticsActor).getDownloadStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMonthlyTraffic() {
  const { actor, isFetching } = useActor();
  return useQuery<MonthlyTraffic[]>({
    queryKey: ["monthlyTraffic"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as AnalyticsActor).getMonthlyTraffic();
    },
    enabled: !!actor && !isFetching,
  });
}

// Extended actor type for password management
type PasswordActor = {
  verifyAdminPassword(password: string): Promise<boolean>;
  changeAdminPassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean>;
};

export function useVerifyAdminPassword() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: (password: string) => {
      if (!actor) throw new Error("No actor");
      return (actor as unknown as PasswordActor).verifyAdminPassword(password);
    },
  });
}

export function useChangeAdminPassword() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: { currentPassword: string; newPassword: string }) => {
      if (!actor) throw new Error("No actor");
      return (actor as unknown as PasswordActor).changeAdminPassword(
        currentPassword,
        newPassword,
      );
    },
  });
}
