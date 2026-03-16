"use client";

// 프로젝트 카드 컴포넌트

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, MessageSquareCode } from "lucide-react";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <Card className="group relative transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <Link href={`/projects/${project.id}`}>
            <CardTitle className="text-base hover:text-indigo-600 transition-colors">
              {project.name}
            </CardTitle>
          </Link>
          <CardDescription className="line-clamp-2">
            {project.description || "설명 없음"}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            }
          >
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onDelete(project.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {new Date(project.created_at).toLocaleDateString("ko-KR")}
          </Badge>
          <Link href={`/chat/${project.id}`}>
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <MessageSquareCode className="h-3.5 w-3.5" />
              Chat
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
