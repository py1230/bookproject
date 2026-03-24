"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import type { Book } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  return date.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
  });
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/book/${book.id}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-lg">
        {/* 封面图片 */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={book.image}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {book.status === "已售" && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
              <span className="rounded-lg bg-card px-4 py-2 text-sm font-medium text-foreground">
                已售出
              </span>
            </div>
          )}
          {book.price && (
            <div className="absolute bottom-2 left-2 rounded-lg bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
              ¥{book.price}
            </div>
          )}
        </div>

        {/* 信息区域 */}
        <div className="p-3">
          <h3 className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
            {book.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {book.publisher} · 第{book.version}版
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {book.seller_nickname}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatTime(book.created_at)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="aspect-[3/4] animate-pulse bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="flex items-center justify-between">
          <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
