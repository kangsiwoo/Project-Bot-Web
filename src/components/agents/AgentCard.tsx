"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { AgentAvatar } from "./AgentAvatar";
import { useAgentStore } from "@/stores/agent-store";
import type { Agent } from "@/types";

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onClick: () => void;
}

export function AgentCard({ agent, isSelected, onClick }: AgentCardProps) {
  const status = useAgentStore((s) => s.agentStatuses[agent.id]);
  const isResponding = status === "responding";

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isSelected ? "bg-accent text-accent-foreground" : "text-foreground",
        !agent.is_active && "opacity-50"
      )}
    >
      <AgentAvatar name={agent.name} color={agent.avatar_color} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium truncate">{agent.name}</span>
          {!agent.is_active && (
            <span className="text-[10px] text-muted-foreground">(inactive)</span>
          )}
        </div>
        {agent.role_description && (
          <p className="text-[11px] text-muted-foreground truncate leading-tight">
            {agent.role_description}
          </p>
        )}
      </div>
      {isResponding ? (
        <Loader2 className="h-3 w-3 animate-spin text-indigo-500 shrink-0" />
      ) : (
        agent.assigned_channel_count > 0 && (
          <Badge variant="secondary" className="text-[10px] h-4 px-1.5 shrink-0">
            {agent.assigned_channel_count}
          </Badge>
        )
      )}
    </button>
  );
}
