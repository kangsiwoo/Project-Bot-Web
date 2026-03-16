"use client";

// Claude Code Remote 채팅 페이지

import { use, useEffect } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useChatStore } from "@/stores/chat-store";
import { useProject } from "@/hooks/use-projects";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, Loader2 } from "lucide-react";

export default function ChatPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const { sendMessage } = useWebSocket(projectId);
  const { data: project } = useProject(projectId);
  const isConnected = useChatStore((s) => s.isConnected);
  const clearMessages = useChatStore((s) => s.clearMessages);

  // 페이지 전환 시 메시지 초기화
  useEffect(() => {
    return () => clearMessages();
  }, [projectId, clearMessages]);

  return (
    <div className="flex h-full flex-col">
      {/* 헤더 */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Bot className="h-5 w-5 text-indigo-600" />
        <div>
          <h2 className="text-sm font-semibold">
            {project?.name ?? "Chat"}
          </h2>
          <p className="text-xs text-muted-foreground">
            Claude Code Remote Session
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
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
      </div>

      <Separator />

      {/* 메시지 영역 */}
      <ChatMessages />

      {/* 입력 바 */}
      <ChatInput onSend={sendMessage} />
    </div>
  );
}
