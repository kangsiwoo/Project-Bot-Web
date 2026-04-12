// Zustand 에이전트 상태 관리 스토어
import { create } from "zustand";
import type { Agent } from "@/types";

interface AgentStore {
  agents: Agent[];
  selectedAgentId: string | null;
  isAgentPanelOpen: boolean;

  // 액션
  setAgents: (agents: Agent[]) => void;
  upsertAgent: (agent: Agent) => void;
  removeAgent: (agentId: string) => void;
  setSelectedAgentId: (id: string | null) => void;
  toggleAgentPanel: () => void;
  setAgentPanelOpen: (open: boolean) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  selectedAgentId: null,
  isAgentPanelOpen: false,

  setAgents: (agents) => set({ agents }),

  upsertAgent: (agent) =>
    set((state) => {
      const exists = state.agents.some((a) => a.id === agent.id);
      if (exists) {
        return {
          agents: state.agents.map((a) => (a.id === agent.id ? agent : a)),
        };
      }
      return { agents: [...state.agents, agent] };
    }),

  removeAgent: (agentId) =>
    set((state) => ({
      agents: state.agents.filter((a) => a.id !== agentId),
      selectedAgentId:
        state.selectedAgentId === agentId ? null : state.selectedAgentId,
    })),

  setSelectedAgentId: (id) => set({ selectedAgentId: id }),

  toggleAgentPanel: () =>
    set((state) => ({ isAgentPanelOpen: !state.isAgentPanelOpen })),

  setAgentPanelOpen: (open) => set({ isAgentPanelOpen: open }),
}));
