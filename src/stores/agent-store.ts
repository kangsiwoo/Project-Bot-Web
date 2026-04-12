// Zustand 에이전트 상태 관리 스토어
import { create } from "zustand";
import type { Agent } from "@/types";

// 에이전트별 실시간 상태 ("idle" | "responding")
export type AgentStatus = "idle" | "responding";

interface AgentStore {
  agents: Agent[];
  selectedAgentId: string | null;
  isAgentPanelOpen: boolean;
  // agent_id → 실시간 상태
  agentStatuses: Record<string, AgentStatus>;

  // 액션
  setAgents: (agents: Agent[]) => void;
  upsertAgent: (agent: Agent) => void;
  removeAgent: (agentId: string) => void;
  setSelectedAgentId: (id: string | null) => void;
  toggleAgentPanel: () => void;
  setAgentPanelOpen: (open: boolean) => void;
  setAgentStatus: (agentId: string, status: AgentStatus) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  selectedAgentId: null,
  isAgentPanelOpen: false,
  agentStatuses: {},

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

  setAgentStatus: (agentId, status) =>
    set((state) => ({
      agentStatuses: { ...state.agentStatuses, [agentId]: status },
    })),
}));
