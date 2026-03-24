"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, ChevronRight } from "lucide-react";
import { useUser } from "@/contexts/user-context";
import { getConversationsByUser } from "@/lib/storage";
import type { Conversation } from "@/lib/types";

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

export function MessagesList() {
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const userConversations = getConversationsByUser(user.user_id);
      setConversations(userConversations);
    }
    setIsLoading(false);
  }, [user]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              <div className="h-12 w-12 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-24 md:pb-6">
      {/* 标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">消息</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          与卖家/买家的聊天记录
        </p>
      </div>

      {/* 会话列表 */}
      {conversations.length > 0 ? (
        <div className="space-y-3">
          {conversations.map((conv) => {
            const otherPartyName =
              user?.user_id === conv.buyer_id
                ? conv.seller_nickname
                : conv.buyer_nickname;
            const otherPartyId =
              user?.user_id === conv.buyer_id
                ? conv.seller_id
                : conv.buyer_id;

            return (
              <Link
                key={conv.id}
                href={`/chat/${conv.book_id}?seller=${conv.seller_id}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
              >
                {/* 头像 */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-medium">
                  {otherPartyName.charAt(0)}
                </div>

                {/* 信息 */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-foreground truncate">
                      {otherPartyName}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTime(conv.last_message_time)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground truncate">
                    关于《{conv.book_title}》
                  </p>
                  {conv.last_message && (
                    <p className="mt-1 text-sm text-muted-foreground truncate">
                      {conv.last_message}
                    </p>
                  )}
                </div>

                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <MessageCircle className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">
            暂无消息
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            浏览书籍并联系卖家开始聊天
          </p>
        </div>
      )}
    </div>
  );
}
