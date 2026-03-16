// TanStack Query 훅 - 알림 목록 (커서 기반 페이지네이션)

import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PaginatedNotifications } from "@/types";

export function useNotifications(projectId?: string) {
  return useInfiniteQuery<PaginatedNotifications>({
    queryKey: ["notifications", projectId],
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams();
      if (pageParam) params.set("cursor", pageParam as string);

      const base = projectId
        ? `/api/projects/${projectId}/notifications`
        : "/api/projects/all/notifications";

      return api<PaginatedNotifications>(
        `${base}?${params.toString()}`
      );
    },
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  });
}
