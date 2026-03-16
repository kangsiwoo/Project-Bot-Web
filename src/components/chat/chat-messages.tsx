"use client";

// 채팅 메시지 목록 - 자동 스크롤

import { useEffect, useRef } from "react";
import { useChatStore } from "@/stores/chat-store";
import { CliMessage } from "./cli-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

export function ChatMessages() {
  const messages = useChatStore((s) => s.messages);
  const isLoading = useChatStore((s) => s.isLoading);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 새 메시지 도착 시 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1">
      <div className="divide-y">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-sm">Claude Code와 대화를 시작하세요.</p>
            <p className="text-xs mt-1">
              프로젝트에 대해 질문하거나 작업을 요청할 수 있습니다.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <CliMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/30">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
            <span className="text-xs text-muted-foreground">
              Claude Code 처리 중...
            </span>
          </div>
        )}
      </div>
      <div ref={bottomRef} />
    </ScrollArea>
  );
}
