"use client";
import { User, Usage, Subscription } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";

import axios from "axios";

export type TUser = User & {
  usage?: Usage | null;
  subscription?: Subscription | null;
};

export interface TUserContext {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
  isLoading: boolean;
}

export const UserContext = createContext<TUserContext | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = (user: TUser | null) => {
    setUserState(user);
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  };

  useEffect(() => {
    // 1. Try session storage for immediate UI
    const localUser = sessionStorage.getItem("user");
    if (localUser) {
      setUserState(JSON.parse(localUser));
    }

    // 2. Verify with backend & restore from cookie if session storage is empty
    axios.get("/api/user/me")
      .then(res => {
        if (res.data.user) {
          setUser(res.data.user);
        }
      })
      .catch(() => {
        // If API fails (e.g. no cookie), clear local state
        if (!localUser) setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function UseUser() {
  const context = useContext(UserContext);

  if (!context) throw new Error("useUser must be used within UserProvider");

  return context;
}
