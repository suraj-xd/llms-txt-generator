"use client";

import { useMarkdownFetcher } from "@/hooks/use-markdown-fetcher";
import { MarkdownFetcherUI } from "@/components/markdown-fetcher/markdown-fetcher-ui";

export default function MarkdownFetcherPage() {
  const {
    url,
    setUrl,
    markdown,
    isLoading,
    error,
    loadingMessageIndex,
    handleSubmit,
    isDynamicPage,
  } = useMarkdownFetcher();

  return (
    <MarkdownFetcherUI
      url={url}
      setUrl={setUrl}
      markdown={markdown}
      isLoading={isLoading}
      error={error}
      loadingMessageIndex={loadingMessageIndex}
      handleSubmit={handleSubmit}
      isDynamicPage={isDynamicPage}
    />
  );
}
