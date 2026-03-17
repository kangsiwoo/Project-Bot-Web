"use client";

// 프로젝트 목록 페이지

import { useState, useMemo } from "react";
import { useProjects, useDeleteProject } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/projects/project-card";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Search, FolderKanban } from "lucide-react";

export default function ProjectsPage() {
  const { data: projects, isLoading, error } = useProjects();
  const deleteProject = useDeleteProject();
  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!search.trim()) return projects;
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [projects, search]);

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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            프로젝트를 관리하고 Claude Code와 협업하세요
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {/* Search/filter bar */}
      {projects && projects.length > 0 && (
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="프로젝트 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-20 text-destructive">
          <p>프로젝트를 불러오는데 실패했습니다.</p>
        </div>
      )}

      {/* Empty state */}
      {projects && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <FolderKanban className="h-12 w-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">아직 프로젝트가 없습니다.</p>
          <p className="text-sm mt-1">새 프로젝트를 만들어 시작하세요.</p>
        </div>
      )}

      {/* No search results */}
      {projects && projects.length > 0 && filteredProjects.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p>검색 결과가 없습니다.</p>
        </div>
      )}

      {/* Project grid */}
      {filteredProjects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
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
