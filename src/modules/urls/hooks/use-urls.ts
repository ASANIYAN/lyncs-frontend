import { useQuery } from "@tanstack/react-query";

export interface UrlRow {
  id: string;
  original_url: string;
  short_code: string;
  click_count: string;
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

const buildDummyUrls = (): UrlRow[] => [
  {
    id: "1",
    original_url: "https://www.nasa.gov/solar-system",
    short_code: "nasa01",
    click_count: "126",
    created_at: "2025-12-04T10:12:00.000Z",
    is_active: true,
  },
  {
    id: "2",
    original_url: "https://openai.com/research",
    short_code: "ai2026",
    click_count: "92",
    created_at: "2026-01-18T14:22:00.000Z",
    is_active: true,
  },
  {
    id: "3",
    original_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    short_code: "jsdocs",
    click_count: "44",
    created_at: "2026-02-02T08:45:00.000Z",
    is_active: true,
  },
  {
    id: "4",
    original_url: "https://tailwindcss.com/docs/installation",
    short_code: "twsetup",
    click_count: "30",
    created_at: "2026-02-08T16:02:00.000Z",
    is_active: false,
  },
  {
    id: "5",
    original_url: "https://react.dev/learn",
    short_code: "react01",
    click_count: "78",
    created_at: "2026-02-14T09:12:00.000Z",
    is_active: true,
  },
  {
    id: "6",
    original_url: "https://www.typescriptlang.org/docs/",
    short_code: "tsguide",
    click_count: "21",
    created_at: "2026-02-17T11:10:00.000Z",
    is_active: true,
  },
  {
    id: "7",
    original_url: "https://recharts.org/en-US/api/AreaChart",
    short_code: "chart01",
    click_count: "11",
    created_at: "2026-02-20T18:30:00.000Z",
    is_active: true,
  },
  {
    id: "8",
    original_url: "https://vercel.com/blog",
    short_code: "vercel",
    click_count: "53",
    created_at: "2026-02-24T13:48:00.000Z",
    is_active: false,
  },
  {
    id: "9",
    original_url: "https://zod.dev/",
    short_code: "zoddev",
    click_count: "12",
    created_at: "2026-02-28T07:20:00.000Z",
    is_active: true,
  },
  {
    id: "10",
    original_url: "https://tanstack.com/query/latest",
    short_code: "tquery",
    click_count: "34",
    created_at: "2026-03-01T12:01:00.000Z",
    is_active: true,
  },
  {
    id: "11",
    original_url: "https://github.com/",
    short_code: "git01",
    click_count: "205",
    created_at: "2026-03-04T15:37:00.000Z",
    is_active: true,
  },
  {
    id: "12",
    original_url: "https://lyncs.app/features",
    short_code: "lyncs",
    click_count: "9",
    created_at: "2026-03-08T19:42:00.000Z",
    is_active: false,
  },
];

let dummyUrls = buildDummyUrls();

const applyFilters = ({
  page,
  limit = 8,
  search = "",
  status = "",
  sortOrder = "DESC",
}: UseUrlsParams): UrlsResponse => {
  const searchValue = search.trim().toLowerCase();

  let filtered = dummyUrls.filter((item) => {
    const matchesSearch =
      !searchValue ||
      item.original_url.toLowerCase().includes(searchValue) ||
      item.short_code.toLowerCase().includes(searchValue);

    const matchesStatus =
      status === ""
        ? true
        : status === "active"
          ? item.is_active
          : !item.is_active;

    return matchesSearch && matchesStatus;
  });

  filtered = filtered.sort((a, b) => {
    const aDate = new Date(a.created_at).getTime();
    const bDate = new Date(b.created_at).getTime();
    return sortOrder === "ASC" ? aDate - bDate : bDate - aDate;
  });

  const total = filtered.length;
  const last_page = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(page, 1), last_page);
  const start = (safePage - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return {
    data,
    total,
    page: safePage,
    last_page,
  };
};

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
      return applyFilters(params);
    },
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

export const __urlsStore = {
  get: () => dummyUrls,
  set: (next: UrlRow[]) => {
    dummyUrls = next;
  },
};
