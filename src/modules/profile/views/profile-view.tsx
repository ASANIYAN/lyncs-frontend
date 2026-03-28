import * as React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  LyncsCard,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom-components/custom-card";
import { CustomButton } from "@/components/custom-components/custom-button";
import SignOutDialog from "@/components/custom-components/signout-dialog";
import { useLogout } from "@/modules/auth/hooks/use-logout";
import ProfileCard from "../components/profile-card";
import { useProfile } from "../hooks/use-profile";

const ProfileView = () => {
  const [signOutDialogOpen, setSignOutDialogOpen] = React.useState(false);
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { data, isLoading } = useProfile();

  const handleSignOut = () => {
    logout().finally(() => {
      navigate("/login");
    });
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xxii font-semibold tracking-[-0.5px] text-lyncs-text">
          Profile
        </h1>
        <p className="text-xiii text-lyncs-text-muted">
          Your account details and usage stats
        </p>
      </div>

      <div className="mt-6 max-w-lg mx-auto">
        {isLoading || !data ? (
          <LyncsCard className="animate-pulse">
            <CardHeader className="border-b border-lyncs-border">
              <div className="h-4 w-32 rounded-[--radius-md] bg-lyncs-elevated" />
              <div className="mt-2 h-3 w-44 rounded-[--radius-md] bg-lyncs-elevated" />
            </CardHeader>
            <CardContent>
              <div className="mt-3 h-14 w-full rounded-[--radius-md] bg-lyncs-elevated" />
              <div className="mt-4 h-20 w-full rounded-[--radius-md] bg-lyncs-elevated" />
            </CardContent>
          </LyncsCard>
        ) : (
          <ProfileCard profile={data} />
        )}
      </div>

      <div className="mt-8 max-w-lg mx-auto">
        <LyncsCard>
          <CardHeader className="border-b border-lyncs-border">
            <CardTitle className="text-xiii text-lyncs-danger">
              Danger zone
            </CardTitle>
            <p className="text-[12px] text-lyncs-text-muted">
              Once you sign out, you will need your credentials to sign back in.
            </p>
          </CardHeader>
          <CardContent>
            <CustomButton
              variant="danger"
              leftIcon={<LogOut className="size-4" />}
              onClick={() => setSignOutDialogOpen(true)}
              className="bg-lyncs-danger text-white border-lyncs-danger hover:bg-lyncs-danger/90"
            >
              Sign out
            </CustomButton>
          </CardContent>
        </LyncsCard>
      </div>

      <SignOutDialog
        open={signOutDialogOpen}
        onOpenChange={setSignOutDialogOpen}
        onConfirm={handleSignOut}
      />
    </div>
  );
};

export default ProfileView;
