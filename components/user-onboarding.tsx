"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/user-context";

export function UserOnboarding() {
  const { login, isLoggedIn, isLoading } = useUser();
  const [studentId, setStudentId] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <BookOpen className="h-12 w-12 animate-pulse text-primary" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!studentId.trim()) {
      setError("请输入学号/工号");
      return;
    }

    if (studentId.length < 6 || studentId.length > 12) {
      setError("学号/工号长度应为6-12位");
      return;
    }

    if (!nickname.trim()) {
      setError("请输入昵称");
      return;
    }

    if (nickname.length < 2 || nickname.length > 10) {
      setError("昵称长度应为2-10个字符");
      return;
    }

    login(studentId.trim(), nickname.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-foreground">
              校园书巷
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              校园二手教材交易平台
            </p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                学号/工号
              </label>
              <Input
                type="text"
                placeholder="请输入您的学号或工号"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                昵称
              </label>
              <Input
                type="text"
                placeholder="请输入您的昵称"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="h-12"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="h-12 w-full text-base">
              开始使用
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            仅用于本校师生交流，信息保存在本地浏览器
          </p>
        </div>
      </div>
    </div>
  );
}
