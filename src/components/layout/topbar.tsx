"use client";

// 상단바 - 모바일 사이드바 토글 + 검색 + 사용자 아바타

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarNav } from "./sidebar-nav";
import { useAuth } from "@/hooks/use-auth";
import { Menu, Bot, Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Topbar() {
  const { user, logout } = useAuth();

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "??";

  return (
    <header className="flex h-14 items-center border-b px-4 gap-4">
      {/* Mobile hamburger */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" />}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex items-center gap-2 px-6 py-5">
              <Bot className="h-6 w-6 text-indigo-600" />
              <span className="text-lg font-bold">Project Bot</span>
            </div>
            <div className="py-4">
              <SidebarNav />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <Bot className="h-5 w-5 text-indigo-600" />
        <span className="font-semibold">Project Bot</span>
      </div>

      {/* Search bar */}
      <div className="hidden md:flex flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="검색..."
          className="pl-9 bg-muted/50"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1 md:flex-none" />

      {/* User avatar (desktop) */}
      <div className="hidden md:block">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="rounded-full" />
            }
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs dark:bg-indigo-900 dark:text-indigo-300">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
