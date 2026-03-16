"use client";

// 프로젝트 목록 페이지

import { useProjects, useDeleteProject } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/projects/project-card";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ProjectsPage() {
  const { data: projects, isLoading, error } = useProjects();
  const deleteProject = useDeleteProject();

  function handleDelete(id: string) {
    if (!confirm("정말 이 프로젝트를 삭제하시겠습니까?")) return;

    deleteProject.mutate(id, {
      onSuccess: () => toast.success("프로젝트가 삭제되었습니다."),
      onError: (err) =>
        toast.error(
          err instanceof Error ? err.message : "삭제에 실패했습니다."
        ),
    });
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            프로젝트를 관리하고 Claude Code와 협업하세요
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      )}

      {error && (
        <div className="text-center py-20 text-destructive">
          <p>프로젝트를 불러오는데 실패했습니다.</p>
        </div>
      )}

      {projects && projects.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p>아직 프로젝트가 없습니다.</p>
          <p className="text-sm mt-1">새 프로젝트를 만들어 시작하세요.</p>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
