"use client";

import { useState, useEffect } from "react";
import { Search, BookOpen, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BookCard, BookCardSkeleton } from "@/components/book-card";
import { getAvailableBooks, searchBooks } from "@/lib/storage";
import type { Book } from "@/lib/types";

export function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    setIsLoading(true);
    // 模拟加载延迟
    setTimeout(() => {
      const availableBooks = getAvailableBooks();
      setBooks(availableBooks);
      setIsLoading(false);
    }, 300);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchBooks(query);
      setBooks(results);
    } else {
      const availableBooks = getAvailableBooks();
      setBooks(availableBooks);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:pb-6">
      {/* 搜索框 - 移动端 */}
      <div className="mb-6 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="搜索书籍..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-12 pl-10 rounded-xl"
          />
        </div>
      </div>

      {/* 桌面端搜索框 */}
      <div className="mb-8 hidden md:block">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="搜索书名..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-14 pl-12 text-base rounded-2xl border-2 focus:border-primary"
          />
        </div>
      </div>

      {/* 统计信息 */}
      {!searchQuery && books.length > 0 && (
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>当前共有 {books.length} 本书籍在售</span>
        </div>
      )}

      {/* 搜索结果提示 */}
      {searchQuery && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            搜索 &ldquo;{searchQuery}&rdquo; 找到 {books.length} 个结果
          </p>
        </div>
      )}

      {/* 书籍列表 */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">
            {searchQuery ? "未找到相关书籍" : "暂无在售书籍"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery
              ? "试试其他关键词"
              : "成为第一个发布书籍的人吧！"}
          </p>
        </div>
      )}
    </div>
  );
}
