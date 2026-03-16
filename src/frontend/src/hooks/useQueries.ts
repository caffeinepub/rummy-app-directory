import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AppEntry, SiteSettings } from "../backend.d";
import { useActor } from "./useActor";

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
        };
      return actor.getSiteSettings();
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
