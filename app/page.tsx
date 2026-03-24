"use client";

import { UserProvider } from "@/contexts/user-context";
import { UserOnboarding } from "@/components/user-onboarding";
import { Navbar } from "@/components/navbar";
import { HomePage } from "@/components/home-page";

export default function Page() {
  return (
    <UserProvider>
      <UserOnboarding />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HomePage />
        </main>
      </div>
    </UserProvider>
  );
}
