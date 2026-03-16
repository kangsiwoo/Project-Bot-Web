"use client";

// 알림 피드 페이지 - 필터 + 커서 기반 페이지네이션

import { useState, useMemo } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationCard } from "@/components/activity/notification-card";
import { NotificationFilter } from "@/components/activity/notification-filter";
import { Button } from "@/components/ui/button";
import type { NotificationEventType } from "@/types";
import { Loader2 } from "lucide-react";

export default function ActivityPage() {
  const [filter, setFilter] = useState<NotificationEventType | "all">("all");
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useNotifications();

  // 전체 알림을 flat으로 펼침
  const allNotifications = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  // 필터 적용
  const filteredNotifications = useMemo(
    () =>
      filter === "all"
        ? allNotifications
        : allNotifications.filter((n) => n.event_type === filter),
    [allNotifications, filter]
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">
          프로젝트 전체의 실시간 알림을 확인하세요
        </p>
      </div>

      {/* 필터 */}
      <div className="mb-4">
        <NotificationFilter selected={filter} onChange={setFilter} />
      </div>

      {/* 알림 목록 */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      )}

      {!isLoading && filteredNotifications.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p>알림이 없습니다.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filteredNotifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>

      {/* 더 불러오기 */}
      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                불러오는 중...
              </>
            ) : (
              "더 보기"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
