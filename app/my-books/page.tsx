"use client";

import { UserProvider } from "@/contexts/user-context";
import { UserOnboarding } from "@/components/user-onboarding";
import { Navbar } from "@/components/navbar";
import { MyBooksList } from "@/components/my-books-list";

export default function MyBooksPage() {
  return (
    <UserProvider>
      <UserOnboarding />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <MyBooksList />
        </main>
      </div>
    </UserProvider>
  );
}
