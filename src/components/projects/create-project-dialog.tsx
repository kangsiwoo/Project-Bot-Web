"use client";

// 프로젝트 생성 다이얼로그

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProject } from "@/hooks/use-projects";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createProject = useCreateProject();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await createProject.mutateAsync({ name, description });
      toast.success("프로젝트가 생성되었습니다.");
      setName("");
      setDescription("");
      setOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "프로젝트 생성에 실패했습니다."
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2 bg-indigo-600 hover:bg-indigo-700" />}>
        <Plus className="h-4 w-4" />
        새 프로젝트
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 프로젝트 만들기</DialogTitle>
          <DialogDescription>
            프로젝트 이름과 설명을 입력하세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <label htmlFor="project-name" className="text-sm font-medium">
              프로젝트 이름
            </label>
            <Input
              id="project-name"
              placeholder="my-awesome-project"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="project-desc" className="text-sm font-medium">
              설명
            </label>
            <Textarea
              id="project-desc"
              placeholder="프로젝트에 대한 간단한 설명"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <Button
            type="submit"
            disabled={createProject.isPending}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {createProject.isPending ? "생성 중..." : "생성"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
