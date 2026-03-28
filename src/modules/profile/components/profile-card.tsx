import { Link2, MousePointerClick } from "lucide-react";

import {
  CardContent,
  CardHeader,
  LyncsCard,
  LyncsStatCard,
} from "@/components/custom-components/custom-card";
import { LyncsAvatar } from "@/components/custom-components/custom-avatar";
import { LyncsSeparator } from "@/components/custom-components/custom-separator";
import type { UserProfile } from "../hooks/use-profile";

interface ProfileCardProps {
  profile: UserProfile;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const initials = `${profile.email?.[0]?.toUpperCase() ?? "U"}@${
    profile.email?.[1]?.toUpperCase() ?? ""
  }`;

  return (
    <LyncsCard>
      <CardHeader className="flex flex-col gap-4 border-b border-lyncs-border">
        <div className="flex items-center gap-3">
          <LyncsAvatar size="lg" fallback={initials} />
          <div>
            <div className="text-[14px] font-medium text-lyncs-text">
              {profile.email}
            </div>
            <div className="text-[12px] text-lyncs-text-muted">
              Member since {formatDate(profile.createdAt)}
            </div>
          </div>
        </div>
        <LyncsSeparator />
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <LyncsStatCard
            label="Total URLs"
            value={profile.urlCount}
            icon={<Link2 className="size-4 text-lyncs-accent" />}
            accent
          />
          <LyncsStatCard
            label="Total clicks"
            value={profile.totalClicks}
            icon={<MousePointerClick className="size-4 text-lyncs-text" />}
          />
        </div>

        <div className="mt-5">
          {[
            { label: "Email", value: profile.email },
            { label: "Member since", value: formatDate(profile.createdAt) },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-2.5 border-b border-lyncs-border last:border-0 text-xiii"
            >
              <span className="text-lyncs-text-muted">{row.label}</span>
              <span className={"text-lyncs-text"}>{row.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </LyncsCard>
  );
};

export default ProfileCard;
