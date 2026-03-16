"use client";

// 프로젝트 상세 페이지

import { use } from "react";
import { useProject } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, MessageSquareCode, Loader2 } from "lucide-react";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: project, isLoading, error } = useProject(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <p className="text-destructive">프로젝트를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        프로젝트 목록
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground mt-1">
            {project.description || "설명 없음"}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="secondary">
              생성: {new Date(project.created_at).toLocaleDateString("ko-KR")}
            </Badge>
          </div>
        </div>
        <Link href={`/chat/${project.id}`}>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <MessageSquareCode className="h-4 w-4" />
            Chat
          </Button>
        </Link>
      </div>

      <Separator className="my-6" />

      {/* 팀, 채널 등 추가 정보는 추후 구현 */}
      <div className="text-sm text-muted-foreground">
        팀 및 채널 관리 기능은 추후 추가됩니다.
      </div>
    </div>
  );
}
