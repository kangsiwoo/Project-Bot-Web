"use client";

// 설정 페이지 — 프로필, 알림, 테마, 로그아웃

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Bell, Volume2, Sun, Moon, Monitor } from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initial = user?.username?.charAt(0)?.toUpperCase() ?? "?";

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">계정 및 앱 설정</p>
      </div>

      {/* ── Profile ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">프로필</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar size="lg">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <p className="text-sm font-medium">{user?.username}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* ── Notifications ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">알림</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">푸시 알림</p>
                <p className="text-xs text-muted-foreground">
                  새 알림을 푸시로 받습니다
                </p>
              </div>
            </div>
            <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">알림 소리</p>
                <p className="text-xs text-muted-foreground">
                  알림 수신 시 소리를 재생합니다
                </p>
              </div>
            </div>
            <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* ── Appearance ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">테마</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-sm transition-colors hover:bg-accent ${
                  theme === value
                    ? "border-primary bg-accent"
                    : "border-border"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* ── Account ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-destructive">계정</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            로그아웃
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
