import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useVerifyAdminPassword } from "../hooks/useQueries";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const verifyPassword = useVerifyAdminPassword();

  const handleLogin = async () => {
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const valid = await verifyPassword.mutateAsync(password);
      if (valid) {
        localStorage.setItem("adminAuth", JSON.stringify({ isAdmin: true }));
        toast.success("Login successful!");
        navigate({ to: "/admin" });
      } else {
        setError("Incorrect password");
      }
    } catch {
      setError("Login failed, please try again");
    }
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
                Admin Login
              </h2>
            </div>
            <p className="text-muted-foreground text-sm">
              Enter your admin password to continue
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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

            <Button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold"
              data-ocid="login.submit_button"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
                </>
              ) : (
                "Login to Admin Panel"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
