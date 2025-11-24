
const TAVILY_API_KEY = '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';

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  raw_content?: string;
}

export const crawlCompanyWebsite = async (companyName: string, websiteUrl: string): Promise<string> => {
  if (!websiteUrl) return "";

  try {
    // We try to extract the hostname to focus the search
    let domain = '';
    try {
        domain = new URL(websiteUrl).hostname;
    } catch (e) {
        // If URL is invalid, we proceed without domain restriction, just query
    }

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        // We search for the company and specifically look for contact info to ensure the "crawl" is useful for leads
        query: `${companyName} contact email about us team`,
        include_domains: domain ? [domain] : undefined,
        search_depth: "advanced",
        include_text: true, 
        max_results: 2, // We grab the top 2 pages (usually Home + Contact)
      }),
    });

    if (!response.ok) {
        console.warn(`Tavily crawl failed for ${companyName}:`, response.statusText);
        return "";
    }

    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
        return "";
    }

    // Combine the content from the results
    const combinedContent = data.results
        .map((r: TavilySearchResult) => `Source: ${r.url}\nContent: ${r.content}`)
        .join('\n\n---\n\n');

    return combinedContent;

  } catch (error) {
    console.error("Error calling Tavily:", error);
    return "";
  }
};
