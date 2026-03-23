"use client";

// Claude Code Remote 채팅 페이지

import { use, useEffect } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useChatStore } from "@/stores/chat-store";
import { useProject } from "@/hooks/use-projects";
import { useChannels, useChannelMessages, useLoadMoreMessages } from "@/hooks/use-channels";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { ChannelSidebar } from "@/components/chat/channel-sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { LLM_PROVIDERS, PROVIDER_IDS } from "@/lib/llm-providers";
import type { ProviderId } from "@/lib/llm-providers";
import { ChevronDown } from "lucide-react";

export default function ChatPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const { data: project } = useProject(projectId);
  const { data: channels } = useChannels(projectId);
  const selectedChannelId = useChatStore((s) => s.selectedChannelId);
  const setSelectedChannelId = useChatStore((s) => s.setSelectedChannelId);
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

  const currentProvider = LLM_PROVIDERS[selectedProvider];

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
      // history는 최신순이므로 reverse해서 오래된 순으로 추가
      const sorted = [...history.messages].reverse();
      for (const msg of sorted) {
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
    };
  }, [projectId, clearMessages, setSelectedChannelId]);

  // Prepend older messages when loadMore succeeds
  useEffect(() => {
    if (loadMore.isSuccess && loadMore.data) {
      const sorted = [...loadMore.data.messages].reverse();
      const chatMessages = sorted.map((msg) => ({
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
      <div className="flex flex-1 flex-col">
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

            {/* 프로바이더 선택 드롭다운 */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-mono font-medium hover:bg-accent transition-colors cursor-pointer">
                {currentProvider.icon} {currentProvider.name}
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={4}>
                <DropdownMenuLabel>LLM Provider</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {PROVIDER_IDS.map((id) => {
                  const provider = LLM_PROVIDERS[id];
                  return (
                    <DropdownMenuItem
                      key={id}
                      className={selectedProvider === id ? "bg-accent" : ""}
                      onClick={() => setProvider(id)}
                    >
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-muted font-mono text-[10px] font-bold shrink-0">
                        {provider.icon}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm">{provider.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {provider.description}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 모델 선택 드롭다운 */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-mono font-medium hover:bg-accent transition-colors cursor-pointer">
                {selectedModel}
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={4}>
                <DropdownMenuLabel>Model</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {currentProvider.models.map((model) => (
                  <DropdownMenuItem
                    key={model}
                    className={selectedModel === model ? "bg-accent" : ""}
                    onClick={() => setModel(model)}
                  >
                    <span className="font-mono text-xs">{model}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
    </div>
  );
}
