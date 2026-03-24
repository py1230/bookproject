"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "@/lib/types";
import { getUser, createUser } from "@/lib/storage";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (studentId: string, nickname: string) => void;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const existingUser = getUser();
    setUser(existingUser);
    setIsLoading(false);
  }, []);

  const login = (studentId: string, nickname: string) => {
    const newUser = createUser(studentId, nickname);
    setUser(newUser);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
