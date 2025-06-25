import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const urlToFetch = searchParams.get("url");
  const apiUrl = process.env.CRAWLER_API_URL;
  if (!urlToFetch) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  let fullUrl = urlToFetch;
  if (!urlToFetch.startsWith("http://") && !urlToFetch.startsWith("https://")) {
    fullUrl = `https://${urlToFetch}`;
  }

  try {
    // Validate URL format
    new URL(fullUrl);
  } catch (_) {
    return NextResponse.json(
      { error: "Invalid URL format provided." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${apiUrl}/${fullUrl}`, {
      method: "GET",
      headers: {
        Accept: "text/markdown; charset=utf-8",
        // Jina might also use 'X-Return-Format': 'markdown' or other headers.
        // Check their documentation if 'Accept' alone isn't sufficient.
      },
    });

    if (!response.ok) {
      // Try to get error text from Jina, but it might be HTML
      const errorText = await response.text();
      console.error(
        `Jina API error: ${response.status} ${response.statusText}`,
        errorText.substring(0, 500)
      );
      // Return a generic error or try to parse Jina's error if it's structured
      return NextResponse.json(
        {
          error: `Failed to fetch from Jina API. Status: ${
            response.status
          }. ${errorText.substring(0, 200)}`,
        },
        { status: response.status }
      );
    }

    const markdownText = await response.text();

    if (!markdownText) {
      return NextResponse.json(
        { error: "Empty response from Jina API." },
        { status: 500 }
      );
    }

    return NextResponse.json({ text: markdownText });
  } catch (error: any) {
    console.error("Error in /api/reader:", error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
