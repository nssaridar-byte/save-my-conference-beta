import type { Metadata } from "next";
import { Inter, Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConditionalLayout } from "@/components/conditional-layout";
import { UserProvider } from "../../contexts/UserContext";
import { ConferenceProvider } from "../../contexts/ConferenceContext";
import { CookieConsent } from "@/components/cookie-consent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

import { PreferenceSync } from "@/components/preference-sync";

export const metadata: Metadata = {
  title: "Save My Conference | MUN Command Center",
  description:
    "The AI-powered Model United Nations preparation and management suite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConferenceProvider>
      <UserProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${inter.variable} ${geist.variable} ${playfair.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <PreferenceSync />
              <ConditionalLayout>{children}</ConditionalLayout>
              <CookieConsent />
            </ThemeProvider>
          </body>
        </html>
      </UserProvider>
    </ConferenceProvider>
  );
}
