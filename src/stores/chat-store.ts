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

  // 액션
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  setProvider: (provider: ProviderId) => void;
  setModel: (model: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isConnected: false,
  isLoading: false,
  selectedProvider: "claude_code",
  selectedModel: "sonnet",

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    })),

  setConnected: (connected) => set({ isConnected: connected }),

  setLoading: (loading) => set({ isLoading: loading }),

  clearMessages: () => set({ messages: [] }),

  setProvider: (provider) =>
    set({ selectedProvider: provider, selectedModel: getDefaultModel(provider) }),

  setModel: (model) => set({ selectedModel: model }),
}));
