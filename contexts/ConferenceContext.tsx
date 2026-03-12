"use client";
import { type Conference } from "@/hooks/use-conference";
import { createContext, useContext, useEffect, useState } from "react";

export interface TConferenceContext {
  conference: Conference | null;
  setConferenceContext: (conference: Conference | null) => void;
}

const conferenceContext = createContext<TConferenceContext | null>(null);

export function ConferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conference, setConferenceState] = useState<Conference | null>(null);
  const setConference = (conference: Conference | null) => {
    setConferenceState(conference);
    sessionStorage.setItem("conference", JSON.stringify(conference));
  };
  useEffect(() => {
    const storedConference = sessionStorage.getItem("conference");
    if (storedConference) {
      setConferenceState(JSON.parse(storedConference));
    }
  }, []);
  return (
    <conferenceContext.Provider
      value={{ conference, setConferenceContext: setConference }}
    >
      {children}
    </conferenceContext.Provider>
  );
}

export function UseConference() {
  const context = useContext(conferenceContext);
  if (!context)
    throw new Error("UseConference must be used within ConferenceProvider");
  return context;
}
