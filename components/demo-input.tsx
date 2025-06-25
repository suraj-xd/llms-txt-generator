"use client";

import { PlaceholdersAndVanishInput } from "./placeholders-and-vanish-input";

interface PlaceholdersAndVanishInputDemoProps {
  url: string;
  setUrl: (url: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function PlaceholdersAndVanishInputDemo({
  url,
  setUrl,
  onSubmit,
  isLoading,
}: PlaceholdersAndVanishInputDemoProps) {
  const placeholders = [
    "https://vercel.com/blog/how-vercel-is-improving-dx-for-frontend-developers",
    "https://github.com/vercel/next.js",
    "https://www.smashingmagazine.com/2023/02/container-queries-guide/",
    "https://example.com/your-article",
    "Enter any website URL to fetch its markdown...",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <div className="h-fit mt-32 mb-10 flex flex-col justify-center items-center px-4">
      <h2 className="mb-5 text-xl text-center sm:text-5xl dark:text-white text-white">
        <p>
          <span className="text-orange-500 font-medium">LLMs.txt</span> generator
        </p>
      </h2>
      <p className="font-mono uppercase text-sm text-muted-foreground mb-10" >Generate unlimited consolidated text files from websites for free</p>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
      {!isLoading && (
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-400">
            Just paste any website URL above or append
            <code className="bg-neutral-900 text-white px-2 py-1 rounded-md">
             {`/xyz.com`}
            </code>
          </span>
        </div>
      )}
    </div>
  );
}
