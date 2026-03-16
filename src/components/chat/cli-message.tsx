"use client";

// Claude Code CLI 응답 메시지 - 텍스트 + 도구 호출 표시

import { cn } from "@/lib/utils";
import { ToolCallBlock } from "./tool-call-block";
import type { ChatMessage } from "@/types";
import { Bot, User } from "lucide-react";

interface CliMessageProps {
  message: ChatMessage;
}

export function CliMessage({ message }: CliMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn("flex gap-3 px-4 py-3", isAssistant && "bg-muted/30")}
    >
      {/* 아바타 */}
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
          isAssistant
            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        )}
      >
        {isAssistant ? (
          <Bot className="h-4 w-4" />
        ) : (
          <User className="h-4 w-4" />
        )}
      </div>

      {/* 메시지 본문 */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">
            {isAssistant ? "Claude Code" : "You"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* 도구 호출 블록 */}
        {message.tool_calls?.map((tc) => (
          <ToolCallBlock key={tc.id} toolCall={tc} />
        ))}

        {/* 텍스트 응답 */}
        {message.content && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
