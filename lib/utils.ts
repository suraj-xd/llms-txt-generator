import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchMarkdownFromUrl(
  url: string
): Promise<{ data: string | null; error: string | null }> {
  try {
    const response = await fetch(`/api/reader?url=${encodeURIComponent(url)}`);
    const result = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: result.error || `HTTP error! Status: ${response.status}`,
      };
    }
    return { data: result.text, error: null };
  } catch (e: any) {
    console.error("Client fetch error:", e);
    let errorMessage = "An unexpected error occurred while fetching data.";
    if (e instanceof SyntaxError) {
      errorMessage =
        "Received an invalid response from the server. Please try again.";
    } else if (e.message) {
      errorMessage = e.message;
    }
    return { data: null, error: errorMessage };
  }
}

// URL normalization and validation functions
export const normalizeURL = (rawUrl: string): string => {
  if (!rawUrl.trim()) return '';
  
  let cleanUrl = rawUrl.trim();
  
  // Handle cases like "xyz.com/https://example.com" 
  if (cleanUrl.includes('/http')) {
    const parts = cleanUrl.split('/http');
    if (parts.length > 1) {
      cleanUrl = parts[1].replace(/^s?:\/\//, '');
    }
  }
  
  // Remove any protocol if it exists
  cleanUrl = cleanUrl.replace(/^https?:\/\//, '');
  cleanUrl = cleanUrl.replace(/^www\./, '');
  
  // Add https protocol
  return `https://${cleanUrl}`;
};

export const isValidURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') && 
           urlObj.hostname.includes('.');
  } catch {
    return false;
  }
};
