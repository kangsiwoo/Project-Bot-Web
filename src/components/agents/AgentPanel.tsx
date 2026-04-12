"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, X } from "lucide-react";
import { useAgents } from "@/hooks/use-agents";
import { useAgentStore } from "@/stores/agent-store";
import { AgentCard } from "./AgentCard";
import { AgentModal } from "./AgentModal";

interface AgentPanelProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  isOwner?: boolean;
}

export function AgentPanel({
  projectId,
  isOpen,
  onClose,
  isOwner = false,
}: AgentPanelProps) {
  const { data: agents, isLoading } = useAgents(projectId);
  const selectedAgentId = useAgentStore((s) => s.selectedAgentId);
  const setSelectedAgentId = useAgentStore((s) => s.setSelectedAgentId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | undefined>();

  if (!isOpen) return null;

  const handleAgentClick = (agentId: string) => {
    setEditingAgentId(agentId);
    setSelectedAgentId(agentId);
    setModalOpen(true);
  };

  const handleAddAgent = () => {
    setEditingAgentId(undefined);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingAgentId(undefined);
  };

  return (
    <>
      <div className="flex h-full w-64 flex-col border-l bg-muted/30 dark:bg-muted/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-3 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            에이전트
          </span>
          <div className="flex items-center gap-1">
            {isOwner && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleAddAgent}
                title="새 에이전트 추가"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onClose}
              title="패널 닫기"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Agent List */}
        <ScrollArea className="flex-1">
          <div className="py-1">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}

            {!isLoading && (!agents || agents.length === 0) && (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                <p>에이전트가 없습니다</p>
                {isOwner && (
                  <button
                    onClick={handleAddAgent}
                    className="mt-2 text-primary hover:underline text-xs"
                  >
                    + 에이전트 추가
                  </button>
                )}
              </div>
            )}

            {agents?.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isSelected={selectedAgentId === agent.id}
                onClick={() => handleAgentClick(agent.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      <AgentModal
        projectId={projectId}
        agentId={editingAgentId}
        isOpen={modalOpen}
        onClose={handleModalClose}
      />
    </>
  );
}
