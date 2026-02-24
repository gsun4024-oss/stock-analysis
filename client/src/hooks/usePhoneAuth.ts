/**
 * 手机号认证 Hook
 * 封装 trpc.phoneAuth.me 查询，提供统一的认证状态
 */

import { trpc } from "@/lib/trpc";

export function usePhoneAuth() {
  const { data: user, isLoading, refetch } = trpc.phoneAuth.me.useQuery(undefined, {
    retry: false,
    staleTime: 30 * 1000, // 30 秒缓存，确保角色变更能及时生效
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    refetch,
  };
}
