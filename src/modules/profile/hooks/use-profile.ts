import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { authApi } from "@/services/api-service";
import { setAuthEmail } from "@/store/auth-store";

export interface UserProfile {
  id: string;
  email: string;
  createdAt: string;
  urlCount: number;
  totalClicks: number;
}

export const useProfile = () => {
  const query = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const { data } = await authApi.get<UserProfile>("/auth/profile");
        setAuthEmail(data.email);
        return data;
      } catch (error) {
        const message = getApiErrorMessage(error, "Failed to load profile.");
        toast.error(message);
        throw new Error(message);
      }
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

