"use client";

// Claude Code Remote 채팅 페이지

import { use, useEffect, useMemo } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useChatStore } from "@/stores/chat-store";
import { useAgentStore } from "@/stores/agent-store";
import { useProject } from "@/hooks/use-projects";
import { useAuthStore } from "@/stores/auth-store";
import { useChannels, useChannelMessages, useLoadMoreMessages } from "@/hooks/use-channels";
import { useModels } from "@/hooks/use-models";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { ChannelSidebar } from "@/components/chat/channel-sidebar";
import { AgentPanel } from "@/components/agents/AgentPanel";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ModelSelector } from "@/components/chat/model-selector";
import { FALLBACK_PROVIDERS } from "@/lib/llm-providers";
import { Users } from "lucide-react";
import type { LLMProvider } from "@/lib/llm-providers";

export default function ChatPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const { data: project } = useProject(projectId);
  const { data: channels } = useChannels(projectId);
  const { data: modelsData } = useModels();
  const user = useAuthStore((s) => s.user);
  const isOwner = project?.owner_id === user?.id;
  const selectedChannelId = useChatStore((s) => s.selectedChannelId);
  const setSelectedChannelId = useChatStore((s) => s.setSelectedChannelId);
  const isAgentPanelOpen = useAgentStore((s) => s.isAgentPanelOpen);
  const toggleAgentPanel = useAgentStore((s) => s.toggleAgentPanel);
  const setAgentPanelOpen = useAgentStore((s) => s.setAgentPanelOpen);
  const { data: history } = useChannelMessages(projectId, selectedChannelId ?? "");
  const { sendMessage } = useWebSocket(projectId, selectedChannelId);
  const isConnected = useChatStore((s) => s.isConnected);
  const clearMessages = useChatStore((s) => s.clearMessages);
  const addMessage = useChatStore((s) => s.addMessage);
  const messages = useChatStore((s) => s.messages);
  const prependMessages = useChatStore((s) => s.prependMessages);
  const setHasMoreMessages = useChatStore((s) => s.setHasMoreMessages);
  const selectedProvider = useChatStore((s) => s.selectedProvider);
  const selectedModel = useChatStore((s) => s.selectedModel);
  const setProvider = useChatStore((s) => s.setProvider);
  const setModel = useChatStore((s) => s.setModel);

  const loadMore = useLoadMoreMessages(projectId, selectedChannelId ?? "");
  const hasMore = history?.has_more ?? false;

  // Convert API response to Record<string, LLMProvider> format, fallback if unavailable
  const providers = useMemo<Record<string, LLMProvider>>(() => {
    if (!modelsData || modelsData.length === 0) return FALLBACK_PROVIDERS;
    const map: Record<string, LLMProvider> = {};
    for (const item of modelsData) {
      map[item.key] = {
        name: item.name,
        icon: item.icon,
        description: item.description,
        models: item.models,
      };
    }
    return map;
  }, [modelsData]);

  const currentProvider = providers[selectedProvider] ?? FALLBACK_PROVIDERS["claude_code"];

  // Auto-select first channel (prefer console) when channels load
  useEffect(() => {
    if (channels && channels.length > 0 && !selectedChannelId) {
      const consoleChannel = channels.find((ch) => ch.is_console);
      setSelectedChannelId(consoleChannel?.id ?? channels[0].id);
    }
  }, [channels, selectedChannelId, setSelectedChannelId]);

  // Load history when channel changes
  useEffect(() => {
    clearMessages();
    if (history && history.messages && history.messages.length > 0) {
      for (const msg of history.messages) {
        addMessage({
          id: String(msg.id),
          role: msg.role as "user" | "assistant",
          content: msg.content,
          timestamp: msg.created_at,
        });
      }
      setHasMoreMessages(history.has_more);
    }
  }, [selectedChannelId, history, clearMessages, addMessage, setHasMoreMessages]);

  // 페이지 전환 시 메시지 초기화 및 채널 선택 리셋
  useEffect(() => {
    return () => {
      clearMessages();
      setSelectedChannelId(null);
      setAgentPanelOpen(false);
    };
  }, [projectId, clearMessages, setSelectedChannelId, setAgentPanelOpen]);

  // Prepend older messages when loadMore succeeds
  useEffect(() => {
    if (loadMore.isSuccess && loadMore.data) {
      const chatMessages = loadMore.data.messages.map((msg) => ({
        id: String(msg.id),
        role: msg.role as "user" | "assistant",
        content: msg.content,
        timestamp: msg.created_at,
      }));
      prependMessages(chatMessages);
      setHasMoreMessages(loadMore.data.has_more);
    }
  }, [loadMore.isSuccess, loadMore.data, prependMessages, setHasMoreMessages]);

  const handleLoadMore = () => {
    if (messages.length > 0 && !loadMore.isPending) {
      loadMore.mutate(messages[0].id);
    }
  };

  const handleSelectChannel = (channelId: string) => {
    if (channelId !== selectedChannelId) {
      setSelectedChannelId(channelId);
    }
  };

  return (
    <div className="flex h-full">
      {/* Channel Sidebar */}
      <ChannelSidebar
        projectId={projectId}
        selectedChannelId={selectedChannelId}
        onSelectChannel={handleSelectChannel}
      />

      {/* Chat Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* 헤더 */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono text-xs font-bold">
            {currentProvider.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold">
                {project?.name ?? "Chat"}
              </h2>

              {/* 프로바이더 & 모델 선택 */}
              <ModelSelector
                providers={providers}
                selectedProvider={selectedProvider}
                selectedModel={selectedModel}
                onProviderChange={setProvider}
                onModelChange={setModel}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {currentProvider.description}
            </p>
          </div>
          <Badge
            variant={isConnected ? "default" : "secondary"}
            className={
              isConnected
                ? "ml-auto bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                : "ml-auto"
            }
          >
            <span
              className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${
                isConnected ? "bg-green-500" : "bg-zinc-400"
              }`}
            />
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>

          {/* 에이전트 패널 토글 버튼 */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleAgentPanel}
            title="에이전트 패널"
            className={isAgentPanelOpen ? "bg-accent text-accent-foreground" : ""}
          >
            <Users className="h-4 w-4" />
          </Button>
        </div>

        <Separator />

        {/* 메시지 영역 */}
        <ChatMessages
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoadingMore={loadMore.isPending}
        />

        {/* 입력 바 */}
        <ChatInput onSend={sendMessage} />
      </div>

      {/* Agent Panel (오른쪽 사이드바) */}
      <AgentPanel
        projectId={projectId}
        isOpen={isAgentPanelOpen}
        onClose={() => setAgentPanelOpen(false)}
        isOwner={isOwner}
      />
    </div>
  );
}
