"use client";

// 채팅 메시지 목록 - 자동 스크롤

import { useEffect, useRef } from "react";
import { useChatStore } from "@/stores/chat-store";
import { LLM_PROVIDERS } from "@/lib/llm-providers";
import { CliMessage } from "./cli-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Terminal, Zap, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatMessages() {
  const messages = useChatStore((s) => s.messages);
  const isLoading = useChatStore((s) => s.isLoading);
  const selectedProvider = useChatStore((s) => s.selectedProvider);
  const bottomRef = useRef<HTMLDivElement>(null);

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

  // 새 메시지 도착 시 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1">
      <div className="divide-y">
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

        {/* 작업 중 인디케이터 */}
        {isLoading && (
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
    </ScrollArea>
  );
}
