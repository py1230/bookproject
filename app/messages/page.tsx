"use client";

import { UserProvider } from "@/contexts/user-context";
import { UserOnboarding } from "@/components/user-onboarding";
import { Navbar } from "@/components/navbar";
import { MessagesList } from "@/components/messages-list";

export default function MessagesPage() {
  return (
    <UserProvider>
      <UserOnboarding />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <MessagesList />
        </main>
      </div>
    </UserProvider>
  );
}
