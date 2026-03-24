"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  BookOpen,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/user-context";
import {
  getBookById,
  getMessagesByBookAndUsers,
  addMessage,
  updateConversation,
  getOrCreateConversation,
  updateBookStatus,
} from "@/lib/storage";
import type { Book, Message } from "@/lib/types";

interface ChatRoomProps {
  bookId: string;
  sellerId: string;
}

function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatRoom({ bookId, sellerId }: ChatRoomProps) {
  const router = useRouter();
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmSold, setShowConfirmSold] = useState(false);

  useEffect(() => {
    const foundBook = getBookById(bookId);
    setBook(foundBook || null);

    if (foundBook && user) {
      const chatMessages = getMessagesByBookAndUsers(
        bookId,
        user.user_id,
        sellerId
      );
      setMessages(chatMessages);
    }

    setIsLoading(false);
  }, [bookId, sellerId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !book) return;

    const receiverId = user.user_id === book.seller_id ? sellerId : book.seller_id;

    // 确保会话存在
    const conv = getOrCreateConversation(
      book.id,
      book.title,
      user.user_id === book.seller_id ? sellerId : user.user_id,
      user.user_id === book.seller_id ? "买家" : user.nickname,
      book.seller_id,
      book.seller_nickname
    );

    // 添加消息
    const message = addMessage({
      book_id: bookId,
      sender_id: user.user_id,
      receiver_id: receiverId,
      content: newMessage.trim(),
    });

    // 更新会话
    updateConversation(conv.id, newMessage.trim());

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleConfirmSold = () => {
    if (!book) return;
    updateBookStatus(book.id, "已售");
    setBook({ ...book, status: "已售" });
    setShowConfirmSold(false);
  };

  const isSeller = user?.user_id === book?.seller_id;
  const otherPartyName = isSeller ? "买家" : book?.seller_nickname || "卖家";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          书籍不存在
        </h2>
        <Button asChild className="mt-6">
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="flex items-center gap-4 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold text-foreground truncate">
              {otherPartyName}
            </h1>
            <p className="text-xs text-muted-foreground truncate">
              {book.title}
            </p>
          </div>
        </div>
      </header>

      {/* 书籍信息卡片 */}
      <div className="border-b border-border bg-card/50 p-4">
        <Link
          href={`/book/${book.id}`}
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30"
        >
          <div className="relative h-16 w-12 overflow-hidden rounded-lg bg-muted">
            <img
              src={book.image}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-foreground truncate">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {book.publisher} · 第{book.version}版
            </p>
            {book.price && (
              <p className="mt-1 text-sm font-medium text-accent">
                ¥{book.price}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
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
        </Link>

        {/* 卖家操作：确认已售 */}
        {isSeller && book.status === "在售" && (
          <div className="mt-3">
            {showConfirmSold ? (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
                <p className="flex-1 text-sm text-foreground">
                  确认将此书籍标记为已售出？
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowConfirmSold(false)}
                >
                  取消
                </Button>
                <Button size="sm" onClick={handleConfirmSold}>
                  确认
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowConfirmSold(true)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                确认已售出
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isOwnMessage = msg.sender_id === user?.user_id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isOwnMessage
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p
                      className={`mt-1 text-xs ${
                        isOwnMessage
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatMessageTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              开始聊天吧，协商价格和交易方式
            </p>
          </div>
        )}
      </div>

      {/* 输入框 */}
      <div className="sticky bottom-0 border-t border-border bg-card p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="输入消息..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="h-12 flex-1 rounded-full"
            disabled={book.status === "已售"}
          />
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12 rounded-full"
            disabled={!newMessage.trim() || book.status === "已售"}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        {book.status === "已售" && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            此书籍已售出，无法继续聊天
          </p>
        )}
      </div>
    </div>
  );
}
