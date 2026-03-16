"use client";

// 알림 필터 칩 컴포넌트

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NotificationEventType } from "@/types";

const eventTypes: { value: NotificationEventType | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "plan", label: "Plan" },
  { value: "question", label: "Question" },
  { value: "complete", label: "Complete" },
  { value: "error", label: "Error" },
  { value: "build", label: "Build" },
  { value: "test", label: "Test" },
  { value: "deploy", label: "Deploy" },
];

interface NotificationFilterProps {
  selected: NotificationEventType | "all";
  onChange: (value: NotificationEventType | "all") => void;
}

export function NotificationFilter({
  selected,
  onChange,
}: NotificationFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {eventTypes.map((type) => (
        <Badge
          key={type.value}
          variant={selected === type.value ? "default" : "outline"}
          className={cn(
            "cursor-pointer transition-colors",
            selected === type.value &&
              "bg-indigo-600 hover:bg-indigo-700 text-white"
          )}
          onClick={() => onChange(type.value)}
        >
          {type.label}
        </Badge>
      ))}
    </div>
  );
}
