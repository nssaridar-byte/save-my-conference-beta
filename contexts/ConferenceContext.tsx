"use client";
import { type Conference } from "@/hooks/use-conference";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export interface TConferenceContext {
  conference: Conference | null;
  setConferenceContext: (conference: Conference | null) => void;
  conferences: Conference[];
  setConferences: (conferences: Conference[]) => void;
}

const conferenceContext = createContext<TConferenceContext | null>(null);

export function ConferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conference, setConferenceState] = useState<Conference | null>(null);
  const [conferences, setConferencesState] = useState<Conference[]>([]);

  const setConference = (conference: Conference | null) => {
    setConferenceState(conference);
    sessionStorage.setItem("conference", JSON.stringify(conference));
  };
  const setConferences = (conferences: Conference[]) => {
    setConferencesState(conferences);
    sessionStorage.setItem("conferences", JSON.stringify(conferences));
  };

  const fetchConferences = async () => {
    axios
      .get("/api/conferences")
      .then((res) => {
        const fetchedConferences = res.data.conferences || [];
        setConferences(fetchedConferences);
        
        // If the current active conference is not in the new list, or list is empty, clear it
        if (fetchedConferences.length === 0) {
          setConference(null);
        } else if (conference && !fetchedConferences.find((c: Conference) => c.id === conference.id)) {
          setConference(fetchedConferences[0]);
        }

        sessionStorage.setItem(
          "conferences",
          JSON.stringify(fetchedConferences),
        );
      })
      .catch((err) => {
        if (err.response?.status == 404) {
          setConferences([]);
          setConference(null);
        }
      });
  };
  useEffect(() => {
    const storedConference = sessionStorage.getItem("conference");
    if (storedConference) {
      setConferenceState(JSON.parse(storedConference));
    }
    fetchConferences();
  }, []);

  return (
    <conferenceContext.Provider
      value={{
        conference,
        setConferenceContext: setConference,
        conferences,
        setConferences,
      }}
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
