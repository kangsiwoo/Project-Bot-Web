// TanStack Query 훅 - 에이전트 CRUD + 채널 배정
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Agent, AgentDetail, AgentCreate, AgentUpdate, AgentChannelAssign } from "@/types";

export function useAgents(projectId: string) {
  return useQuery<Agent[]>({
    queryKey: ["agents", projectId],
    queryFn: () => api<Agent[]>(`/api/projects/${projectId}/agents`),
    enabled: !!projectId,
  });
}

export function useAgent(projectId: string, agentId: string) {
  return useQuery<AgentDetail>({
    queryKey: ["agents", projectId, agentId],
    queryFn: () => api<AgentDetail>(`/api/projects/${projectId}/agents/${agentId}`),
    enabled: !!projectId && !!agentId,
  });
}

export function useCreateAgent(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AgentCreate) =>
      api<Agent>(`/api/projects/${projectId}/agents`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["agents", projectId] }),
  });
}

export function useUpdateAgent(projectId: string, agentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AgentUpdate) =>
      api<Agent>(`/api/projects/${projectId}/agents/${agentId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents", projectId] });
      queryClient.invalidateQueries({ queryKey: ["agents", projectId, agentId] });
    },
  });
}

export function useDeleteAgent(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (agentId: string) =>
      api(`/api/projects/${projectId}/agents/${agentId}`, {
        method: "DELETE",
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["agents", projectId] }),
  });
}

export function useAssignChannel(projectId: string, agentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AgentChannelAssign) =>
      api(`/api/projects/${projectId}/agents/${agentId}/channels`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents", projectId] });
      queryClient.invalidateQueries({ queryKey: ["agents", projectId, agentId] });
      queryClient.invalidateQueries({ queryKey: ["channel-agents", projectId] });
    },
  });
}

export function useUnassignChannel(projectId: string, agentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (channelId: string) =>
      api(`/api/projects/${projectId}/agents/${agentId}/channels/${channelId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents", projectId] });
      queryClient.invalidateQueries({ queryKey: ["agents", projectId, agentId] });
      queryClient.invalidateQueries({ queryKey: ["channel-agents", projectId] });
    },
  });
}

export function useChannelAgents(projectId: string, channelId: string) {
  return useQuery<Agent[]>({
    queryKey: ["channel-agents", projectId, channelId],
    queryFn: () =>
      api<Agent[]>(`/api/projects/${projectId}/channels/${channelId}/agents`),
    enabled: !!projectId && !!channelId,
  });
}
