"use client";

// 채팅 메시지 - 프로바이더별 다른 스타일 표시

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ToolCallBlock } from "./tool-call-block";
import { useChatStore } from "@/stores/chat-store";
import { FALLBACK_PROVIDERS } from "@/lib/llm-providers";
import type { ChatMessage } from "@/types";
import { Terminal, User, Cpu, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "--:--";
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

interface CliMessageProps {
  message: ChatMessage;
}

export function CliMessage({ message }: CliMessageProps) {
  const isAssistant = message.role === "assistant";
  const selectedProvider = useChatStore((s) => s.selectedProvider);
  const selectedModel = useChatStore((s) => s.selectedModel);
  const provider = FALLBACK_PROVIDERS[selectedProvider];

  // 도구 호출의 총 실행 시간 계산
  const totalDuration = message.tool_calls?.reduce(
    (sum, tc) => sum + (tc.duration_ms ?? 0),
    0
  );

  if (!isAssistant) {
    // 사용자 메시지: 왼쪽 정렬, 어시스턴트와 동일한 레이아웃
    return (
      <div className="flex gap-3 px-4 py-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          <User className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">You</span>
            <span className="text-[10px] text-muted-foreground ml-auto">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-sm leading-relaxed mb-0">
              {message.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 프로바이더별 아이콘 선택
  const ProviderIcon =
    selectedProvider === "claude_code"
      ? Terminal
      : selectedProvider === "anthropic"
        ? Zap
        : Cpu;

  // 프로바이더별 색상 테마
  const iconColorClass =
    selectedProvider === "claude_code"
      ? "text-indigo-500"
      : selectedProvider === "anthropic"
        ? "text-amber-500"
        : "text-emerald-500";

  const avatarBgClass =
    selectedProvider === "claude_code"
      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
      : selectedProvider === "anthropic"
        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";

  // Claude Code: 도구 호출 + 터미널 스타일
  // Anthropic/OpenAI: 일반 채팅 버블 + API 아이콘
  const isCli = selectedProvider === "claude_code";

  return (
    <div className={cn("flex gap-3 px-4 py-3", isCli ? "bg-muted/30" : "bg-muted/20")}>
      {/* 프로바이더 아이콘 아바타 */}
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-[10px] font-bold",
          avatarBgClass
        )}
      >
        {provider.icon}
      </div>

      {/* 메시지 본문 */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* 헤더: 프로바이더명 + 모델 배지 + 실행 시간 */}
        <div className="flex items-center gap-2">
          <ProviderIcon className={cn("h-3.5 w-3.5", iconColorClass)} />
          <span className="text-xs font-semibold text-foreground">
            {provider.name}
          </span>
          <Badge variant="outline" className="font-mono text-[10px] py-0 h-4">
            {selectedModel}
          </Badge>
          {isCli && totalDuration != null && totalDuration > 0 && (
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

        {/* 도구 호출 블록 (CLI 프로바이더만 표시) */}
        {isCli && message.tool_calls && message.tool_calls.length > 0 && (
          <div className="space-y-1">
            {message.tool_calls.map((tc) => (
              <ToolCallBlock key={tc.id} toolCall={tc} />
            ))}
          </div>
        )}

        {/* 텍스트 응답 (마크다운 렌더링) */}
        {message.content && (
          <div className={cn(
            "prose prose-sm dark:prose-invert max-w-none",
            !isCli && "rounded-2xl rounded-tl-sm bg-background border px-4 py-2.5"
          )}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" className="rounded-md my-2 text-sm">
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>
                  );
                },
                p({ children }) {
                  return <p className="mb-2 last:mb-0">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="list-disc pl-4 mb-2">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-4 mb-2">{children}</ol>;
                },
                h1({ children }) {
                  return <h1 className="text-lg font-bold mb-2">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-base font-bold mb-2">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-sm font-bold mb-1">{children}</h3>;
                },
                blockquote({ children }) {
                  return <blockquote className="border-l-2 border-muted-foreground/30 pl-3 italic">{children}</blockquote>;
                },
                table({ children }) {
                  return <div className="overflow-x-auto my-2"><table className="min-w-full text-sm border-collapse">{children}</table></div>;
                },
                th({ children }) {
                  return <th className="border-b font-medium px-2 py-1 text-left">{children}</th>;
                },
                td({ children }) {
                  return <td className="border-b px-2 py-1">{children}</td>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
