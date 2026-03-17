"use client";

import { RegisterForm } from "@/components/auth/register-form";
import { FolderKanban } from "lucide-react";

export default function RegisterPage() {
  return (
    <>
      {/* App Icon + Title */}
      <div className="mb-6 flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
          <FolderKanban className="h-7 w-7 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Project Bot
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Remote Claude Code Management
          </p>
        </div>
      </div>

      {/* Register Form Card */}
      <RegisterForm />
    </>
  );
}
