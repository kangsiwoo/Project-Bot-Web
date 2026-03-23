"use client";

import { useState, useMemo } from "react";
import {
  useChannels,
  useCreateChannel,
  type ProjectChannel,
} from "@/hooks/use-channels";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Hash, Terminal, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChannelSidebarProps {
  projectId: string;
  selectedChannelId: string | null;
  onSelectChannel: (id: string) => void;
}

export function ChannelSidebar({
  projectId,
  selectedChannelId,
  onSelectChannel,
}: ChannelSidebarProps) {
  const { data: channels, isLoading } = useChannels(projectId);
  const createChannel = useCreateChannel(projectId);
  const [newChannelName, setNewChannelName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Group channels: console first, then by team_name
  const { consoleChannels, groupedChannels } = useMemo(() => {
    if (!channels) return { consoleChannels: [], groupedChannels: new Map() };

    const consoleArr: ProjectChannel[] = [];
    const grouped = new Map<string, ProjectChannel[]>();

    for (const ch of channels) {
      if (ch.is_console) {
        consoleArr.push(ch);
      } else {
        const team = ch.team_name ?? "General";
        if (!grouped.has(team)) grouped.set(team, []);
        grouped.get(team)!.push(ch);
      }
    }

    return { consoleChannels: consoleArr, groupedChannels: grouped };
  }, [channels]);

  const handleCreate = async () => {
    const name = newChannelName.trim();
    if (!name) return;
    await createChannel.mutateAsync(name);
    setNewChannelName("");
    setDialogOpen(false);
  };

  return (
    <div className="flex h-full w-60 flex-col border-r bg-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-3 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Channels
        </span>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button variant="ghost" size="icon-xs">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Channel</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
              }}
            >
              <Input
                placeholder="channel-name"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                autoFocus
              />
              <DialogFooter className="mt-4">
                <Button
                  type="submit"
                  size="sm"
                  disabled={
                    !newChannelName.trim() || createChannel.isPending
                  }
                >
                  {createChannel.isPending && (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  )}
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Channel list */}
      <ScrollArea className="flex-1">
        <div className="py-1">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Console channels */}
          {consoleChannels.map((ch) => (
            <ChannelItem
              key={ch.id}
              channel={ch}
              isSelected={selectedChannelId === ch.id}
              onSelect={onSelectChannel}
              icon={<Terminal className="h-3.5 w-3.5 shrink-0" />}
            />
          ))}

          {/* Team-grouped channels */}
          {Array.from(groupedChannels.entries()).map(
            ([teamName, teamChannels]: [string, ProjectChannel[]]) => (
              <div key={teamName}>
                <div className="px-3 pb-0.5 pt-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {teamName}
                  </span>
                </div>
                {teamChannels.map((ch) => (
                  <ChannelItem
                    key={ch.id}
                    channel={ch}
                    isSelected={selectedChannelId === ch.id}
                    onSelect={onSelectChannel}
                    icon={<Hash className="h-3.5 w-3.5 shrink-0" />}
                  />
                ))}
              </div>
            )
          )}

          {/* Empty state */}
          {!isLoading && (!channels || channels.length === 0) && (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
              No channels yet
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function ChannelItem({
  channel,
  isSelected,
  onSelect,
  icon,
}: {
  channel: ProjectChannel;
  isSelected: boolean;
  onSelect: (id: string) => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={() => onSelect(channel.id)}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isSelected
          ? "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground"
      )}
    >
      {icon}
      <span className="truncate">{channel.name}</span>
    </button>
  );
}
