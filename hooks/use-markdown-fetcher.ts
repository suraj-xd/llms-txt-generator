"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { fetchMarkdownFromUrl, normalizeURL, isValidURL, reconstructUrlFromParams } from "@/lib/utils";
import { loadingMessages } from "@/lib/constants";

export function useMarkdownFetcher() {
  const [url, setUrl] = useState("");
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();

  // Handle URL from route parameters
  useEffect(() => {
    const urlFromParams = params?.url;
    if (urlFromParams) {
      const reconstructedUrl = reconstructUrlFromParams(urlFromParams);
      
      if (reconstructedUrl) {
        setUrl(reconstructedUrl);
        // Auto-fetch the content
        handleAutoFetch(reconstructedUrl);
      } else {
        // Invalid URL format, show error and redirect to home
        setError("Invalid URL format. Please provide a valid URL.");
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    }
  }, [params, router]);

  const handleAutoFetch = async (targetUrl: string) => {
    setIsLoading(true);
    setMarkdown(null);
    setError(null);

    const { data, error: fetchError } = await fetchMarkdownFromUrl(targetUrl);

    setIsLoading(false);
    if (fetchError) {
      setError(fetchError);
      // On error, redirect to home after showing error briefly
      if (params?.url) {
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    } else if (data) {
      setMarkdown(data);
    }
  };

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
    
    if (params?.url) {
        await handleAutoFetch(normalizedUrl);
    } else {
        const safeUrl = normalizedUrl.replace(/^https?:\/\//, '');
        router.push(`/${safeUrl}`);
    }
  };
  
  return {
    url,
    setUrl,
    markdown,
    isLoading,
    error,
    loadingMessageIndex,
    handleSubmit,
    isDynamicPage: !!params?.url,
  };
} 