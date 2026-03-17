"use client";

// Claude Code CLI 응답 메시지 - 텍스트 + 도구 호출 표시

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ToolCallBlock } from "./tool-call-block";
import type { ChatMessage } from "@/types";
import { Terminal, User } from "lucide-react";

interface CliMessageProps {
  message: ChatMessage;
}

export function CliMessage({ message }: CliMessageProps) {
  const isAssistant = message.role === "assistant";

  // 도구 호출의 총 실행 시간 계산
  const totalDuration = message.tool_calls?.reduce(
    (sum, tc) => sum + (tc.duration_ms ?? 0),
    0
  );

  if (!isAssistant) {
    // 사용자 메시지: 오른쪽 정렬, indigo 버블
    return (
      <div className="flex justify-end px-4 py-3">
        <div className="flex items-start gap-3 max-w-[80%]">
          <div className="rounded-2xl rounded-tr-sm bg-indigo-600 px-4 py-2.5 text-white">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </p>
            <span className="block text-right text-[10px] text-indigo-200 mt-1">
              {new Date(message.timestamp).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    );
  }

  // 어시스턴트 메시지: 왼쪽 정렬, 카드 스타일
  return (
    <div className="flex gap-3 px-4 py-3 bg-muted/30">
      {/* 터미널 아이콘 아바타 */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono text-[10px] font-bold">
        {">_"}
      </div>

      {/* 메시지 본문 */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* 헤더: Claude Code CLI + 모델 배지 + 실행 시간 */}
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-indigo-500" />
          <span className="text-xs font-semibold text-foreground">
            Claude Code CLI
          </span>
          <Badge variant="outline" className="font-mono text-[10px] py-0 h-4">
            sonnet
          </Badge>
          {totalDuration != null && totalDuration > 0 && (
            <span className="text-[10px] text-muted-foreground font-mono">
              {totalDuration >= 1000
                ? `${(totalDuration / 1000).toFixed(1)}s`
                : `${totalDuration}ms`}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground ml-auto">
            {new Date(message.timestamp).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* 도구 호출 블록 */}
        {message.tool_calls && message.tool_calls.length > 0 && (
          <div className="space-y-1">
            {message.tool_calls.map((tc) => (
              <ToolCallBlock key={tc.id} toolCall={tc} />
            ))}
          </div>
        )}

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
