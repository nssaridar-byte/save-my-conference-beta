"use client";
import { User, Usage, Subscription } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";

export type TUser = User & {
  usage?: Usage | null;
  subscription?: Subscription | null;
};

export interface TUserContext {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
}

export const UserContext = createContext<TUserContext | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const setUser = (user: User | null) => {
    setUserState(user);
    sessionStorage.setItem("user", JSON.stringify(user));
  };

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      setUserState(JSON.parse(user));
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function UseUser() {
  const context = useContext(UserContext);

  if (!context) throw new Error("useUser must be used within UserProvider");

  return context;
}
