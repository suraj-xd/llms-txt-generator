import type React from "react";
import type { Metadata } from "next";
import {
  Instrument_Sans as Instrumental_Sans,
  Roboto_Mono,
} from "next/font/google";
import "./globals.css";
import "./markdown-prose.css"; // Ensure this is imported
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
const instrumentalSans = Instrumental_Sans({
  subsets: ["latin"],
  variable: "--font-instrumental-sans",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  weight: ["400", "700"],
  style: ["normal"],
});

export const metadata: Metadata = {
  title: "LLMs.txt Generator Free",
  description: "Generate consolidated text files from websites",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: ["llms.txt", "llms.txt generator", "llms.txt free", "llms.txt online", "llms.txt tool", "llms.txt website", "llms.txt app", "llms.txt generator free", "llms.txt generator online", "llms.txt generator tool", "llms.txt generator website", "llms.txt generator app"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentalSans.variable} ${robotoMono.variable}`}
    >
      <body className="font-sans dark">
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        > */}
          {children}
          <Toaster />
          <Analytics />
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
