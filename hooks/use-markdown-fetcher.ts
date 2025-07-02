"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchMarkdownFromUrl, normalizeURL, isValidURL } from "@/lib/utils";
import { loadingMessages } from "@/lib/constants";

export function useMarkdownFetcher() {
  const [url, setUrl] = useState("");
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const { toast } = useToast();

  // Cycle through loading messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingMessageIndex(0);
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => {
          const nextIndex = prev + 1;
          return nextIndex < loadingMessages.length ? nextIndex : prev;
        });
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const handleFetch = async (targetUrl: string) => {
    setIsLoading(true);
    setMarkdown(null);
    setError(null);

    const { data, error: fetchError } = await fetchMarkdownFromUrl(targetUrl);

    setIsLoading(false);
    if (fetchError) {
      setError(fetchError);
    } else if (data) {
      setMarkdown(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) {
      setError("Please enter a URL.");
      return;
    }

    // Normalize and validate the URL before submission
    const normalizedUrl = normalizeURL(url);
    if (!isValidURL(normalizedUrl)) {
      setError("Please enter a valid URL format.");
      return;
    }

    // Update the URL with the normalized version
    setUrl(normalizedUrl);
    
    // Show a toast if the URL was normalized
    if (url !== normalizedUrl) {
      toast({
        title: "URL Normalized",
        description: `Cleaned up URL: ${normalizedUrl}`,
      });
    }
    
    // Fetch the content without any routing
    await handleFetch(normalizedUrl);
  };
  
  return {
    url,
    setUrl,
    markdown,
    isLoading,
    error,
    loadingMessageIndex,
    handleSubmit,
    isDynamicPage: false, // Always false since we're not using dynamic routing
  };
} 