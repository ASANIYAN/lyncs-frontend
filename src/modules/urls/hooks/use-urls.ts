import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { authApi } from "@/services/api-service";

export interface UrlRow {
  id: string;
  original_url: string;
  short_code: string;
  click_count: number;
  created_at: string;
  is_active: boolean;
}

interface UseUrlsParams {
  page: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "";
  sortOrder?: "ASC" | "DESC";
}

interface UrlsResponse {
  data: UrlRow[];
  total: number;
  page: number;
  last_page: number;
}

export const useUrls = (params: UseUrlsParams) => {
  const query = useQuery({
    queryKey: [
      "urls",
      params.page,
      params.limit,
      params.search,
      params.status,
      params.sortOrder,
    ],
    queryFn: async () => {
      try {
        const { data } = await authApi.get<UrlsResponse>("/urls/dashboard", {
          params: {
            page: params.page,
            limit: params.limit,
            search: params.search || undefined,
            status: params.status || undefined,
            sortBy: "created_at",
            sortOrder: params.sortOrder || "DESC",
          },
        });
        return data;
      } catch (error) {
        const message = getApiErrorMessage(error, "Failed to load URLs.");
        toast.error(message);
        throw new Error(message);
      }
    },
    placeholderData: (previousData) => previousData,
  });

  return {
    data: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? params.page,
    last_page: query.data?.last_page ?? 1,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};

