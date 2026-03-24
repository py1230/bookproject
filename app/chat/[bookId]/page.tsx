"use client";

import { use } from "react";
import { Suspense } from "react";
import { UserProvider } from "@/contexts/user-context";
import { UserOnboarding } from "@/components/user-onboarding";
import { ChatRoom } from "@/components/chat-room";

interface ChatPageProps {
  params: Promise<{ bookId: string }>;
  searchParams: Promise<{ seller?: string }>;
}

function ChatPageContent({ 
  bookId, 
  sellerId 
}: { 
  bookId: string; 
  sellerId: string | undefined;
}) {
  return (
    <UserProvider>
      <UserOnboarding />
      <ChatRoom bookId={bookId} sellerId={sellerId || ""} />
    </UserProvider>
  );
}

export default function ChatPage({ params, searchParams }: ChatPageProps) {
  const { bookId } = use(params);
  const { seller } = use(searchParams);

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ChatPageContent bookId={bookId} sellerId={seller} />
    </Suspense>
  );
}
