"use client";

// 알림 카드 컴포넌트 - 이벤트 타입별 아이콘/색상/배경

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Notification, NotificationEventType } from "@/types";
import {
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Hammer,
  TestTubeDiagonal,
  Rocket,
} from "lucide-react";

const eventConfig: Record<
  NotificationEventType,
  { icon: typeof Lightbulb; iconColor: string; bgColor: string; label: string }
> = {
  plan: { icon: Lightbulb, iconColor: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-950", label: "Plan" },
  question: { icon: HelpCircle, iconColor: "text-amber-600", bgColor: "bg-amber-100 dark:bg-amber-950", label: "Question" },
  complete: { icon: CheckCircle2, iconColor: "text-green-600", bgColor: "bg-green-100 dark:bg-green-950", label: "Complete" },
  error: { icon: XCircle, iconColor: "text-red-600", bgColor: "bg-red-100 dark:bg-red-950", label: "Error" },
  build: { icon: Hammer, iconColor: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-950", label: "Build" },
  test: { icon: TestTubeDiagonal, iconColor: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-950", label: "Test" },
  deploy: { icon: Rocket, iconColor: "text-pink-600", bgColor: "bg-pink-100 dark:bg-pink-950", label: "Deploy" },
};

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "방금 전";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}일 전`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}개월 전`;
  return `${Math.floor(diffMonth / 12)}년 전`;
}

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const config = eventConfig[notification.event_type];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          config.bgColor
        )}
      >
        <Icon className={cn("h-4.5 w-4.5", config.iconColor)} />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-[10px]">
            {notification.project_name}
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            {config.label}
          </Badge>
          <span className="text-[10px] text-muted-foreground ml-auto whitespace-nowrap">
            {formatRelativeTime(notification.created_at)}
          </span>
        </div>
        <p className="text-sm leading-relaxed">{notification.message}</p>
      </div>
    </div>
  );
}
