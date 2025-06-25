'use client';
 
import * as React from 'react';
import { useTheme } from 'next-themes';
import { Download, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
 
import { cn } from '@/lib/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsContents,
  type TabsProps,
} from '@/components/animate-ui/components/tabs';
import { CopyButton } from '@/components/animate-ui/buttons/copy';
 import { FileMdIcon, FileTxtIcon } from '@phosphor-icons/react';
type CodeTabsProps = {
  codes: Record<string, string>;
  lang?: string;
  themes?: {
    light: string;
    dark: string;
  };
  copyButton?: boolean;
  downloadButton?: boolean;
  downloadFilename?: string;
  showRaw?: boolean;
  onCopy?: (content: string) => void;
  onDownload?: (content: string, filename: string) => void;
} & Omit<TabsProps, 'children' | 'onCopy'>;
 
function CodeTabs({
  codes,
  lang = 'markdown',
  themes = {
    light: 'github-light',
    dark: 'github-dark',
  },
  className,
  defaultValue,
  value,
  onValueChange,
  copyButton = true,
  downloadButton = true,
  downloadFilename = 'llms.md',
  showRaw = false,
  onCopy,
  onDownload,
  ...props
}: CodeTabsProps) {
  const { resolvedTheme } = useTheme();
  const [isDownloaded, setIsDownloaded] = React.useState(false);
 
  const [highlightedCodes, setHighlightedCodes] = React.useState<Record<
    string,
    string
  > | null>(null);
  const [selectedCode, setSelectedCode] = React.useState<string>(
    value ?? defaultValue ?? Object.keys(codes)[0] ?? '',
  );
 
  React.useEffect(() => {
    async function loadHighlightedCode() {
      try {
        const { codeToHtml } = await import('shiki');
        const newHighlightedCodes: Record<string, string> = {};
 
        for (const [command, val] of Object.entries(codes)) {
          if (command === 'raw') {
            // For raw content, don't highlight
            newHighlightedCodes[command] = val;
          } else if (command === 'rendered') {
            // For rendered content, keep the raw markdown (we'll render it with ReactMarkdown)
            newHighlightedCodes[command] = val;
          } else {
            const highlighted = await codeToHtml(val, {
              lang,
              themes: {
                light: themes.light,
                dark: themes.dark,
              },
              defaultColor: resolvedTheme === 'dark' ? 'dark' : 'light',
            });
            newHighlightedCodes[command] = highlighted;
          }
        }
 
        setHighlightedCodes(newHighlightedCodes);
      } catch (error) {
        console.error('Error highlighting codes', error);
        setHighlightedCodes(codes);
      }
    }
    loadHighlightedCode();
  }, [resolvedTheme, lang, themes.light, themes.dark, codes, showRaw]);

  const handleDownload = (format: 'md' | 'txt') => {
    const content = codes[selectedCode];
    if (!content) return;
    
    try {
      const mimeType = format === 'md' ? "text/markdown;charset=utf-8" : "text/plain;charset=utf-8";
      const filename = format === 'md' ? downloadFilename : downloadFilename.replace('.md', '.txt');
      
      const blob = new Blob([content], { type: mimeType });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 2000);
      onDownload?.(content, filename);
    } catch (error) {
      console.error('Error downloading file', error);
    }
  };

  const handleCopyClick = (content: string) => {
    onCopy?.(content);
  };
 
  return (
    <Tabs
      data-slot="install-tabs"
      className={cn(
        'w-full gap-0 bg-[#111] rounded-xl border border-gray-800 dark:border-gray-700 overflow-hidden shadow-2xl',
        className,
      )}
      {...props}
      value={selectedCode}
      onValueChange={(val) => {
        setSelectedCode(val);
        onValueChange?.(val);
      }}
    >
      <TabsList
        data-slot="install-tabs-list"
        className="w-full relative justify-between bg-[#111] rounded-none h-12 border-b border-gray-800 dark:border-gray-700 text-gray-200 py-0 px-4"
        activeClassName="rounded-none shadow-none bg-transparent after:content-[''] after:absolute after:inset-x-0 after:h-0.5 after:bottom-0 after:bg-white dark:after:bg-gray-100 after:rounded-t-full"
      >
        <div className="flex gap-x-6 h-full">
          {highlightedCodes &&
            Object.keys(highlightedCodes).map((code) => (
              <TabsTrigger
                key={code}
                value={code}
                className="text-gray-400 font-mono text-sm data-[state=active]:text-white hover:text-gray-200 px-0 font-medium uppercase"
              >
                {code}
              </TabsTrigger>
            ))}
        </div>
 
        <div className="flex items-center gap-2">
          {copyButton && highlightedCodes && (
            <CopyButton
              content={codes[selectedCode]}
              size="sm"
              variant="ghost"
              className="bg-transparent hover:bg-white/10 text-gray-300 hover:text-white border-gray-600 hover:border-gray-500"
              onCopy={() => handleCopyClick(codes[selectedCode])}
            />
          )}
          {downloadButton && highlightedCodes && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-transparent hover:bg-white/10 text-gray-300 hover:text-white border-gray-600 hover:border-gray-500 h-6 px-2 gap-1"
                >
                  {isDownloaded ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Download className="h-3 w-3" />
                  )}
                  <ChevronDown className="h-2 w-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#111] border-gray-700">
                <DropdownMenuItem 
                  onClick={() => handleDownload('md')}
                  className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <FileMdIcon className="h-3 w-3 mr-2" />
                  Download as .md
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDownload('txt')}
                  className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <FileTxtIcon className="h-3 w-3 mr-2" />
                  Download as .txt
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </TabsList>
      <TabsContents data-slot="install-tabs-contents">
        {highlightedCodes &&
          Object.entries(highlightedCodes).map(([code, val]) => (
            <TabsContent
              data-slot="install-tabs-content"
              key={code}
              className="w-full text-sm flex items-start p-6 overflow-auto bg-[#111] text-gray-100 min-h-[500px] max-h-[600px]"
              value={code}
            >
              {code === 'rendered' ? (
                <div className="w-full prose prose-invert prose-sm max-w-none [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_p]:text-gray-200 [&_li]:text-gray-200 [&_a]:text-blue-400 [&_strong]:text-white [&_em]:text-gray-300 [&_code]:text-gray-100 [&_code]:bg-gray-800 [&_pre]:bg-gray-800 [&_pre]:border [&_pre]:border-gray-700">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{val}</ReactMarkdown>
                </div>
              ) : code === 'raw' ? (
                <pre className="w-full font-mono text-sm text-gray-100 whitespace-pre-wrap break-words p-0 m-0">
                  <code>{val}</code>
                </pre>
              ) : (
                <div
                  className="w-full [&>pre]:!bg-transparent [&>pre]:!border-none [&>pre]:text-gray-100 [&>pre]:p-0 [&>pre]:m-0 [&_code]:!bg-transparent [&_code]:!text-gray-100 [&_code]:!text-[13px] [&_code]:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: val }}
                />
              )}
            </TabsContent>
          ))}
      </TabsContents>
    </Tabs>
  );
}
 
export { CodeTabs, type CodeTabsProps };