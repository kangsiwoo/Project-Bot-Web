"use client";

import { cn } from "@/lib/utils";

interface AgentAvatarProps {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
};

export function AgentAvatar({ name, color, size = "md" }: AgentAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "A";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        sizeClasses[size]
      )}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initial}
    </div>
  );
}
