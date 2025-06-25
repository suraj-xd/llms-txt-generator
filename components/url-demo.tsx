"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

// Same normalization functions as in the main component
const normalizeURL = (rawUrl: string): string => {
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

const isValidURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') && 
           urlObj.hostname.includes('.');
  } catch {
    return false;
  }
};

export default function URLDemo() {
  const [testUrl, setTestUrl] = useState('');
  const [result, setResult] = useState<{
    original: string;
    normalized: string;
    isValid: boolean;
  } | null>(null);

  const handleTest = () => {
    if (!testUrl.trim()) return;
    
    const normalized = normalizeURL(testUrl);
    const isValid = isValidURL(normalized);
    
    setResult({
      original: testUrl,
      normalized,
      isValid
    });
  };

  const exampleUrls = [
    'surajgaud.com',
    'www.example.com',
    'http://test.org/path',
    'https://github.com/user/repo',
    'xyz.com/https://surajgaud.com',
    'example.com/page?param=value',
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>URL Normalization Demo</CardTitle>
        <CardDescription>
          Test how different URL formats get normalized and validated
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            placeholder="Enter a URL to test..."
            className="flex-1"
          />
          <Button onClick={handleTest} disabled={!testUrl.trim()}>
            Test
          </Button>
        </div>

        {result && (
          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Original:</span>
              <code className="text-sm bg-background px-2 py-1 rounded">
                {result.original}
              </code>
            </div>
            
            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Normalized:</span>
              <code className="text-sm bg-background px-2 py-1 rounded">
                {result.normalized}
              </code>
              <Badge variant={result.isValid ? "default" : "destructive"}>
                {result.isValid ? (
                  <><CheckCircle className="w-3 h-3 mr-1" /> Valid</>
                ) : (
                  <><XCircle className="w-3 h-3 mr-1" /> Invalid</>
                )}
              </Badge>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Try these examples:</h4>
          <div className="flex flex-wrap gap-2">
            {exampleUrls.map((url, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setTestUrl(url)}
                className="text-xs"
              >
                {url}
              </Button>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p><strong>What the normalizer does:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Adds https:// protocol if missing</li>
            <li>Removes www. prefix for consistency</li>
            <li>Handles malformed URLs like "xyz.com/https://example.com"</li>
            <li>Validates the final URL format</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 