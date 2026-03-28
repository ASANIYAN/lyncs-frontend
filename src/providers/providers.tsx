import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import router from "../router/router";
import { Toaster } from "@/components/ui/sonner";
import { useBackendWarmup } from "@/modules/system/hooks/use-backend-warmup";
import { registerSessionQueryClient } from "@/modules/system/session/session-runtime";

const Providers = ({ children }: { children: React.ReactNode }) => {
  useBackendWarmup();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 3,
          },
        },
      }),
  );
  registerSessionQueryClient(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {children}
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Providers;
