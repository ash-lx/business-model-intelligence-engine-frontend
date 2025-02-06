import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { StatusPanel } from "./status-panel"
import { FilePreview } from "./file-preview"
import { StatsPanel } from "./stats-panel"

export function SitemapScraper({ config }: { config: any }) {
  const [url, setUrl] = useState(config.websiteUrl)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  // Demo data
  const [statusItems] = useState([
    {
      url: "https://example.com",
      status: "success" as const,
      message: "Successfully processed",
      files: { json: "example.json", markdown: "example.md" },
    },
    {
      url: "https://example.com/about",
      status: "pending" as const,
      message: "Processing page content...",
    },
    {
      url: "https://example.com/contact",
      status: "error" as const,
      message: "Failed to fetch page: 404 Not Found",
    },
  ])

  const [files] = useState([
    {
      name: "sitemap.json",
      type: "json" as const,
      content: JSON.stringify({ url: "https://example.com" }, null, 2),
      path: "/scraped_data/raw/sitemap.json",
    },
    {
      name: "content.md",
      type: "markdown" as const,
      content: "# Example Content\n\nThis is a markdown file.",
      path: "/scraped_data/markdown/content.md",
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Website URL"
          className="bg-gray-700 text-gray-100 border-gray-600"
        />
        <Button onClick={() => setIsProcessing(true)} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700">
          {isProcessing ? "Processing..." : "Start Scraping"}
        </Button>
      </div>

      <StatsPanel totalTime={125} processedFiles={8} errors={1} successRate={88.9} />

      <div className="grid grid-cols-2 gap-6">
        <StatusPanel items={statusItems} progress={66} totalUrls={3} processedUrls={2} />
        <FilePreview files={files} />
      </div>
    </div>
  )
}

