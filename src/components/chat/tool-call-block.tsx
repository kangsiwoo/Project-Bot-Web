"use client";

// MCP 도구 호출 표시 블록 - Claude Code CLI 스타일

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ToolCall } from "@/types";
import {
  FileText,
  Search,
  Terminal,
  Pencil,
  Globe,
  ChevronDown,
  ChevronRight,
  Check,
} from "lucide-react";
import { useState } from "react";

// 도구 이름에 따른 카테고리 + 아이콘 매핑
function getToolMeta(name: string): { icon: typeof Terminal; category: string; label: string } {
  const lower = name.toLowerCase();
  if (lower.includes("read"))
    return { icon: FileText, category: "Read", label: getArgHint(name) };
  if (lower.includes("write"))
    return { icon: Pencil, category: "Write", label: getArgHint(name) };
  if (lower.includes("edit"))
    return { icon: Pencil, category: "Edit", label: getArgHint(name) };
  if (lower.includes("search") || lower.includes("grep"))
    return { icon: Search, category: "Search", label: name };
  if (lower.includes("bash"))
    return { icon: Terminal, category: "Bash", label: name };
  if (lower.includes("web") || lower.includes("fetch"))
    return { icon: Globe, category: "Web", label: name };
  // MCP 도구
  return { icon: Terminal, category: "mcp", label: name };
}

function getArgHint(name: string): string {
  return name;
}

// 도구 호출의 표시 라벨 생성
function getDisplayLabel(toolCall: ToolCall): string {
  const meta = getToolMeta(toolCall.name);
  const args = toolCall.arguments;

  // 파일 경로가 있으면 파일명만 표시
  if (args) {
    const filePath =
      (args.file_path as string) ||
      (args.path as string) ||
      (args.filename as string);
    if (filePath) {
      const parts = filePath.split("/");
      return `${meta.category}: ${parts[parts.length - 1]}`;
    }
    const command = args.command as string;
    if (command) {
      const shortCmd = command.length > 40 ? command.slice(0, 40) + "..." : command;
      return `${meta.category}: ${shortCmd}`;
    }
  }

  return `${meta.category}: ${toolCall.name}`;
}

interface ToolCallBlockProps {
  toolCall: ToolCall;
}

export function ToolCallBlock({ toolCall }: ToolCallBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const meta = getToolMeta(toolCall.name);
  const Icon = meta.icon;
  const displayLabel = getDisplayLabel(toolCall);

  return (
    <div className="my-1 rounded-lg border border-border/60 bg-[#1E1E2E]/[0.03] dark:bg-[#1E1E2E]/40 font-mono text-xs">
      {/* 도구 호출 헤더 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-3 py-1.5 hover:bg-muted/40 transition-colors rounded-lg"
      >
        {expanded ? (
          <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
        )}
        <Check className="h-3 w-3 text-green-600 dark:text-green-400 shrink-0" />
        <Icon className="h-3 w-3 text-indigo-500 shrink-0" />
        <span className="text-indigo-600 dark:text-indigo-400 truncate text-left">
          {displayLabel}
        </span>
        {toolCall.duration_ms != null && (
          <Badge variant="outline" className="ml-auto shrink-0 text-[10px] font-normal py-0 h-4">
            {toolCall.duration_ms >= 1000
              ? `${(toolCall.duration_ms / 1000).toFixed(1)}s`
              : `${toolCall.duration_ms}ms`}
          </Badge>
        )}
      </button>

      {/* 확장된 내용: 인자 + 결과 */}
      {expanded && (
        <div className="border-t border-border/40 px-3 py-2 space-y-2">
          {/* 인자 */}
          {toolCall.arguments && Object.keys(toolCall.arguments).length > 0 && (
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Arguments
              </span>
              <pre className="mt-1 overflow-x-auto whitespace-pre-wrap text-[11px] text-foreground/80 rounded bg-[#1E1E2E] dark:bg-[#1E1E2E] text-zinc-300 p-2">
                {JSON.stringify(toolCall.arguments, null, 2)}
              </pre>
            </div>
          )}

          {/* 결과 */}
          {toolCall.result && (
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Result
              </span>
              <pre
                className={cn(
                  "mt-1 max-h-48 overflow-auto whitespace-pre-wrap text-[11px]",
                  "rounded bg-[#1E1E2E] dark:bg-[#1E1E2E] text-zinc-300 p-2"
                )}
              >
                {toolCall.result}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
