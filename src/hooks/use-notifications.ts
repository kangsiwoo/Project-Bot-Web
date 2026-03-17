// TanStack Query 훅 - 알림 목록 (커서 기반 페이지네이션)

import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { NotificationEventType, PaginatedNotifications } from "@/types";

export function useNotifications(
  projectId?: string,
  eventType?: NotificationEventType
) {
  return useInfiniteQuery<PaginatedNotifications>({
    queryKey: ["notifications", projectId, eventType],
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams();
      if (pageParam) params.set("cursor", pageParam as string);
      params.set("limit", "20");
      if (eventType) params.set("event_type", eventType);

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
