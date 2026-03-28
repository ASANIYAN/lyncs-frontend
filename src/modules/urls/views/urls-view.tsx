import * as React from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Link2,
  MousePointerClick,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DataTable, {
  type VisibilityState,
} from "@/components/custom-components/data-table";
import {
  CardContent,
  CardHeader,
  CardTitle,
  LyncsCard,
  LyncsStatCard,
} from "@/components/custom-components/custom-card";
import { CustomButton } from "@/components/custom-components/custom-button";
import { toast } from "@/components/custom-components/custom-toast";
import ShortenBar from "../components/shorten-bar";
import UrlTableToolbar from "../components/url-table-toolbar";
import DeleteUrlDialog from "../components/delete-url-dialog";
import { getUrlColumns } from "../components/url-table-columns";
import { useUrls } from "../hooks/use-urls";
import { useDeleteUrl } from "../hooks/use-delete-url";
import { useProfile } from "../../profile/hooks/use-profile";

const useMediaQuery = (query: string) => {
  const getMatch = () =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia(query).matches
      : false;

  const [matches, setMatches] = React.useState(getMatch);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", listener);

    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const UrlsView = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<"ASC" | "DESC">("DESC");
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);
  const [analyticsTarget, setAnalyticsTarget] = React.useState<string | null>(
    null,
  );
  const isSmUp = useMediaQuery("(min-width: 640px)");

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  React.useEffect(() => {
    setColumnVisibility({
      created_at: isSmUp,
      is_active: isSmUp,
    });
  }, [isSmUp]);

  const { data: profile } = useProfile();
  const { data, total, last_page, isLoading, refetch, isFetching } = useUrls({
    page,
    search,
    status: status as "active" | "inactive" | "",
    sortOrder,
    limit: 8,
  });

  const { mutate: deleteUrl, isPending, variables } = useDeleteUrl();

  React.useEffect(() => {
    if (analyticsTarget) {
      navigate(`/dashboard/analytics/${analyticsTarget}`);
      setAnalyticsTarget(null);
    }
  }, [analyticsTarget, navigate]);

  React.useEffect(() => {
    if (page > last_page) {
      setPage(last_page);
    }
  }, [page, last_page]);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteUrl(deleteTarget, {
      onSuccess: (data) => {
        toast.success(data.message || "Short URL deleted");
        setDeleteTarget(null);
      },
      onError: () => {
        toast.error("Failed to delete URL");
      },
    });
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xxii font-semibold tracking-[-0.5px] text-lyncs-text">
          URLs
        </h1>
        <p className="text-xiii text-lyncs-text-muted">
          Manage and track your shortened links
        </p>
      </div>

      <LyncsCard className="mt-6">
        <CardHeader className="border-b border-lyncs-border">
          <CardTitle className="text-[12px] uppercase tracking-[0.5px] text-lyncs-text-muted">
            Shorten a URL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ShortenBar />
        </CardContent>
      </LyncsCard>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <LyncsStatCard
          label="Total URLs"
          value={profile?.urlCount ?? 0}
          icon={<Link2 className="size-4 text-lyncs-accent" />}
          accent
        />
        <LyncsStatCard
          label="Total clicks"
          value={profile?.totalClicks ?? 0}
          icon={<MousePointerClick className="size-4 text-lyncs-text" />}
        />
        <LyncsStatCard
          label="Member since"
          value={profile?.createdAt ? formatDate(profile.createdAt) : "—"}
          icon={<Calendar className="size-4 text-lyncs-text" />}
        />
      </div>

      <div className="mt-6">
        <DataTable
          columns={getUrlColumns({
            onDelete: (code) => setDeleteTarget(code),
            onViewAnalytics: (code) => setAnalyticsTarget(code),
            deletingCode: variables ?? null,
          })}
          data={data}
          loading={isLoading}
          toolbar={() => (
            <UrlTableToolbar
              search={search}
              onSearchChange={(val) => {
                setPage(1);
                setSearch(val);
              }}
              status={status}
              onStatusChange={(val) => {
                setPage(1);
                setStatus(val);
              }}
              sortOrder={sortOrder}
              onSortOrderChange={(val) => setSortOrder(val)}
              onRefresh={refetch}
              isRefreshing={isFetching}
            />
          )}
          hidePagination
          emptyTitle="No URLs yet"
          emptyDescription="Paste a link above to create your first short URL"
          emptyIcon={<Link2 className="size-5" />}
          columnVisibility={columnVisibility}
        />

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-lyncs-text-muted">
            {total} URL{total === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-1.5">
            <CustomButton
              variant="ghost"
              size="sm"
              leftIcon={<ChevronLeft className="size-4" />}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              Prev
            </CustomButton>
            <CustomButton
              variant="ghost"
              size="sm"
              rightIcon={<ChevronRight className="size-4" />}
              onClick={() => setPage((prev) => Math.min(last_page, prev + 1))}
              disabled={page === last_page}
            >
              Next
            </CustomButton>
          </div>
        </div>
      </div>

      <DeleteUrlDialog
        open={!!deleteTarget}
        shortCode={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isPending={isPending}
      />
    </div>
  );
};

export default UrlsView;
