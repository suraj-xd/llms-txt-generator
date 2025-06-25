"use client";

import type React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Component as LetterGlitch } from "@/components/letter-glitch";
import { CodeTabs } from "@/components/code-tabs";
import { PlaceholdersAndVanishInputDemo } from "@/components/demo-input";
import { MotionGrid } from "@/components/motion-grid";
import { useToast } from "@/components/ui/use-toast";
import { loadingMessages, searchingFrames } from "@/lib/constants";

interface MarkdownFetcherUIProps {
  url: string;
  setUrl: (url: string) => void;
  markdown: string | null;
  isLoading: boolean;
  error: string | null;
  loadingMessageIndex: number;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isDynamicPage: boolean;
}

export function MarkdownFetcherUI({
  url,
  setUrl,
  markdown,
  isLoading,
  error,
  loadingMessageIndex,
  handleSubmit,
  isDynamicPage,
}: MarkdownFetcherUIProps) {
  const { toast } = useToast();

  const handleCopy = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Content copied to clipboard.",
        });
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: "Could not copy content to clipboard.",
        });
      });
  };

  const handleDownload = (content: string, filename: string) => {
    toast({
      title: "Downloaded!",
      description: `Content saved as ${filename}.`,
    });
  };

  return (
    <TooltipProvider>
      <LetterGlitch />
      <div className="z-10 relative">
        <div className="min-h-screen justify-between text-foreground flex flex-col items-center px-4 sm:px-6 lg:px-8 pb-10">
          <div className="w-full max-w-2xl">
            <PlaceholdersAndVanishInputDemo
              url={url}
              setUrl={setUrl}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
            {error && (
              <Alert
                variant="destructive"
                className="w-full max-w-2xl mt-6 bg-destructive/20 border-destructive text-destructive-foreground"
              >
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error}
                  {isDynamicPage && (
                    <div className="mt-2 text-sm">
                      Redirecting to home page...
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {isLoading && (
              <div className="w-full max-w-2xl mt-6 p-6 border border-border rounded-lg bg-card">
                <div className="flex items-center justify-center space-x-4">
                  <MotionGrid
                    gridSize={[5, 5]}
                    frames={searchingFrames}
                    cellClassName="size-[3px]"
                    cellActiveClassName="bg-primary"
                    cellInactiveClassName="bg-muted"
                    duration={150}
                  />
                  <span className="text-sm text-muted-foreground transition-all duration-300">
                    {loadingMessages[loadingMessageIndex]}
                  </span>
                </div>
              </div>
            )}

            {markdown && !isLoading && (
              <div className="p-0 border">
                <CodeTabs
                  codes={{
                    rendered: markdown,
                    raw: markdown,
                  }}
                  defaultValue="rendered"
                  lang="markdown"
                  onCopy={handleCopy}
                  onDownload={handleDownload}
                  downloadFilename="llms.md"
                  className="border-0 rounded-none"
                />
              </div>
            )}
          </div>

          <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                Hosted on
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline flex items-center gap-0.5 transition-colors duration-200"
                >
                  Vercel
                </a>
              </div>
              <div className="flex items-center gap-1 mt-2 md:mt-0">
                Ideated with
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    clipRule="evenodd"
                    d="M14.252 8.25h5.624c.088 0 .176.006.26.018l-5.87 5.87a1.889 1.889 0 01-.019-.265V8.25h-2.25v5.623a4.124 4.124 0 004.125 4.125h5.624v-2.25h-5.624c-.09 0-.179-.006-.265-.018l5.874-5.875a1.9 1.9 0 01.02.27v5.623H24v-5.624A4.124 4.124 0 0019.876 6h-5.624v2.25zM0 7.5v.006l7.686 9.788c.924 1.176 2.813.523 2.813-.973V7.5H8.25v6.87L2.856 7.5H0z"
                  ></path>
                </svg>
                <span className="text-muted-foreground">by</span>
                <a
                  href="https://surajgaud.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-medium hover:text-primary transition-colors duration-200"
                >
                  surajgaud
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
} 