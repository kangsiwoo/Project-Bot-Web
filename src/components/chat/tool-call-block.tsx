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
} from "lucide-react";
import { useState } from "react";

// 도구 이름에 따른 아이콘 매핑
function getToolIcon(name: string) {
  if (name.includes("read") || name.includes("Read")) return FileText;
  if (name.includes("search") || name.includes("grep") || name.includes("Grep"))
    return Search;
  if (name.includes("edit") || name.includes("Edit") || name.includes("write"))
    return Pencil;
  if (name.includes("bash") || name.includes("Bash")) return Terminal;
  if (name.includes("web") || name.includes("fetch")) return Globe;
  return Terminal;
}

interface ToolCallBlockProps {
  toolCall: ToolCall;
}

export function ToolCallBlock({ toolCall }: ToolCallBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = getToolIcon(toolCall.name);

  return (
    <div className="my-2 rounded-lg border bg-muted/40 font-mono text-xs">
      {/* 도구 호출 헤더 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-3 py-2 hover:bg-muted/60 transition-colors"
      >
        {expanded ? (
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        )}
        <Icon className="h-3.5 w-3.5 text-indigo-500" />
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          {toolCall.name}
        </span>
        {toolCall.duration_ms && (
          <Badge variant="outline" className="ml-auto text-[10px] font-normal">
            {toolCall.duration_ms}ms
          </Badge>
        )}
      </button>

      {/* 확장된 내용: 인자 + 결과 */}
      {expanded && (
        <div className="border-t px-3 py-2 space-y-2">
          {/* 인자 */}
          <div>
            <span className="text-muted-foreground">Arguments:</span>
            <pre className="mt-1 overflow-x-auto whitespace-pre-wrap text-[11px] text-foreground/80">
              {JSON.stringify(toolCall.arguments, null, 2)}
            </pre>
          </div>

          {/* 결과 */}
          {toolCall.result && (
            <div>
              <span className="text-muted-foreground">Result:</span>
              <pre
                className={cn(
                  "mt-1 max-h-48 overflow-auto whitespace-pre-wrap text-[11px]",
                  "rounded bg-background p-2"
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
