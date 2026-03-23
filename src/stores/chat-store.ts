// Zustand 채팅 상태 관리 스토어

import { create } from "zustand";
import type { ChatMessage } from "@/types";
import type { ProviderId } from "@/lib/llm-providers";
import { getDefaultModel } from "@/lib/llm-providers";

interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  isLoading: boolean;
  selectedProvider: ProviderId;
  selectedModel: string;
  selectedChannelId: string | null;
  streamingContent: string;
  streamingMessageId: string | null;
  hasMoreMessages: boolean;

  // 액션
  addMessage: (message: ChatMessage) => void;
  prependMessages: (messages: ChatMessage[]) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  setProvider: (provider: ProviderId) => void;
  setModel: (model: string) => void;
  setSelectedChannelId: (id: string | null) => void;
  setHasMoreMessages: (v: boolean) => void;
  startStream: () => void;
  appendStreamContent: (content: string) => void;
  clearStream: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isConnected: false,
  isLoading: false,
  selectedProvider: "claude_code",
  selectedModel: "sonnet",
  selectedChannelId: null,
  streamingContent: "",
  streamingMessageId: null,
  hasMoreMessages: false,

  addMessage: (message) =>
    set((state) => {
      // 중복 메시지 방지 (WebSocket 브로드캐스트로 동일 ID가 재수신될 수 있음)
      if (state.messages.some((m) => m.id === message.id)) return state;
      return { messages: [...state.messages, message] };
    }),

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    })),

  setConnected: (connected) => set({ isConnected: connected }),

  setLoading: (loading) => set({ isLoading: loading }),

  prependMessages: (messages) =>
    set((state) => ({
      messages: [...messages, ...state.messages],
    })),

  clearMessages: () => set({ messages: [], hasMoreMessages: false }),

  setProvider: (provider) =>
    set({ selectedProvider: provider, selectedModel: getDefaultModel(provider) }),

  setModel: (model) => set({ selectedModel: model }),

  setSelectedChannelId: (id) => set({ selectedChannelId: id }),

  setHasMoreMessages: (v) => set({ hasMoreMessages: v }),

  startStream: () =>
    set({
      streamingMessageId: `streaming-${crypto.randomUUID()}`,
      streamingContent: "",
    }),

  appendStreamContent: (content) =>
    set((state) => ({
      streamingContent: state.streamingContent + content,
    })),

  clearStream: () =>
    set({ streamingContent: "", streamingMessageId: null }),
}));
