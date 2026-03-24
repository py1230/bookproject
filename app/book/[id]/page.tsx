"use client";

import { use } from "react";
import { UserProvider } from "@/contexts/user-context";
import { UserOnboarding } from "@/components/user-onboarding";
import { Navbar } from "@/components/navbar";
import { BookDetail } from "@/components/book-detail";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export default function BookPage({ params }: BookPageProps) {
  const { id } = use(params);

  return (
    <UserProvider>
      <UserOnboarding />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <BookDetail bookId={id} />
        </main>
      </div>
    </UserProvider>
  );
}
