import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLoginPage from "./pages/AdminLoginPage";
import HomePage from "./pages/HomePage";

const queryClient = new QueryClient();

function isAuthenticated(): boolean {
  try {
    const raw = localStorage.getItem("adminAuth");
    if (!raw) return false;
    const data = JSON.parse(raw);
    return !!data?.isAdmin;
  } catch {
    return false;
  }
}

const rootRoute = createRootRoute();

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminDashboard,
});

const router = createRouter({
  routeTree: rootRoute.addChildren([homeRoute, adminLoginRoute, adminRoute]),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
