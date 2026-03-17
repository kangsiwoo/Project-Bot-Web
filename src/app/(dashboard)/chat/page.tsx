"use client";

// Chat 프로젝트 목록 페이지 - 프로젝트를 선택하여 채팅 시작

import { useProjects } from "@/hooks/use-projects";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquareCode, Terminal, FolderKanban } from "lucide-react";
import Link from "next/link";

export default function ChatListPage() {
  const { data: projects, isLoading } = useProjects();

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            <Terminal className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-bold">Claude Code</h1>
          <Badge variant="outline" className="font-mono text-[10px]">
            Remote CLI
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          프로젝트를 선택하여 Claude Code CLI 원격 세션을 시작하세요.
        </p>
      </div>

      {/* 프로젝트 목록 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      ) : !projects || projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <FolderKanban className="h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm">등록된 프로젝트가 없습니다.</p>
          <p className="text-xs mt-1">
            먼저 프로젝트를 생성한 후 채팅을 시작할 수 있습니다.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/chat/${project.id}`}>
              <Card className="cursor-pointer transition-all hover:ring-2 hover:ring-indigo-500/30 hover:shadow-md">
                <CardContent className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-mono text-xs font-bold">
                    {">_"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold truncate">
                        {project.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className="shrink-0 font-mono text-[10px]"
                      >
                        sonnet
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {project.description || "Claude Code 원격 세션"}
                    </p>
                  </div>
                  <MessageSquareCode className="h-4 w-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
