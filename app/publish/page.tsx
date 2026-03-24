"use client";

import { UserProvider } from "@/contexts/user-context";
import { UserOnboarding } from "@/components/user-onboarding";
import { Navbar } from "@/components/navbar";
import { PublishForm } from "@/components/publish-form";

export default function PublishPage() {
  return (
    <UserProvider>
      <UserOnboarding />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <PublishForm />
        </main>
      </div>
    </UserProvider>
  );
}
