"use client";

// 설정 페이지 (기본 틀)

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">계정 설정</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">프로필</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              사용자명
            </label>
            <p className="text-sm">{user?.username}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              이메일
            </label>
            <p className="text-sm">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-destructive">위험 영역</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={logout}>
            로그아웃
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
