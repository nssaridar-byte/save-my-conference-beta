"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useLayoutSettings } from "@/hooks/use-layout-settings";
import { UseUser } from "../../contexts/UserContext";

export function PreferenceSync() {
  const { user } = UseUser();
  const { setTheme, theme } = useTheme();
  const { setLayoutMode, layoutMode } = useLayoutSettings();

  useEffect(() => {
    if (user) {
      if (user.theme && user.theme !== theme) {
        setTheme(user.theme);
      }
      if (user.layoutMode && user.layoutMode !== layoutMode) {
        setLayoutMode(user.layoutMode as any);
      }
    }
  }, [user, theme, layoutMode, setTheme, setLayoutMode]);

  return null;
}
