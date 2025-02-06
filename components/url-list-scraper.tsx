import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { StatusPanel } from "./status-panel"
import { FilePreview } from "./file-preview"
import { StatsPanel } from "./stats-panel"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface UrlListScraperProps {
  config: {
    outputDir: string
    batchSize: number
    rateLimit: number
    maxConcurrentRequests: number
    crawlTimeout: number
    userAgent: string
  }
}

export function UrlListScraper({ config }: UrlListScraperProps) {
  const [urls, setUrls] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processedUrls, setProcessedUrls] = useState(0)
  const [statusItems, setStatusItems] = useState<
    Array<{
      url: string
      status: "pending" | "success" | "error"
      message?: string
      files?: {
        json?: string
        markdown?: string
      }
    }>
  >([])
  const [files, setFiles] = useState<
    Array<{
      name: string
      type: "json" | "markdown"
      content: string
      path: string
    }>
  >([])
  const [stats, setStats] = useState({
    totalTime: 0,
    processedFiles: 0,
    errors: 0,
    successRate: 0,
  })
  const { toast } = useToast()
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleStartScraping = async () => {
    if (isProcessing) return

    const urlList = urls.split("\n").filter((url) => url.trim() !== "")
    if (urlList.length === 0) {
      toast({
        title: "No URLs provided",
        description: "Please enter at least one URL to scrape.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setProcessedUrls(0)
    setStatusItems([])
    setFiles([])
    setStats({
      totalTime: 0,
      processedFiles: 0,
      errors: 0,
      successRate: 0,
    })

    abortControllerRef.current = new AbortController()
    const startTime = Date.now()

    try {
      for (let i = 0; i < urlList.length; i++) {
        const url = urlList[i].trim()
        setStatusItems((prev) => [...prev, { url, status: "pending", message: "Processing..." }])

        await new Promise((resolve) => setTimeout(resolve, config.rateLimit * 1000))

        try {
          const response = await fetch("/api/scrape-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, config }),
            signal: abortControllerRef.current.signal,
          })

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

          const result = await response.json()

          setStatusItems((prev) =>
            prev.map((item) =>
              item.url === url
                ? {
                    ...item,
                    status: "success",
                    message: "Successfully scraped",
                    files: { json: result.jsonPath, markdown: result.markdownPath },
                  }
                : item,
            ),
          )

          setFiles((prev) => [
            ...prev,
            {
              name: `${url.replace(/[^a-z0-9]/gi, "_")}.json`,
              type: "json",
              content: JSON.stringify(result.rawData, null, 2),
              path: result.jsonPath,
            },
            {
              name: `${url.replace(/[^a-z0-9]/gi, "_")}.md`,
              type: "markdown",
              content: result.markdownContent,
              path: result.markdownPath,
            },
          ])

          setStats((prev) => ({
            ...prev,
            processedFiles: prev.processedFiles + 2,
          }))
        } catch (error) {
          if (error.name === "AbortError") {
            setStatusItems((prev) =>
              prev.map((item) => (item.url === url ? { ...item, status: "error", message: "Scraping aborted" } : item)),
            )
          } else {
            setStatusItems((prev) =>
              prev.map((item) => (item.url === url ? { ...item, status: "error", message: error.message } : item)),
            )
            setStats((prev) => ({ ...prev, errors: prev.errors + 1 }))
          }
        }

        setProcessedUrls(i + 1)
        setProgress(((i + 1) / urlList.length) * 100)
      }
    } finally {
      const endTime = Date.now()
      const totalTime = (endTime - startTime) / 1000 // Convert to seconds
      const successfulUrls = statusItems.filter((item) => item.status === "success").length
      const successRate = (successfulUrls / urlList.length) * 100

      setStats((prev) => ({
        ...prev,
        totalTime,
        successRate,
      }))

      setIsProcessing(false)
      abortControllerRef.current = null

      toast({
        title: "Scraping Complete",
        description: `Processed ${urlList.length} URLs in ${totalTime.toFixed(2)} seconds`,
      })
    }
  }

  const handleStopScraping = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsProcessing(false)
      toast({
        title: "Scraping Stopped",
        description: "The scraping process has been manually stopped.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="urls">URLs to Scrape (one per line)</Label>
          <Textarea
            id="urls"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            placeholder="https://example.com&#10;https://example.org&#10;https://example.net"
            className="h-32 bg-gray-700 text-gray-100 border-gray-600"
          />
        </div>
        <div className="flex gap-4">
          <Button onClick={handleStartScraping} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700">
            {isProcessing ? "Processing..." : "Start Scraping"}
          </Button>
          {isProcessing && (
            <Button onClick={handleStopScraping} variant="destructive">
              Stop Scraping
            </Button>
          )}
        </div>
      </div>

      <StatsPanel
        totalTime={stats.totalTime}
        processedFiles={stats.processedFiles}
        errors={stats.errors}
        successRate={stats.successRate}
      />

      <div className="grid grid-cols-2 gap-6">
        <StatusPanel
          items={statusItems}
          progress={progress}
          totalUrls={urls.split("\n").filter((url) => url.trim() !== "").length}
          processedUrls={processedUrls}
        />
        <FilePreview files={files} />
      </div>
    </div>
  )
}

