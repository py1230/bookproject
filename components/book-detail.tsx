"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MessageCircle,
  Clock,
  Building2,
  BookCopy,
  User,
  Tag,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import { getBookById, getOrCreateConversation } from "@/lib/storage";
import type { Book } from "@/lib/types";

interface BookDetailProps {
  bookId: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function BookDetail({ bookId }: BookDetailProps) {
  const router = useRouter();
  const { user } = useUser();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const foundBook = getBookById(bookId);
    setBook(foundBook || null);
    setIsLoading(false);
  }, [bookId]);

  const handleStartChat = () => {
    if (!user || !book) return;

    // 创建或获取会话
    getOrCreateConversation(
      book.id,
      book.title,
      user.user_id,
      user.nickname,
      book.seller_id,
      book.seller_nickname
    );

    // 跳转到聊天页面
    router.push(`/chat/${book.id}?seller=${book.seller_id}`);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-24 rounded bg-muted" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="aspect-[3/4] rounded-2xl bg-muted" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
              <div className="h-4 w-1/3 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20">
        <div className="flex flex-col items-center justify-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            书籍不存在
          </h2>
          <p className="mt-2 text-muted-foreground">
            该书籍可能已被删除或链接无效
          </p>
          <Button asChild className="mt-6">
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isOwnBook = user?.user_id === book.seller_id;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 pb-32 md:pb-6">
      {/* 返回按钮 */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>返回</span>
      </button>

      <div className="grid gap-8 md:grid-cols-2">
        {/* 封面图片 */}
        <div className="relative">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src={book.image}
              alt={book.title}
              fill
              className="object-cover"
              priority
            />
            {book.status === "已售" && (
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
                <span className="rounded-xl bg-card px-6 py-3 text-lg font-medium text-foreground">
                  已售出
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 书籍信息 */}
        <div className="flex flex-col">
          {/* 状态标签 */}
          <div className="mb-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                book.status === "在售"
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {book.status}
            </span>
          </div>

          {/* 书名 */}
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {book.title}
          </h1>

          {/* 价格 */}
          {book.price && (
            <div className="mt-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-accent" />
              <span className="text-2xl font-bold text-accent">
                ¥{book.price}
              </span>
            </div>
          )}

          {/* 详细信息 */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <span>出版社：{book.publisher}</span>
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <BookCopy className="h-5 w-5 text-muted-foreground" />
              <span>版本：第{book.version}版</span>
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <User className="h-5 w-5 text-muted-foreground" />
              <span>卖家：{book.seller_nickname}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span>发布于 {formatDate(book.created_at)}</span>
            </div>
          </div>

          {/* 描述 */}
          {book.description && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground">
                书籍描述
              </h3>
              <p className="mt-2 text-foreground leading-relaxed">
                {book.description}
              </p>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="mt-auto pt-8">
            {isOwnBook ? (
              <div className="rounded-xl border border-border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  这是您发布的书籍，可在「我的发布」页面管理
                </p>
                <Button asChild variant="outline" className="mt-3">
                  <Link href="/my-books">查看我的发布</Link>
                </Button>
              </div>
            ) : book.status === "在售" ? (
              <Button
                onClick={handleStartChat}
                size="lg"
                className="w-full md:w-auto"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                联系卖家
              </Button>
            ) : (
              <Button disabled size="lg" className="w-full md:w-auto">
                书籍已售出
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
