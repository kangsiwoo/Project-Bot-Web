"use client";

// WebSocket 훅 - Claude Code Remote 채팅 연결

import { useEffect, useRef, useCallback } from "react";
import { getAccessToken } from "@/lib/auth";
import { useChatStore } from "@/stores/chat-store";
import type { ChatMessage } from "@/types";

const WS_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, "ws") || "ws://localhost:8080";

function generateWsRid(): string {
  return "ws-" + Math.random().toString(36).substring(2, 8);
}

export function useWebSocket(projectId: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const ridRef = useRef<string>("");
  const addMessage = useChatStore((s) => s.addMessage);
  const setConnected = useChatStore((s) => s.setConnected);
  const setLoading = useChatStore((s) => s.setLoading);

  const connect = useCallback(() => {
    const token = getAccessToken();
    if (!token || !projectId) return;

    const wsUrl = `${WS_BASE}/ws/chat/${projectId}?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ridRef.current = generateWsRid();
    const rid = ridRef.current;

    ws.onopen = () => {
      console.log(`[${rid}] ${new Date().toISOString()} CONNECT ${wsUrl.replace(/token=.*/, "token=***")}`);
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(`[${rid}] ${new Date().toISOString()} RECV`, data);

        // 서버가 { type: "message", messages: [...] } 형식으로 전송
        if (data.type === "message" && Array.isArray(data.messages)) {
          for (const msg of data.messages) {
            const chatMsg: ChatMessage = {
              id: msg.id,
              role: msg.role,
              content: msg.content ?? "",
              timestamp: msg.timestamp ?? new Date().toISOString(),
              tool_calls: msg.tool_calls,
            };
            addMessage(chatMsg);
          }
        } else if (data.id && data.role) {
          // 단일 ChatMessage 형태 (폴백)
          const chatMsg: ChatMessage = {
            id: data.id,
            role: data.role,
            content: data.content ?? "",
            timestamp: data.timestamp ?? data.created_at ?? new Date().toISOString(),
            tool_calls: data.tool_calls,
          };
          addMessage(chatMsg);
        }
        setLoading(false);
      } catch {
        // 파싱 실패 시 무시
      }
    };

    ws.onclose = () => {
      console.log(`[${rid}] ${new Date().toISOString()} DISCONNECT`);
      setConnected(false);
      // 3초 후 재연결 시도
      setTimeout(() => connect(), 3000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [projectId, addMessage, setConnected, setLoading]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const { selectedProvider, selectedModel } = useChatStore.getState();

      // 유저 메시지를 즉시 store에 추가 (optimistic update)
      addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      });

      setLoading(true);
      const payload = JSON.stringify({
        content,
        provider: selectedProvider,
        model: selectedModel,
      });
      console.log(`[${ridRef.current}] ${new Date().toISOString()} SEND ${payload}`);
      wsRef.current.send(payload);
    }
  }, [addMessage, setLoading]);

  return { sendMessage };
}
