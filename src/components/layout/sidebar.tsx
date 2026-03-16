"use client";

// 대시보드 사이드바 - 네비게이션 + 사용자 정보

import { SidebarNav } from "./sidebar-nav";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { LogOut, Bot } from "lucide-react";

export function Sidebar() {
  const { user, logout } = useAuth();

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "??";

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r bg-sidebar">
      <div className="flex h-full flex-col">
        {/* 로고 */}
        <div className="flex items-center gap-2 px-6 py-5">
          <Bot className="h-6 w-6 text-indigo-600" />
          <span className="text-lg font-bold">Project Bot</span>
        </div>

        <Separator />

        {/* 네비게이션 */}
        <div className="flex-1 py-4">
          <SidebarNav />
        </div>

        <Separator />

        {/* 사용자 영역 */}
        <div className="p-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 px-3"
                />
              }
            >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-sm">{user?.username}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
