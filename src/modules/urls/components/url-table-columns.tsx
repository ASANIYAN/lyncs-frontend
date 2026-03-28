import {
  BarChart2,
  ExternalLink,
  MousePointerClick,
  Trash2,
} from "lucide-react";

import type { ColumnDef } from "@/components/custom-components/data-table";
import { cn } from "@/lib/utils";
import { getShortUrl } from "@/lib/shortUrl";
import {
  LyncsBadge,
  ShortCodePill,
} from "@/components/custom-components/custom-badge";
import { CustomButton } from "@/components/custom-components/custom-button";
import { LyncsSpinner } from "@/components/custom-components/custom-spinner";
import CopyShortUrlButton from "./copy-short-url-button";
import type { UrlRow } from "../hooks/use-urls";

interface UrlColumnsProps {
  onDelete: (shortCode: string) => void;
  onViewAnalytics: (shortCode: string) => void;
  deletingCode?: string | null;
}

export const getUrlColumns = ({
  onDelete,
  onViewAnalytics,
  deletingCode,
}: UrlColumnsProps): ColumnDef<UrlRow>[] => [
  {
    accessorKey: "original_url",
    header: "Original URL",
    cell: ({ row }) => {
      const originalUrl = row.getValue("original_url") as string;
      return (
        <span
          title={originalUrl}
          className="text-xiii text-lyncs-text max-w-55 sm:max-w-[320px] truncate block"
        >
          {originalUrl}
        </span>
      );
    },
  },
  {
    accessorKey: "short_code",
    header: "Short code",
    cell: ({ row }) => {
      const shortCode = row.getValue("short_code") as string;
      const shortUrl = getShortUrl(shortCode);
      return (
        <div className="flex items-center gap-2">
          <ShortCodePill code={shortCode} />
          <CopyShortUrlButton value={shortUrl} />
          <button
            type="button"
            onClick={() =>
              window.open(shortUrl, "_blank", "noopener,noreferrer")
            }
            className="inline-flex items-center text-lyncs-text-muted hover:text-lyncs-text transition-colors"
            aria-label="Open short URL"
          >
            <ExternalLink className="size-3.5" />
          </button>
        </div>
      );
    },
  },
  {
    accessorKey: "click_count",
    header: "Clicks",
    enableSorting: true,
    cell: ({ row }) => {
      const clicks = row.getValue("click_count") as number;
      return (
        <div className="flex items-center gap-1.5 text-xiii tabular-nums">
          <MousePointerClick className="size-3.5" />
          {clicks}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    enableSorting: true,
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string;
      return (
        <span className="text-[12px] text-lyncs-text-muted">
          {new Date(createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;
      return (
        <LyncsBadge variant={isActive ? "active" : "inactive"}>
          {isActive ? "Active" : "Inactive"}
        </LyncsBadge>
      );
    },
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <CustomButton
          variant="icon"
          className={cn("text-lyncs-text-muted hover:text-lyncs-text")}
          onClick={() => onViewAnalytics(row.getValue("short_code") as string)}
          aria-label="View analytics"
        >
          <BarChart2 className="size-3.5" />
        </CustomButton>
        <CustomButton
          variant="icon"
          className={cn("text-lyncs-text-muted hover:text-lyncs-danger")}
          onClick={() => onDelete(row.getValue("short_code") as string)}
          aria-label="Delete URL"
        >
          {deletingCode === (row.getValue("short_code") as string) ? (
            <LyncsSpinner size="sm" />
          ) : (
            <Trash2 className="size-3.5" />
          )}
        </CustomButton>
      </div>
    ),
  },
];
