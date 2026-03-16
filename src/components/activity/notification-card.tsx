"use client";

// 알림 카드 컴포넌트 - 이벤트 타입별 아이콘/색상

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
  { icon: typeof Lightbulb; color: string; label: string }
> = {
  plan: { icon: Lightbulb, color: "text-blue-500", label: "Plan" },
  question: { icon: HelpCircle, color: "text-amber-500", label: "Question" },
  complete: { icon: CheckCircle2, color: "text-green-500", label: "Complete" },
  error: { icon: XCircle, color: "text-red-500", label: "Error" },
  build: { icon: Hammer, color: "text-orange-500", label: "Build" },
  test: { icon: TestTubeDiagonal, color: "text-purple-500", label: "Test" },
  deploy: { icon: Rocket, color: "text-indigo-500", label: "Deploy" },
};

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const config = eventConfig[notification.event_type];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <div className={cn("mt-0.5", config.color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-[10px]">
            {notification.project_name}
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            {config.label}
          </Badge>
          <span className="text-[10px] text-muted-foreground ml-auto">
            {new Date(notification.created_at).toLocaleString("ko-KR", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="text-sm">{notification.message}</p>
      </div>
    </div>
  );
}
