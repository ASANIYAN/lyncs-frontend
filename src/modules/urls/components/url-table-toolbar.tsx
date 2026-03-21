import * as React from "react";
import { RefreshCw, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { CustomButton } from "@/components/custom-components/custom-button";

interface UrlTableToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  sortOrder: "ASC" | "DESC";
  onSortOrderChange: (val: "ASC" | "DESC") => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const UrlTableToolbar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortOrder,
  onSortOrderChange,
  onRefresh,
  isRefreshing,
}: UrlTableToolbarProps) => {
  const [localSearch, setLocalSearch] = React.useState(search);

  React.useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      onSearchChange(localSearch);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="relative w-full sm:w-56">
        <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-lyncs-text-muted" />
        <input
          value={localSearch}
          onChange={(event) => setLocalSearch(event.target.value)}
          placeholder="Search"
          className={cn(
            "h-[38px] w-full rounded-[--radius-md] border border-lyncs-border bg-lyncs-card pl-9 pr-3 text-[13px] text-lyncs-text-subtle outline-none",
            "hover:border-lyncs-border-hover focus:border-lyncs-accent",
          )}
        />
      </div>

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        className={cn(
          "bg-lyncs-card border border-lyncs-border text-lyncs-text-subtle",
          "text-[13px] rounded-[--radius-md] px-3 py-2 outline-none cursor-pointer",
          "hover:border-lyncs-border-hover focus:border-lyncs-accent",
          "appearance-none h-[38px]",
        )}
      >
        <option value="">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <select
        value={sortOrder}
        onChange={(event) => onSortOrderChange(event.target.value as "ASC" | "DESC")}
        className={cn(
          "bg-lyncs-card border border-lyncs-border text-lyncs-text-subtle",
          "text-[13px] rounded-[--radius-md] px-3 py-2 outline-none cursor-pointer",
          "hover:border-lyncs-border-hover focus:border-lyncs-accent",
          "appearance-none h-[38px]",
        )}
      >
        <option value="DESC">Newest first</option>
        <option value="ASC">Oldest first</option>
      </select>

      <CustomButton
        variant="ghost"
        size="sm"
        leftIcon={<RefreshCw className="size-4" />}
        loading={isRefreshing}
        onClick={onRefresh}
      >
        Refresh
      </CustomButton>
    </div>
  );
};

export default UrlTableToolbar;
