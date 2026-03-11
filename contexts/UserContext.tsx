"use client"
import { User } from "@prisma/client";
import { createContext, useContext, useState } from "react";

export interface TUserContext {
    user: User | null,
    setUser: (user: User | null) => void,
}

export const UserContext = createContext<TUserContext | null>(null)



export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUserState] = useState<User | null>(null)
    const setUser = (user: User | null) => {
        setUserState(user)
        sessionStorage.setItem("user", JSON.stringify(user))
    }
    return <UserContext.Provider value={{ user, setUser }}>
        {children}
    </UserContext.Provider>
}

export function UseUser() {
    const context = useContext(UserContext)

    if (!context) throw new Error("useUser must be used within UserProvider")

    return context
}