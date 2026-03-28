import * as React from "react";

import { unauthApi } from "@/services/api-service";

let hasWarmupRun = false;

export const useBackendWarmup = () => {
  React.useEffect(() => {
    if (hasWarmupRun) return;
    hasWarmupRun = true;

    void unauthApi.get("/");
  }, []);
};

