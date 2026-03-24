"use client";

import type { User, Book, Message, Conversation } from "./types";

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ========== 用户相关 ==========
const USER_KEY = "campus_book_user";

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function setUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function createUser(studentId: string, nickname: string): User {
  const user: User = {
    user_id: generateId(),
    student_id: studentId,
    nickname,
    created_at: new Date().toISOString(),
  };
  setUser(user);
  return user;
}

// ========== 书籍相关 ==========
const BOOKS_KEY = "campus_books";

export function getBooks(): Book[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(BOOKS_KEY);
  return data ? JSON.parse(data) : [];
}

export function setBooks(books: Book[]): void {
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

export function addBook(book: Omit<Book, "id" | "created_at">): Book {
  const books = getBooks();
  const newBook: Book = {
    ...book,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  books.unshift(newBook);
  setBooks(books);
  return newBook;
}

export function getBookById(id: string): Book | undefined {
  const books = getBooks();
  return books.find((b) => b.id === id);
}

export function updateBookStatus(id: string, status: "在售" | "已售"): void {
  const books = getBooks();
  const index = books.findIndex((b) => b.id === id);
  if (index !== -1) {
    books[index].status = status;
    setBooks(books);
  }
}

export function getBooksBySeller(sellerId: string): Book[] {
  const books = getBooks();
  return books.filter((b) => b.seller_id === sellerId);
}

export function searchBooks(keyword: string): Book[] {
  const books = getBooks();
  const lowerKeyword = keyword.toLowerCase();
  return books.filter(
    (b) =>
      b.status === "在售" && b.title.toLowerCase().includes(lowerKeyword)
  );
}

export function getAvailableBooks(): Book[] {
  const books = getBooks();
  return books.filter((b) => b.status === "在售");
}

// ========== 消息相关 ==========
const MESSAGES_KEY = "campus_messages";

export function getMessages(): Message[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(MESSAGES_KEY);
  return data ? JSON.parse(data) : [];
}

export function setMessages(messages: Message[]): void {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function addMessage(
  message: Omit<Message, "id" | "timestamp">
): Message {
  const messages = getMessages();
  const newMessage: Message = {
    ...message,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };
  messages.push(newMessage);
  setMessages(messages);
  return newMessage;
}

export function getMessagesByBookAndUsers(
  bookId: string,
  userId1: string,
  userId2: string
): Message[] {
  const messages = getMessages();
  return messages.filter(
    (m) =>
      m.book_id === bookId &&
      ((m.sender_id === userId1 && m.receiver_id === userId2) ||
        (m.sender_id === userId2 && m.receiver_id === userId1))
  );
}

// ========== 会话相关 ==========
const CONVERSATIONS_KEY = "campus_conversations";

export function getConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CONVERSATIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function setConversations(conversations: Conversation[]): void {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

export function getOrCreateConversation(
  bookId: string,
  bookTitle: string,
  buyerId: string,
  buyerNickname: string,
  sellerId: string,
  sellerNickname: string
): Conversation {
  const conversations = getConversations();
  let conversation = conversations.find(
    (c) => c.book_id === bookId && c.buyer_id === buyerId
  );

  if (!conversation) {
    conversation = {
      id: generateId(),
      book_id: bookId,
      book_title: bookTitle,
      buyer_id: buyerId,
      buyer_nickname: buyerNickname,
      seller_id: sellerId,
      seller_nickname: sellerNickname,
      last_message: "",
      last_message_time: new Date().toISOString(),
      unread_count: 0,
    };
    conversations.push(conversation);
    setConversations(conversations);
  }

  return conversation;
}

export function updateConversation(
  conversationId: string,
  lastMessage: string
): void {
  const conversations = getConversations();
  const index = conversations.findIndex((c) => c.id === conversationId);
  if (index !== -1) {
    conversations[index].last_message = lastMessage;
    conversations[index].last_message_time = new Date().toISOString();
    setConversations(conversations);
  }
}

export function getConversationsByUser(userId: string): Conversation[] {
  const conversations = getConversations();
  return conversations
    .filter((c) => c.buyer_id === userId || c.seller_id === userId)
    .sort(
      (a, b) =>
        new Date(b.last_message_time).getTime() -
        new Date(a.last_message_time).getTime()
    );
}

export function getUserById(userId: string): { nickname: string } | null {
  // 从书籍中查找卖家信息
  const books = getBooks();
  const book = books.find((b) => b.seller_id === userId);
  if (book) {
    return { nickname: book.seller_nickname };
  }
  
  // 从会话中查找
  const conversations = getConversations();
  const conv = conversations.find(
    (c) => c.buyer_id === userId || c.seller_id === userId
  );
  if (conv) {
    if (conv.buyer_id === userId) {
      return { nickname: conv.buyer_nickname };
    }
    return { nickname: conv.seller_nickname };
  }
  
  return null;
}
