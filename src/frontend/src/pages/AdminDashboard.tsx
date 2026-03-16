import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  Crown,
  Eye,
  EyeOff,
  KeyRound,
  LayoutGrid,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Save,
  Settings,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { AppEntry, SiteSettings } from "../backend.d";
import {
  useAddApp,
  useDeleteApp,
  useGetAllApps,
  useGetSiteSettings,
  useUpdateApp,
  useUpdateSiteSettings,
} from "../hooks/useQueries";

type Tab = "apps" | "settings";

const emptyApp: AppEntry = {
  id: "",
  name: "",
  logoUrl: "",
  signUpBonus: 0n,
  minWithdrawal: 0n,
  downloadCount: "",
  referralLink: "",
  isFeatured: false,
  sortOrder: 0n,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("apps");
  const [appDialogOpen, setAppDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AppEntry>(emptyApp);
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({
    siteTitle: "",
    tagline: "",
    footerNote: "",
  });

  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const { data: apps, isLoading: appsLoading } = useGetAllApps();
  const { data: settings } = useGetSiteSettings();
  const addApp = useAddApp();
  const updateApp = useUpdateApp();
  const deleteApp = useDeleteApp();
  const updateSettings = useUpdateSiteSettings();

  useEffect(() => {
    if (settings) {
      setSettingsForm(settings);
    }
  }, [settings]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate({ to: "/admin/login" });
  };

  const openAddDialog = () => {
    setEditingApp(null);
    setFormData({ ...emptyApp, id: Date.now().toString() });
    setAppDialogOpen(true);
  };

  const openEditDialog = (app: AppEntry) => {
    setEditingApp(app);
    setFormData({ ...app });
    setAppDialogOpen(true);
  };

  const handleSaveApp = async () => {
    if (!formData.name.trim()) {
      toast.error("App name is required");
      return;
    }
    try {
      if (editingApp) {
        await updateApp.mutateAsync(formData);
        toast.success("App updated successfully!");
      } else {
        await addApp.mutateAsync(formData);
        toast.success("App added successfully!");
      }
      setAppDialogOpen(false);
    } catch {
      toast.error("Failed to save app");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteApp.mutateAsync(deletingId);
      toast.success("App deleted");
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } catch {
      toast.error("Failed to delete app");
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings.mutateAsync(settingsForm);
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  const handleChangePassword = () => {
    if (!newPassword.trim() || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    localStorage.setItem("adminPassword", newPassword);
    setNewPassword("");
    setConfirmNewPassword("");
    toast.success("Password changed successfully!");
  };

  const sortedApps = apps
    ? [...apps].sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder))
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" data-ocid="nav.link">
              <img
                src="/assets/generated/gaming-logo.dim_200x200.png"
                alt="GameZone"
                className="w-9 h-9 rounded-lg object-cover"
              />
            </a>
            <div>
              <h1 className="font-display font-bold text-lg text-foreground">
                Admin Panel
              </h1>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-border text-muted-foreground hover:text-destructive hover:border-destructive"
            data-ocid="admin.logout.button"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Tabs */}
        <div className="flex gap-1 bg-secondary/50 rounded-xl p-1 mb-8 w-fit">
          <button
            type="button"
            onClick={() => setTab("apps")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === "apps"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid="admin.apps.tab"
          >
            <LayoutGrid className="w-4 h-4" /> Apps
          </button>
          <button
            type="button"
            onClick={() => setTab("settings")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === "settings"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid="admin.settings.tab"
          >
            <Settings className="w-4 h-4" /> Site Settings
          </button>
        </div>

        {/* Apps Tab */}
        {tab === "apps" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl text-foreground">
                Manage Apps
              </h2>
              <Button
                type="button"
                onClick={openAddDialog}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                data-ocid="apps.open_modal_button"
              >
                <Plus className="w-4 h-4 mr-2" /> Add New App
              </Button>
            </div>

            {appsLoading ? (
              <div className="space-y-3" data-ocid="apps.loading_state">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : sortedApps.length === 0 ? (
              <div
                className="text-center py-16 rounded-xl border border-dashed border-border"
                data-ocid="apps.empty_state"
              >
                <p className="text-muted-foreground">
                  No apps yet. Add your first app!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedApps.map((app, i) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4"
                    data-ocid={`apps.item.${i + 1}`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                      {app.logoUrl ? (
                        <img
                          src={app.logoUrl}
                          alt={app.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-display font-bold text-primary">
                          {app.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-semibold text-foreground truncate">
                          {app.name}
                        </span>
                        {app.isFeatured && (
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                            <Crown className="w-3 h-3 mr-1" /> Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                        <span>Bonus: ₹{app.signUpBonus.toString()}</span>
                        <span>Min W/D: ₹{app.minWithdrawal.toString()}</span>
                        <span>{app.downloadCount} downloads</span>
                        <span>Sort: {app.sortOrder.toString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(app)}
                        className="border-border hover:border-primary hover:text-primary"
                        data-ocid={`apps.edit_button.${i + 1}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDeletingId(app.id);
                          setDeleteDialogOpen(true);
                        }}
                        className="border-border hover:border-destructive hover:text-destructive"
                        data-ocid={`apps.delete_button.${i + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Settings Tab */}
        {tab === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-6">
                Site Settings
              </h2>
              <div className="max-w-lg space-y-5 bg-card border border-border rounded-xl p-6">
                <div className="space-y-2">
                  <Label htmlFor="siteTitle" className="text-foreground">
                    Site Title
                  </Label>
                  <Input
                    id="siteTitle"
                    value={settingsForm.siteTitle}
                    onChange={(e) =>
                      setSettingsForm((p) => ({
                        ...p,
                        siteTitle: e.target.value,
                      }))
                    }
                    className="bg-secondary border-border text-foreground"
                    placeholder="e.g. GameZone India"
                    data-ocid="settings.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline" className="text-foreground">
                    Tagline
                  </Label>
                  <Input
                    id="tagline"
                    value={settingsForm.tagline}
                    onChange={(e) =>
                      setSettingsForm((p) => ({
                        ...p,
                        tagline: e.target.value,
                      }))
                    }
                    className="bg-secondary border-border text-foreground"
                    placeholder="e.g. India's #1 Gaming Directory"
                    data-ocid="settings.search_input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footerNote" className="text-foreground">
                    Footer Note
                  </Label>
                  <Textarea
                    id="footerNote"
                    value={settingsForm.footerNote}
                    onChange={(e) =>
                      setSettingsForm((p) => ({
                        ...p,
                        footerNote: e.target.value,
                      }))
                    }
                    className="bg-secondary border-border text-foreground"
                    placeholder="Footer message or disclaimer"
                    rows={3}
                    data-ocid="settings.textarea"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={updateSettings.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold"
                  data-ocid="settings.save_button"
                >
                  {updateSettings.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Save Settings
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Change Password Section */}
            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-primary" /> Change Admin
                Password
              </h2>
              <div className="max-w-lg space-y-4 bg-card border border-border rounded-xl p-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-foreground">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPwd ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-10 bg-secondary border-border text-foreground"
                      placeholder="At least 6 characters"
                      data-ocid="settings.password.input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showNewPwd ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmNewPassword"
                    className="text-foreground"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmNewPassword"
                      type={showConfirmPwd ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="pr-10 bg-secondary border-border text-foreground"
                      placeholder="Re-enter new password"
                      data-ocid="settings.confirm_password.input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showConfirmPwd ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleChangePassword}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold"
                  data-ocid="settings.change_password.button"
                >
                  <KeyRound className="w-4 h-4 mr-2" /> Update Password
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* App Add/Edit Dialog */}
      <Dialog open={appDialogOpen} onOpenChange={setAppDialogOpen}>
        <DialogContent
          className="bg-card border-border text-foreground max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="apps.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              {editingApp ? "Edit App" : "Add New App"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-foreground">App Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                className="bg-secondary border-border text-foreground"
                placeholder="e.g. Rummy Gold"
                data-ocid="apps.name.input"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Logo URL</Label>
              <Input
                value={formData.logoUrl}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, logoUrl: e.target.value }))
                }
                className="bg-secondary border-border text-foreground"
                placeholder="https://example.com/logo.png"
                data-ocid="apps.logo.input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Sign Up Bonus (₹)</Label>
                <Input
                  type="number"
                  value={formData.signUpBonus.toString()}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      signUpBonus: BigInt(e.target.value || 0),
                    }))
                  }
                  className="bg-secondary border-border text-foreground"
                  placeholder="100"
                  data-ocid="apps.bonus.input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Min Withdrawal (₹)</Label>
                <Input
                  type="number"
                  value={formData.minWithdrawal.toString()}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      minWithdrawal: BigInt(e.target.value || 0),
                    }))
                  }
                  className="bg-secondary border-border text-foreground"
                  placeholder="200"
                  data-ocid="apps.withdrawal.input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Download Count</Label>
              <Input
                value={formData.downloadCount}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, downloadCount: e.target.value }))
                }
                className="bg-secondary border-border text-foreground"
                placeholder="e.g. 1.5M+"
                data-ocid="apps.downloads.input"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">
                Referral / Download Link
              </Label>
              <Input
                value={formData.referralLink}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, referralLink: e.target.value }))
                }
                className="bg-secondary border-border text-foreground"
                placeholder="https://your-referral-link.com"
                data-ocid="apps.referral.input"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Sort Order</Label>
              <Input
                type="number"
                value={formData.sortOrder.toString()}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    sortOrder: BigInt(e.target.value || 0),
                  }))
                }
                className="bg-secondary border-border text-foreground"
                placeholder="1"
                data-ocid="apps.sort.input"
              />
            </div>

            <div className="flex items-center gap-3 py-2">
              <Switch
                checked={formData.isFeatured}
                onCheckedChange={(v) =>
                  setFormData((p) => ({ ...p, isFeatured: v }))
                }
                data-ocid="apps.featured.switch"
              />
              <Label className="text-foreground cursor-pointer">
                Mark as Featured
              </Label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAppDialogOpen(false)}
              className="border-border text-foreground hover:bg-secondary"
              data-ocid="apps.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveApp}
              disabled={addApp.isPending || updateApp.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-display"
              data-ocid="apps.save_button"
            >
              {addApp.isPending || updateApp.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingApp ? "Update App" : "Add App"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent
          className="bg-card border-border text-foreground"
          data-ocid="apps.delete.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete App
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border text-foreground hover:bg-secondary"
              data-ocid="apps.delete.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              data-ocid="apps.delete.confirm_button"
            >
              {deleteApp.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
