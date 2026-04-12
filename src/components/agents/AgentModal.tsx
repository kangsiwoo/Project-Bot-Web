"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Trash2, Plus, X } from "lucide-react";
import {
  useAgent,
  useCreateAgent,
  useUpdateAgent,
  useDeleteAgent,
  useAssignChannel,
  useUnassignChannel,
} from "@/hooks/use-agents";
import { useChannels } from "@/hooks/use-channels";
import { AgentAvatar } from "./AgentAvatar";
import type { AgentCreate, AgentUpdate } from "@/types";

interface AgentModalProps {
  projectId: string;
  agentId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#64748b",
];

export function AgentModal({
  projectId,
  agentId,
  isOpen,
  onClose,
}: AgentModalProps) {
  const isEditMode = !!agentId;
  const { data: agentData, isLoading: isLoadingAgent } = useAgent(
    projectId,
    agentId ?? ""
  );
  const { data: channels } = useChannels(projectId);
  const createAgent = useCreateAgent(projectId);
  const updateAgent = useUpdateAgent(projectId, agentId ?? "");
  const deleteAgent = useDeleteAgent(projectId);
  const assignChannel = useAssignChannel(projectId, agentId ?? "");
  const unassignChannel = useUnassignChannel(projectId, agentId ?? "");

  const [name, setName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [providerKey, setProviderKey] = useState("claude_code");
  const [modelKey, setModelKey] = useState("sonnet");
  const [avatarColor, setAvatarColor] = useState(DEFAULT_COLORS[0]);
  const [isActive, setIsActive] = useState(true);

  // Populate form when editing
  useEffect(() => {
    if (agentData) {
      setName(agentData.name);
      setRoleDescription(agentData.role_description ?? "");
      setSystemPrompt(agentData.system_prompt ?? "");
      setProviderKey(agentData.provider_key);
      setModelKey(agentData.model_key);
      setAvatarColor(agentData.avatar_color);
      setIsActive(agentData.is_active);
    } else if (!isEditMode) {
      // Reset for create
      setName("");
      setRoleDescription("");
      setSystemPrompt("");
      setProviderKey("claude_code");
      setModelKey("sonnet");
      setAvatarColor(DEFAULT_COLORS[0]);
      setIsActive(true);
    }
  }, [agentData, isEditMode]);

  const handleSave = async () => {
    if (!name.trim()) return;

    if (isEditMode) {
      const updates: AgentUpdate = {
        name: name.trim(),
        role_description: roleDescription || undefined,
        system_prompt: systemPrompt || undefined,
        provider_key: providerKey,
        model_key: modelKey,
        avatar_color: avatarColor,
        is_active: isActive,
      };
      await updateAgent.mutateAsync(updates);
    } else {
      const data: AgentCreate = {
        name: name.trim(),
        role_description: roleDescription || undefined,
        system_prompt: systemPrompt || undefined,
        provider_key: providerKey,
        model_key: modelKey,
        avatar_color: avatarColor,
        is_active: isActive,
      };
      await createAgent.mutateAsync(data);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!agentId) return;
    if (!confirm(`에이전트 "${name}"을 삭제하시겠습니까?`)) return;
    await deleteAgent.mutateAsync(agentId);
    onClose();
  };

  const handleAssignChannel = async (channelId: string) => {
    await assignChannel.mutateAsync({ channel_id: channelId });
  };

  const handleUnassignChannel = async (channelId: string) => {
    await unassignChannel.mutateAsync(channelId);
  };

  const assignedChannelIds = new Set(
    agentData?.assigned_channels.map((c) => c.channel_id) ?? []
  );

  const isSaving = createAgent.isPending || updateAgent.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "에이전트 수정" : "새 에이전트"}
          </DialogTitle>
        </DialogHeader>

        {isEditMode && isLoadingAgent ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">기본 정보</TabsTrigger>
              {isEditMode && (
                <TabsTrigger value="channels">채널 배정</TabsTrigger>
              )}
            </TabsList>

            {/* 기본 정보 탭 */}
            <TabsContent value="info" className="space-y-4 pt-2">
              {/* 아바타 컬러 + 이름 */}
              <div className="flex items-center gap-3">
                <AgentAvatar name={name || "A"} color={avatarColor} size="lg" />
                <div className="flex-1">
                  <Label htmlFor="agent-name" className="text-xs mb-1 block">
                    이름
                  </Label>
                  <Input
                    id="agent-name"
                    placeholder="에이전트 이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* 색상 선택 */}
              <div>
                <Label className="text-xs mb-1.5 block">아바타 색상</Label>
                <div className="flex gap-2 flex-wrap">
                  {DEFAULT_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAvatarColor(c)}
                      className="h-6 w-6 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: c,
                        borderColor:
                          avatarColor === c ? "white" : "transparent",
                        outline:
                          avatarColor === c ? `2px solid ${c}` : "none",
                      }}
                    />
                  ))}
                  <Input
                    type="color"
                    value={avatarColor}
                    onChange={(e) => setAvatarColor(e.target.value)}
                    className="h-6 w-12 p-0.5 cursor-pointer"
                  />
                </div>
              </div>

              {/* Role Description */}
              <div>
                <Label
                  htmlFor="agent-role"
                  className="text-xs mb-1 block"
                >
                  역할 설명
                </Label>
                <Input
                  id="agent-role"
                  placeholder="예: 백엔드 API 개발 담당"
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                />
              </div>

              {/* Provider + Model */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="agent-provider" className="text-xs mb-1 block">
                    Provider
                  </Label>
                  <select
                    id="agent-provider"
                    value={providerKey}
                    onChange={(e) => setProviderKey(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="claude_code">Claude Code</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="openai">OpenAI</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="agent-model" className="text-xs mb-1 block">
                    Model
                  </Label>
                  <Input
                    id="agent-model"
                    placeholder="예: sonnet, opus"
                    value={modelKey}
                    onChange={(e) => setModelKey(e.target.value)}
                  />
                </div>
              </div>

              {/* System Prompt */}
              <div>
                <Label
                  htmlFor="agent-system-prompt"
                  className="text-xs mb-1 block"
                >
                  시스템 프롬프트
                </Label>
                <Textarea
                  id="agent-system-prompt"
                  placeholder="에이전트에게 전달할 시스템 프롬프트..."
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={4}
                  className="resize-none text-sm"
                />
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="agent-active" className="text-sm">
                  활성화
                </Label>
                <Switch
                  id="agent-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            </TabsContent>

            {/* 채널 배정 탭 */}
            {isEditMode && (
              <TabsContent value="channels" className="pt-2">
                <p className="text-xs text-muted-foreground mb-3">
                  에이전트를 채널에 배정하면 해당 채널에서 에이전트가 응답합니다.
                </p>
                <ScrollArea className="h-60">
                  <div className="space-y-1">
                    {channels?.map((ch) => {
                      const isAssigned = assignedChannelIds.has(ch.id);
                      return (
                        <div
                          key={ch.id}
                          className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">
                              #
                            </span>
                            <span className="text-sm">{ch.name}</span>
                            {ch.is_console && (
                              <Badge
                                variant="outline"
                                className="text-[10px] h-4"
                              >
                                console
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="icon-xs"
                            variant={isAssigned ? "destructive" : "outline"}
                            onClick={() =>
                              isAssigned
                                ? handleUnassignChannel(ch.id)
                                : handleAssignChannel(ch.id)
                            }
                            disabled={
                              assignChannel.isPending ||
                              unassignChannel.isPending
                            }
                          >
                            {isAssigned ? (
                              <X className="h-3 w-3" />
                            ) : (
                              <Plus className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      );
                    })}
                    {!channels?.length && (
                      <p className="text-xs text-muted-foreground text-center py-6">
                        채널이 없습니다
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            )}
          </Tabs>
        )}

        <DialogFooter className="mt-2">
          {isEditMode && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteAgent.isPending}
              className="mr-auto"
            >
              {deleteAgent.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              삭제
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onClose}>
            취소
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!name.trim() || isSaving}
          >
            {isSaving && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
            {isEditMode ? "저장" : "생성"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
