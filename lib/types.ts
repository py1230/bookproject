// 用户类型
export interface User {
  user_id: string;
  student_id: string;
  nickname: string;
  created_at: string;
}

// 书籍类型
export interface Book {
  id: string;
  title: string;
  publisher: string;
  version: string;
  image: string;
  seller_id: string;
  seller_nickname: string;
  status: "在售" | "已售";
  price?: string;
  description?: string;
  created_at: string;
}

// 消息类型
export interface Message {
  id: string;
  book_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
}

// 会话类型
export interface Conversation {
  id: string;
  book_id: string;
  book_title: string;
  buyer_id: string;
  buyer_nickname: string;
  seller_id: string;
  seller_nickname: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}
