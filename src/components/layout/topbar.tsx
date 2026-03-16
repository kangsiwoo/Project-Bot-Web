"use client";

// 모바일 상단바 - 사이드바 토글 + 로고

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { SidebarNav } from "./sidebar-nav";
import { Menu, Bot } from "lucide-react";

export function Topbar() {
  return (
    <header className="flex h-14 items-center border-b px-4 md:hidden">
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

      <div className="flex items-center gap-2 ml-3">
        <Bot className="h-5 w-5 text-indigo-600" />
        <span className="font-semibold">Project Bot</span>
      </div>
    </header>
  );
}
