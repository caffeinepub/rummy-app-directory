import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const DEFAULT_PASSWORD = "admin@123";

function getAdminPassword(): string {
  return localStorage.getItem("adminPassword") || DEFAULT_PASSWORD;
}

type Mode = "login" | "setup";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [mode, _setMode] = useState<Mode>(
    localStorage.getItem("adminPassword") ? "login" : "setup",
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    if (password === getAdminPassword()) {
      localStorage.setItem("adminAuth", JSON.stringify({ isAdmin: true }));
      toast.success("Login successful!");
      navigate({ to: "/admin" });
    } else {
      setError("Incorrect password. Please try again.");
    }
    setLoading(false);
  };

  const handleSetupPassword = async () => {
    if (!password.trim() || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    localStorage.setItem("adminPassword", password);
    localStorage.setItem("adminAuth", JSON.stringify({ isAdmin: true }));
    toast.success("Admin password set! You are now logged in.");
    navigate({ to: "/admin" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, oklch(0.78 0.16 80 / 0.06) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-3"
            data-ocid="nav.link"
          >
            <img
              src="/assets/generated/gaming-logo.dim_200x200.png"
              alt="GameZone"
              className="w-12 h-12 rounded-xl object-cover"
            />
            <span className="font-display font-bold text-2xl text-foreground">
              GameZone
            </span>
          </a>
        </div>

        <div
          className="rounded-2xl border border-border bg-card p-8 shadow-lg"
          data-ocid="login.panel"
        >
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-2xl text-foreground">
                {mode === "login" ? "Admin Login" : "Set Admin Password"}
              </h2>
            </div>
            <p className="text-muted-foreground text-sm">
              {mode === "login"
                ? "Enter your admin password to continue"
                : "First time setup — choose a secure password"}
            </p>
          </div>

          {error && (
            <Alert
              variant="destructive"
              className="mb-4"
              data-ocid="login.error_state"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    mode === "setup"
                      ? "Choose a password"
                      : "Enter your password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (mode === "login" ? handleLogin() : undefined)
                  }
                  className="pl-10 pr-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  data-ocid="login.input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {mode === "setup" && (
              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSetupPassword()
                    }
                    className="pl-10 pr-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    data-ocid="login.confirm.input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="button"
              onClick={mode === "login" ? handleLogin : handleSetupPassword}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold"
              data-ocid="login.submit_button"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Please
                  wait...
                </>
              ) : mode === "login" ? (
                "Login to Admin Panel"
              ) : (
                "Set Password & Login"
              )}
            </Button>

            {mode === "login" && (
              <p className="text-center text-xs text-muted-foreground pt-2">
                Default password is{" "}
                <span className="font-mono font-bold text-primary">
                  admin@123
                </span>{" "}
                (change it in settings after login)
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
