"use client";

// 채팅 메시지 목록 - 자동 스크롤

import { useEffect, useRef, useCallback } from "react";
import { useChatStore } from "@/stores/chat-store";
import { LLM_PROVIDERS } from "@/lib/llm-providers";
import { CliMessage } from "./cli-message";
import { Loader2, Terminal, Zap, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessagesProps {
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export function ChatMessages({ onLoadMore, hasMore, isLoadingMore }: ChatMessagesProps) {
  const messages = useChatStore((s) => s.messages);
  const isLoading = useChatStore((s) => s.isLoading);
  const selectedProvider = useChatStore((s) => s.selectedProvider);
  const streamingContent = useChatStore((s) => s.streamingContent);
  const streamingMessageId = useChatStore((s) => s.streamingMessageId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const isLoadingMoreRef = useRef(false);

  const provider = LLM_PROVIDERS[selectedProvider];

  const LoadingIcon =
    selectedProvider === "claude_code"
      ? Terminal
      : selectedProvider === "anthropic"
        ? Zap
        : Cpu;

  const iconBgClass =
    selectedProvider === "claude_code"
      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
      : selectedProvider === "anthropic"
        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";

  const emptyIconBgClass =
    selectedProvider === "claude_code"
      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
      : selectedProvider === "anthropic"
        ? "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
        : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400";

  const spinnerColor =
    selectedProvider === "claude_code"
      ? "text-indigo-500"
      : selectedProvider === "anthropic"
        ? "text-amber-500"
        : "text-emerald-500";

  // Maintain scroll position after prepending older messages
  useEffect(() => {
    if (isLoadingMoreRef.current && scrollContainerRef.current) {
      const newScrollHeight = scrollContainerRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
      scrollContainerRef.current.scrollTop = scrollDiff;
      isLoadingMoreRef.current = false;
    }
  }, [messages]);

  // Save scroll height before loading more and trigger load
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !onLoadMore || !hasMore || isLoadingMore) return;

    if (container.scrollTop < 50) {
      prevScrollHeightRef.current = container.scrollHeight;
      isLoadingMoreRef.current = true;
      onLoadMore();
    }
  }, [onLoadMore, hasMore, isLoadingMore]);

  // Attach scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // 새 메시지 또는 스트리밍 콘텐츠 도착 시 자동 스크롤 (only when not loading older)
  useEffect(() => {
    if (!isLoadingMoreRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, streamingContent]);

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
      <div className="divide-y">
        {/* Loading spinner for older messages */}
        {isLoadingMore && (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="ml-2 text-xs text-muted-foreground">Loading older messages...</span>
          </div>
        )}

        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl font-mono text-base font-bold mb-4",
                emptyIconBgClass
              )}
            >
              {provider.icon}
            </div>
            <p className="text-sm font-medium">
              {provider.name}와 대화를 시작하세요.
            </p>
            <p className="text-xs mt-1">
              프로젝트에 대해 질문하거나 작업을 요청할 수 있습니다.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <CliMessage key={msg.id} message={msg} />
        ))}

        {/* 스트리밍 메시지 표시 */}
        {streamingMessageId && streamingContent && (
          <CliMessage
            key={streamingMessageId}
            message={{
              id: streamingMessageId,
              role: "assistant",
              content: streamingContent,
              timestamp: new Date().toISOString(),
            }}
          />
        )}

        {/* 작업 중 인디케이터 */}
        {isLoading && !streamingMessageId && (
          <div className="flex items-center gap-3 px-4 py-3 bg-muted/30">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                iconBgClass
              )}
            >
              <LoadingIcon className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className={cn("h-3.5 w-3.5 animate-spin", spinnerColor)} />
              <span className="text-xs text-muted-foreground">
                {provider.name}가 작업 중...
              </span>
            </div>
          </div>
        )}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
