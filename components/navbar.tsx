"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Plus, MessageCircle, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/user-context";

const navItems = [
  { href: "/", label: "首页", icon: BookOpen },
  { href: "/publish", label: "发布", icon: Plus },
  { href: "/messages", label: "消息", icon: MessageCircle },
  { href: "/my-books", label: "我的", icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <>
      {/* 顶部导航栏 - 桌面端 */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">
              校园书巷
            </span>
          </Link>

          {/* 搜索框 - 桌面端 */}
          <div className="hidden flex-1 max-w-md mx-8 md:block">
            <Link
              href="/?focus=search"
              className="flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50"
            >
              <Search className="h-4 w-4" />
              <span>搜索书籍...</span>
            </Link>
          </div>

          {/* 桌面端导航 */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.slice(1).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 用户信息 */}
          {user && (
            <div className="hidden items-center gap-2 ml-4 md:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {user.nickname.charAt(0)}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 底部导航栏 - 移动端 */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card md:hidden">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
