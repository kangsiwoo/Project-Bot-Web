import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface ProjectChannel {
  id: string;
  name: string;
  team_name: string | null;
  is_console: boolean;
  created_at: string;
}

interface ChannelMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  user_id: string | null;
  username: string | null;
  created_at: string;
}

export function useChannels(projectId: string) {
  return useQuery({
    queryKey: ["channels", projectId],
    queryFn: () => api<ProjectChannel[]>(`/api/projects/${projectId}/channels`),
    enabled: !!projectId,
  });
}

export function useChannelMessages(projectId: string, channelId: string) {
  return useQuery({
    queryKey: ["channel-messages", channelId],
    queryFn: () =>
      api<ChannelMessage[]>(
        `/api/projects/${projectId}/channels/${channelId}/messages`
      ),
    enabled: !!projectId && !!channelId,
  });
}

export function useCreateChannel(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      api(`/api/projects/${projectId}/channels`, {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["channels", projectId] }),
  });
}

export function useDeleteChannel(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (channelId: string) =>
      api(`/api/projects/${projectId}/channels/${channelId}`, {
        method: "DELETE",
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["channels", projectId] }),
  });
}

export type { ProjectChannel, ChannelMessage };
