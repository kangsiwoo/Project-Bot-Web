"use client";

// 회원가입 페이지

import { RegisterForm } from "@/components/auth/register-form";
import { Bot } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
      <div className="mb-8 flex items-center gap-2">
        <Bot className="h-8 w-8 text-indigo-600" />
        <h1 className="text-2xl font-bold">Project Bot</h1>
      </div>
      <RegisterForm />
    </div>
  );
}
