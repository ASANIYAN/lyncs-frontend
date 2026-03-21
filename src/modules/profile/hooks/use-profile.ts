import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";

export interface UserProfile {
  id: string;
  email: string;
  createdAt: string;
  urlCount: number;
  totalClicks: number;
}

const buildProfile = (email: string): UserProfile => ({
  id: "usr_4f2k9d",
  email,
  createdAt: "2025-11-02T09:45:00.000Z",
  urlCount: 124,
  totalClicks: 2941,
});

export const useProfile = () => {
  const { email } = useAuthStore();

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: async () => buildProfile(email),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
