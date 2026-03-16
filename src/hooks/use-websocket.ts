"use client";

// WebSocket 훅 - Claude Code Remote 채팅 연결

import { useEffect, useRef, useCallback } from "react";
import { getAccessToken } from "@/lib/auth";
import { useChatStore } from "@/stores/chat-store";
import type { ChatMessage } from "@/types";

const WS_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, "ws") || "ws://localhost:8080";

export function useWebSocket(projectId: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const addMessage = useChatStore((s) => s.addMessage);
  const setConnected = useChatStore((s) => s.setConnected);
  const setLoading = useChatStore((s) => s.setLoading);

  const connect = useCallback(() => {
    const token = getAccessToken();
    if (!token || !projectId) return;

    const ws = new WebSocket(`${WS_BASE}/ws/chat/${projectId}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ChatMessage;
        addMessage(data);
        setLoading(false);
      } catch {
        // 파싱 실패 시 무시
      }
    };

    ws.onclose = () => {
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
      setLoading(true);
      wsRef.current.send(JSON.stringify({ content }));
    }
  }, [setLoading]);

  return { sendMessage };
}
