import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Download, Shield, Star, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect } from "react";
import type { AppEntry } from "../backend.d";
import { useActor } from "../hooks/useActor";
import {
  useAddApp,
  useGetAllApps,
  useGetSiteSettings,
} from "../hooks/useQueries";

const SAMPLE_APPS: AppEntry[] = [
  {
    id: "1",
    name: "Rummy Bharat",
    logoUrl: "/assets/generated/app-rummy-bharat.dim_120x120.png",
    signUpBonus: 91n,
    minWithdrawal: 500n,
    downloadCount: "1.96M+",
    referralLink: "#",
    isFeatured: true,
    sortOrder: 1n,
  },
  {
    id: "2",
    name: "Teen Patti Master",
    logoUrl: "/assets/generated/app-teen-patti.dim_120x120.png",
    signUpBonus: 500n,
    minWithdrawal: 100n,
    downloadCount: "1.75M+",
    referralLink: "#",
    isFeatured: true,
    sortOrder: 2n,
  },
  {
    id: "3",
    name: "Rummy Circle",
    logoUrl: "/assets/generated/app-rummy-circle.dim_120x120.png",
    signUpBonus: 65n,
    minWithdrawal: 200n,
    downloadCount: "1.50M+",
    referralLink: "#",
    isFeatured: false,
    sortOrder: 3n,
  },
  {
    id: "4",
    name: "Daman Game",
    logoUrl: "/assets/generated/app-daman-game.dim_120x120.png",
    signUpBonus: 100n,
    minWithdrawal: 300n,
    downloadCount: "1.41M+",
    referralLink: "#",
    isFeatured: false,
    sortOrder: 4n,
  },
  {
    id: "5",
    name: "91 Lottery",
    logoUrl: "/assets/generated/app-91-lottery.dim_120x120.png",
    signUpBonus: 55n,
    minWithdrawal: 100n,
    downloadCount: "1.29M+",
    referralLink: "#",
    isFeatured: false,
    sortOrder: 5n,
  },
];

const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"];
const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {STAR_KEYS.map((k, i) => (
        <Star
          key={k}
          className={`w-4 h-4 ${i < count ? "fill-primary text-primary" : "text-muted-foreground fill-none"}`}
        />
      ))}
    </div>
  );
}

function AppCard({ app, index }: { app: AppEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className={`relative rounded-xl border bg-card card-hover ${
        app.isFeatured ? "border-primary/50 gold-glow" : "border-border"
      } overflow-hidden`}
      data-ocid={`apps.item.${index + 1}`}
    >
      {app.isFeatured && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
      )}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary border border-border">
              {app.logoUrl ? (
                <img
                  src={app.logoUrl}
                  alt={app.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-display font-bold text-primary">
                  {app.name[0]}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-semibold text-foreground text-lg leading-tight truncate">
                {app.name}
              </h3>
              {app.isFeatured && (
                <Badge className="bg-primary/20 text-primary border-primary/40 text-xs shrink-0">
                  <Crown className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <div className="mt-1">
              <StarRating count={5} />
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Download className="w-3 h-3" />
              <span>{app.downloadCount} Downloads</span>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-secondary/60 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">
              Sign Up Bonus
            </p>
            <p className="text-primary font-display font-bold text-base">
              ₹{app.signUpBonus.toString()}
            </p>
          </div>
          <div className="bg-secondary/60 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">
              Min Withdrawal
            </p>
            <p className="text-foreground font-display font-bold text-base">
              ₹{app.minWithdrawal.toString()}
            </p>
          </div>
        </div>
        <Button
          asChild
          className="mt-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold font-display tracking-wide"
          data-ocid={`apps.primary_button.${index + 1}`}
        >
          <a href={app.referralLink} target="_blank" rel="noopener noreferrer">
            <Download className="w-4 h-4 mr-2" />
            Download Now
          </a>
        </Button>
      </div>
    </motion.div>
  );
}

// Social icons as SVG components
function YouTubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="w-5 h-5 fill-current"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1C4.5 20.4 12 20.4 12 20.4s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="w-5 h-5 fill-current"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.9 8.2-2 9.4c-.1.6-.5.8-.9.5l-2.6-1.9-1.2 1.2c-.1.1-.3.2-.6.2l.2-2.7 5-4.5c.2-.2 0-.3-.3-.1L6.2 14.8 3.7 14c-.5-.2-.5-.5.1-.7l11.6-4.5c.5-.2.9.1.5.4z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="w-5 h-5 fill-current"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12c0-3.2 0-3.6.1-4.8C2.4 3.9 4 2.3 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7C24 15.7 24 15.3 24 12s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="w-5 h-5 fill-current"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1C0 18.1 4.4 23.1 10.1 24v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-1.9.9-1.9 1.9v2.2h3.3l-.5 3.5h-2.8V24C19.6 23.1 24 18.1 24 12.1z" />
    </svg>
  );
}

interface SocialLinksProps {
  youtubeLink?: string;
  telegramLink?: string;
  instagramLink?: string;
  facebookLink?: string;
}

function SocialSidebar({
  youtubeLink,
  telegramLink,
  instagramLink,
  facebookLink,
}: SocialLinksProps) {
  const links = [
    {
      label: "YouTube",
      href: youtubeLink,
      icon: <YouTubeIcon />,
      color: "bg-red-600 hover:bg-red-700",
    },
    {
      label: "Telegram",
      href: telegramLink,
      icon: <TelegramIcon />,
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      label: "Instagram",
      href: instagramLink,
      icon: <InstagramIcon />,
      color:
        "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:opacity-90",
    },
    {
      label: "Facebook",
      href: facebookLink,
      icon: <FacebookIcon />,
      color: "bg-blue-600 hover:bg-blue-700",
    },
  ];

  const visibleLinks = links.filter((l) => l.href && l.href.trim() !== "");

  if (visibleLinks.length === 0) return null;

  return (
    <aside className="w-full lg:w-60 shrink-0">
      <div className="sticky top-24">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-display font-bold text-foreground text-sm mb-3 uppercase tracking-wide">
            Join Us
          </h3>
          <div className="flex flex-col gap-2">
            {visibleLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 text-white rounded-lg px-4 py-3 font-semibold text-sm transition-all ${link.color}`}
                data-ocid={`social.${link.label.toLowerCase()}.button`}
              >
                {link.icon}
                <span>Join {link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function HomePage() {
  const { data: apps, isLoading } = useGetAllApps();
  const { data: settings } = useGetSiteSettings();
  const addApp = useAddApp();
  const { actor } = useActor();

  const seedData = useCallback(async () => {
    await Promise.all(SAMPLE_APPS.map((app) => addApp.mutateAsync(app)));
  }, [addApp]);

  useEffect(() => {
    if (!actor || !apps) return;
    if (apps.length === 0) {
      seedData();
    }
  }, [actor, apps, seedData]);

  const sortedApps = apps
    ? [...apps].sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return Number(a.sortOrder) - Number(b.sortOrder);
      })
    : [];

  const year = new Date().getFullYear();
  const hostname = window.location.hostname;

  const hasSocialLinks =
    settings?.youtubeLink ||
    settings?.telegramLink ||
    settings?.instagramLink ||
    settings?.facebookLink;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="flex items-center gap-3" data-ocid="nav.link">
            <img
              src="/assets/generated/gaming-logo.dim_200x200.png"
              alt="GameZone"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <h1 className="font-display font-bold text-xl text-foreground leading-none">
                {settings?.siteTitle || "Crazy Earning"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {settings?.tagline || "Top Gaming Apps"}
              </p>
            </div>
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/20" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, oklch(0.78 0.16 80 / 0.05) 0%, transparent 60%), radial-gradient(circle at 80% 20%, oklch(0.6 0.2 220 / 0.05) 0%, transparent 60%)",
          }}
        />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-4 px-3 py-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              Top Related Gaming Apps 2026
            </Badge>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4 leading-tight">
              Win Real Cash with{" "}
              <span className="text-primary">India&apos;s Best</span>
              <br />
              Rummy &amp; Card Games
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Download top-rated gaming apps, get instant sign-up bonuses and
              start winning today.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="border-y border-border bg-secondary/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-center">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">100% Trusted Apps</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">10M+ Downloads</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-muted-foreground">Top Rated Games</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Apps Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                data-ocid="apps.loading_state"
              >
                {SKELETON_KEYS.map((k) => (
                  <div
                    key={k}
                    className="rounded-xl border border-border bg-card p-5 space-y-4"
                  >
                    <div className="flex gap-4">
                      <Skeleton className="w-16 h-16 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Skeleton className="h-14 rounded-lg" />
                      <Skeleton className="h-14 rounded-lg" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            ) : sortedApps.length === 0 ? (
              <div className="text-center py-20" data-ocid="apps.empty_state">
                <p className="text-muted-foreground text-lg">
                  No apps listed yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {sortedApps.map((app, i) => (
                  <AppCard key={app.id} app={app} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* Social Sidebar - only shown when at least one link is set */}
          {hasSocialLinks && (
            <SocialSidebar
              youtubeLink={settings?.youtubeLink}
              telegramLink={settings?.telegramLink}
              instagramLink={settings?.instagramLink}
              facebookLink={settings?.facebookLink}
            />
          )}
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 mt-10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-3">
            {settings?.footerNote && (
              <p className="text-muted-foreground text-sm">
                {settings.footerNote}
              </p>
            )}
            <p className="text-muted-foreground/70 text-xs">
              ⚠️ These games involve financial risk. Play responsibly. Must be
              18+ to participate.
            </p>
            <p className="text-muted-foreground/50 text-xs">
              © {year}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors underline underline-offset-2"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
