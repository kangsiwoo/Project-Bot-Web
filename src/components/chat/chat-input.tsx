"use client";

// 채팅 입력 바

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore } from "@/stores/chat-store";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  onSend: (content: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const isConnected = useChatStore((s) => s.isConnected);
  const isLoading = useChatStore((s) => s.isLoading);
  const streamingMessageId = useChatStore((s) => s.streamingMessageId);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || !isConnected || isLoading) return;

    onSend(trimmed);
    setValue("");
  }, [value, isConnected, isLoading, onSend]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="sticky bottom-0 border-t bg-background p-4">
      <div className="flex items-end gap-2">
        <Textarea
          placeholder={
            isConnected
              ? "Claude Code에 명령 보내기..."
              : "연결 중..."
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isConnected || isLoading}
          className="min-h-[44px] max-h-32 resize-none"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={!value.trim() || !isConnected || isLoading}
          size="icon"
          className="shrink-0 bg-indigo-600 hover:bg-indigo-700"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
      {!isConnected && (
        <p className="mt-1 text-xs text-amber-600">
          WebSocket 연결이 끊어졌습니다. 재연결 시도 중...
        </p>
      )}
      {streamingMessageId && isConnected && (
        <p className="mt-1 text-xs text-indigo-500 animate-pulse">
          ⚡ Claude Code 작업 중...
        </p>
      )}
      {isLoading && !streamingMessageId && isConnected && (
        <p className="mt-1 text-xs text-muted-foreground animate-pulse">
          ⏳ 응답 대기 중...
        </p>
      )}
    </div>
  );
}
