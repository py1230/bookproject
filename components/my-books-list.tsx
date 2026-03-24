"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Clock,
  CheckCircle,
  MoreVertical,
  Eye,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/user-context";
import { getBooksBySeller, updateBookStatus } from "@/lib/storage";
import type { Book } from "@/lib/types";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
  });
}

export function MyBooksList() {
  const { user } = useUser();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "在售" | "已售">("all");

  useEffect(() => {
    if (user) {
      const userBooks = getBooksBySeller(user.user_id);
      setBooks(userBooks);
    }
    setIsLoading(false);
  }, [user]);

  const handleMarkAsSold = (bookId: string) => {
    updateBookStatus(bookId, "已售");
    setBooks(
      books.map((b) => (b.id === bookId ? { ...b, status: "已售" as const } : b))
    );
  };

  const handleMarkAsAvailable = (bookId: string) => {
    updateBookStatus(bookId, "在售");
    setBooks(
      books.map((b) => (b.id === bookId ? { ...b, status: "在售" as const } : b))
    );
  };

  const filteredBooks = books.filter((book) => {
    if (filter === "all") return true;
    return book.status === filter;
  });

  const onSaleCount = books.filter((b) => b.status === "在售").length;
  const soldCount = books.filter((b) => b.status === "已售").length;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-xl border border-border bg-card p-4"
            >
              <div className="h-24 w-18 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
                <div className="h-4 w-1/4 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-24 md:pb-6">
      {/* 标题和发布按钮 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">我的发布</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            管理您发布的书籍
          </p>
        </div>
        <Button asChild>
          <Link href="/publish">
            <Plus className="mr-2 h-4 w-4" />
            发布新书
          </Link>
        </Button>
      </div>

      {/* 用户信息卡片 */}
      {user && (
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-semibold">
              {user.nickname.charAt(0)}
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{user.nickname}</h2>
              <p className="text-sm text-muted-foreground">
                学号/工号：{user.student_id}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {books.length}
              </p>
              <p className="text-xs text-muted-foreground">总发布</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{onSaleCount}</p>
              <p className="text-xs text-muted-foreground">在售中</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-muted-foreground">
                {soldCount}
              </p>
              <p className="text-xs text-muted-foreground">已售出</p>
            </div>
          </div>
        </div>
      )}

      {/* 筛选标签 */}
      {books.length > 0 && (
        <div className="mb-4 flex gap-2">
          {(["all", "在售", "已售"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "全部" : f}
            </button>
          ))}
        </div>
      )}

      {/* 书籍列表 */}
      {filteredBooks.length > 0 ? (
        <div className="space-y-3">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="flex gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30"
            >
              {/* 封面 */}
              <Link
                href={`/book/${book.id}`}
                className="relative h-24 w-18 flex-shrink-0 overflow-hidden rounded-lg bg-muted"
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
                {book.status === "已售" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
                    <span className="rounded bg-card px-1.5 py-0.5 text-xs font-medium text-foreground">
                      已售
                    </span>
                  </div>
                )}
              </Link>

              {/* 信息 */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/book/${book.id}`}
                    className="font-medium text-foreground hover:text-primary line-clamp-2"
                  >
                    {book.title}
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/book/${book.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          查看详情
                        </Link>
                      </DropdownMenuItem>
                      {book.status === "在售" ? (
                        <DropdownMenuItem
                          onClick={() => handleMarkAsSold(book.id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          标记为已售
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleMarkAsAvailable(book.id)}
                        >
                          <Tag className="mr-2 h-4 w-4" />
                          重新上架
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {book.publisher} · 第{book.version}版
                </p>
                <div className="mt-2 flex items-center gap-3">
                  {book.price && (
                    <span className="text-sm font-medium text-accent">
                      ¥{book.price}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(book.created_at)}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      book.status === "在售"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {book.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground">
            没有{filter === "在售" ? "在售" : "已售出"}的书籍
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">
            还没有发布书籍
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            发布您的第一本二手书吧
          </p>
          <Button asChild className="mt-6">
            <Link href="/publish">
              <Plus className="mr-2 h-4 w-4" />
              发布书籍
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
