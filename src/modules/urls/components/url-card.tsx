import { BarChart2, ExternalLink, MousePointerClick, Trash2 } from "lucide-react";

import { LyncsCard, CardContent } from "@/components/custom-components/custom-card";
import { LyncsBadge, ShortCodePill } from "@/components/custom-components/custom-badge";
import { CustomButton } from "@/components/custom-components/custom-button";
import { getShortUrl } from "@/lib/shortUrl";
import { cn } from "@/lib/utils";
import type { UrlRow } from "../hooks/use-urls";

interface UrlCardProps {
  url: UrlRow;
  onViewAnalytics: (shortCode: string) => void;
  onDelete: (shortCode: string) => void;
}

const UrlCard = ({ url, onViewAnalytics, onDelete }: UrlCardProps) => {
  const shortUrl = getShortUrl(url.short_code);

  return (
    <LyncsCard className="rounded-xl">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] text-lyncs-text truncate">
              {url.original_url}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <ShortCodePill code={url.short_code} />
              <button
                type="button"
                onClick={() => window.open(shortUrl, "_blank", "noopener,noreferrer")}
                className="text-lyncs-text-muted hover:text-lyncs-text transition-colors"
                aria-label="Open short URL"
              >
                <ExternalLink className="size-3.5" />
              </button>
            </div>
          </div>
          <LyncsBadge variant={url.is_active ? "active" : "inactive"}>
            {url.is_active ? "Active" : "Inactive"}
          </LyncsBadge>
        </div>

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[12px] text-lyncs-text-muted">
            <MousePointerClick className="size-3" />
            {url.click_count} clicks
          </span>
          <div className="flex items-center gap-1.5">
            <CustomButton
              variant="icon"
              className={cn("text-lyncs-text-muted hover:text-lyncs-text")}
              onClick={() => onViewAnalytics(url.short_code)}
            >
              <BarChart2 className="size-3.5" />
            </CustomButton>
            <CustomButton
              variant="icon"
              className={cn("text-lyncs-text-muted hover:text-lyncs-danger")}
              onClick={() => onDelete(url.short_code)}
            >
              <Trash2 className="size-3.5" />
            </CustomButton>
          </div>
        </div>
      </CardContent>
    </LyncsCard>
  );
};

export default UrlCard;
