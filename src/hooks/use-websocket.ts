"use client";

// WebSocket 훅 - Claude Code Remote 채팅 연결

import { useEffect, useRef, useCallback } from "react";
import { getAccessToken } from "@/lib/auth";
import { useChatStore } from "@/stores/chat-store";
import { useAgentStore } from "@/stores/agent-store";
import type { ChatMessage, Agent } from "@/types";

// 브라우저에서 현재 호스트 기반으로 WS URL 생성 (project-bot-web → project-bot)
function getWsBase(): string {
  if (typeof window === "undefined") return "ws://localhost:8080";
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host.replace("project-bot-web", "project-bot");
  return `${proto}//${host}`;
}
const WS_BASE = getWsBase();

function generateWsRid(): string {
  return "ws-" + Math.random().toString(36).substring(2, 8);
}

export function useWebSocket(projectId: string, channelId?: string | null) {
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

        // 스트리밍 청크 처리
        if (data.type === "stream" && data.content) {
          const { streamingMessageId, startStream, appendStreamContent } =
            useChatStore.getState();
          if (!streamingMessageId) {
            startStream();
          }
          appendStreamContent(data.content);
          return;
        }

        // 에이전트 이벤트 처리
        if (data.type === "agent_created" && data.agent) {
          useAgentStore.getState().upsertAgent(data.agent as Agent);
          return;
        }
        if (data.type === "agent_updated" && data.agent) {
          useAgentStore.getState().upsertAgent(data.agent as Agent);
          return;
        }
        if (data.type === "agent_deleted" && data.agent_id) {
          useAgentStore.getState().removeAgent(data.agent_id as string);
          return;
        }
        if (data.type === "agent_status" && data.agent_id) {
          useAgentStore.getState().setAgentStatus(
            data.agent_id as string,
            (data.status as "idle" | "responding") ?? "idle"
          );
          return;
        }
        if (
          data.type === "agent_channel_assigned" ||
          data.type === "agent_channel_unassigned"
        ) {
          // 채널 배정 이벤트는 현재 UI 갱신을 위해 별도 처리 가능
          return;
        }

        // 서버가 { type: "message", messages: [...] } 형식으로 전송
        if (data.type === "message" && Array.isArray(data.messages)) {
          // 스트리밍 완료 — 최종 메시지 도착 시 스트림 초기화
          const { clearStream } = useChatStore.getState();
          clearStream();

          for (const msg of data.messages) {
            // user 메시지는 이미 optimistic update로 추가됐으므로 서버 응답에서 스킵
            if (msg.role === "user") continue;
            const chatMsg: ChatMessage = {
              id: msg.id,
              role: msg.role,
              content: msg.content ?? "",
              timestamp: msg.timestamp ?? new Date().toISOString(),
              tool_calls: msg.tool_calls,
              agent_id: msg.agent_id,
              agent_name: msg.agent_name,
              agent_color: msg.agent_color,
            };
            addMessage(chatMsg);
          }
        } else if (data.id && data.role) {
          // 단일 ChatMessage 형태 (폴백)
          // user 메시지는 이미 optimistic update로 추가됐으므로 서버 응답에서 스킵
          if (data.role !== "user") {
            const chatMsg: ChatMessage = {
              id: data.id,
              role: data.role,
              content: data.content ?? "",
              timestamp: data.timestamp ?? data.created_at ?? new Date().toISOString(),
              tool_calls: data.tool_calls,
              agent_id: data.agent_id,
              agent_name: data.agent_name,
              agent_color: data.agent_color,
            };
            addMessage(chatMsg);
          }
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
      const { selectedChannelId } = useChatStore.getState();
      const payload = JSON.stringify({
        content,
        provider: selectedProvider,
        model: selectedModel,
        ...(selectedChannelId ? { channel_id: selectedChannelId } : {}),
      });
      console.log(`[${ridRef.current}] ${new Date().toISOString()} SEND ${payload}`);
      wsRef.current.send(payload);
    }
  }, [addMessage, setLoading]);

  return { sendMessage };
}
