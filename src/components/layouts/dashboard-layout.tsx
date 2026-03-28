import * as React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart2, Link2, LogOut, Menu, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { CustomButton } from "@/components/custom-components/custom-button";
import { LyncsAvatar } from "@/components/custom-components/custom-avatar";
import SignOutDialog from "@/components/custom-components/signout-dialog";
import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/modules/auth/hooks/use-logout";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [signOutDialogOpen, setSignOutDialogOpen] = React.useState(false);
  const navigate = useNavigate();
  const { email } = useAuthStore();
  const { logout } = useLogout();

  const initials = email?.[0]?.toUpperCase() ?? "U";

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  const handleSignOutClick = () => {
    setSignOutDialogOpen(true);
    setDrawerOpen(false);
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 px-3 py-2 rounded-[--radius-md] text-[13px] text-lyncs-text-muted hover:bg-lyncs-elevated hover:text-lyncs-text transition-colors",
      isActive &&
        "bg-lyncs-elevated text-lyncs-text border border-lyncs-border",
    );

  return (
    <section className="font-geist min-h-dvh bg-lyncs-bg">
      {/* Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-60 md:flex-col md:border-r md:border-lyncs-border md:bg-lyncs-surface">
        <div className="flex items-center gap-2 px-5 py-4">
          <div className="flex size-7 items-center justify-center rounded-lg bg-lyncs-accent">
            <Link2 className="size-3.5 text-lyncs-bg" />
          </div>
          <span className="text-xv font-semibold text-lyncs-text tracking-[-0.3px]">
            Lyncs
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          <NavLink to="/dashboard" className={navItemClass} end>
            <Link2 className="size-4" />
            URLs
          </NavLink>
          <div className="flex items-center gap-3 px-3 py-2 rounded-[--radius-md] text-xiii text-lyncs-text-muted opacity-50 cursor-not-allowed">
            <BarChart2 className="size-4" />
            Analytics
          </div>
          <NavLink to="/dashboard/profile" className={navItemClass} end>
            <User className="size-4" />
            Profile
          </NavLink>
        </nav>

        <div className="border-t border-lyncs-border px-4 py-4">
          <div className="text-[12px] text-lyncs-text-muted truncate">
            {email}
          </div>
          <CustomButton
            variant="ghost"
            size="sm"
            leftIcon={<LogOut className="size-4" />}
            className="mt-3 w-full justify-start"
            onClick={handleSignOutClick}
          >
            Sign out
          </CustomButton>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-lyncs-border bg-lyncs-surface px-4">
        <CustomButton
          variant="icon"
          aria-label="Open navigation"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu className="size-4" />
        </CustomButton>
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-lyncs-accent">
            <Link2 className="size-3.5 text-lyncs-bg" />
          </div>
          <span className="text-xv font-semibold text-lyncs-text tracking-[-0.3px]">
            Lyncs
          </span>
        </div>
        <LyncsAvatar fallback={initials} size="sm" />
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 transition-opacity",
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <button
          type="button"
          className="absolute inset-0"
          style={{
            backgroundColor: "var(--color-lyncs-bg)",
            opacity: 0.75,
          }}
          aria-label="Close navigation"
          onClick={() => setDrawerOpen(false)}
        />
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-60 bg-lyncs-surface border-r border-lyncs-border px-4 py-5 transition-transform",
            drawerOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-lyncs-accent">
              <Link2 className="size-3.5 text-lyncs-bg" />
            </div>
            <span className="text-xv font-semibold text-lyncs-text tracking-[-0.3px]">
              Lyncs
            </span>
          </div>

          <nav className="mt-6 flex flex-col gap-1">
            <NavLink
              to="/dashboard"
              className={navItemClass}
              end
              onClick={() => setDrawerOpen(false)}
            >
              <Link2 className="size-4" />
              URLs
            </NavLink>
            <div className="flex items-center gap-3 px-3 py-2 rounded-[--radius-md] text-xiii text-lyncs-text-muted opacity-50 cursor-not-allowed">
              <BarChart2 className="size-4" />
              Analytics
            </div>
            <NavLink
              to="/dashboard/profile"
              className={navItemClass}
              end
              onClick={() => setDrawerOpen(false)}
            >
              <User className="size-4" />
              Profile
            </NavLink>
          </nav>

          <div className="mt-auto border-t border-lyncs-border pt-4">
            <div className="text-[12px] text-lyncs-text-muted truncate">
              {email}
            </div>
            <CustomButton
              variant="ghost"
              size="sm"
              leftIcon={<LogOut className="size-4" />}
              className="mt-3 w-full justify-start"
              onClick={handleSignOutClick}
            >
              Sign out
            </CustomButton>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="min-h-dvh overflow-y-auto bg-lyncs-bg md:ml-60 mb-16 md:mb-0">
        {children ?? <Outlet />}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 border-t border-lyncs-border bg-lyncs-surface">
        <div className="grid h-full grid-cols-3">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 text-x",
                isActive ? "text-lyncs-accent" : "text-lyncs-text-muted",
              )
            }
            end
          >
            <Link2 className="size-4" />
            URLs
          </NavLink>
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 text-x",
                isActive ? "text-lyncs-accent" : "text-lyncs-text-muted",
              )
            }
            end
          >
            <User className="size-4" />
            Profile
          </NavLink>
          <button
            type="button"
            onClick={handleSignOutClick}
            className="flex flex-col items-center justify-center gap-1 text-x text-lyncs-text-muted"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </nav>

      <SignOutDialog
        open={signOutDialogOpen}
        onOpenChange={setSignOutDialogOpen}
        onConfirm={handleSignOut}
      />
    </section>
  );
};

export default DashboardLayout;
