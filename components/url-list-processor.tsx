import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { StatusPanel } from "./status-panel"
import { FilePreview } from "./file-preview"
import { StatsPanel } from "./stats-panel"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface UrlListProcessorProps {
  config: {
    outputDir: string
    rateLimit: number
    maxConcurrentRequests: number
    crawlTimeout: number
  }
}

export function UrlListProcessor({ config }: UrlListProcessorProps) {
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
  >([
    {
      name: "assembly-manufacturing.json",
      type: "json",
      content: JSON.stringify({ key: "value" }),
      path: "/processed_data/assembly-manufacturing.json"
    },
    {
      name: "sheet-metal-processing.md",
      type: "markdown",
      content: "# Markdown Content",
      path: "/processed_data/sheet-metal-processing.md"
    },
    {
      name: "cnc-machining.json",
      type: "json",
      content: JSON.stringify({ key: "value" }),
      path: "/processed_data/cnc-machining.json"
    },
    {
      name: "die-casting.md",
      type: "markdown",
      content: "# Markdown Content",
      path: "/processed_data/die-casting.md"
    },
    {
      name: "materials-overview.json",
      type: "json",
      content: JSON.stringify({ key: "value" }),
      path: "/processed_data/materials-overview.json"
    }
  ])
  const [stats, setStats] = useState({
    totalTime: 45,
    processedFiles: 8,
    errors: 2,
    successRate: 75,
  })
  const { toast } = useToast()
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleStartProcessing = () => {
    if (urls.trim() === "") {
      toast({
        title: "No URLs provided",
        description: "Please enter at least one URL to process.",
        variant: "destructive",
      })
      return
    }

    abortControllerRef.current = new AbortController()
    setIsProcessing(true)
    setProgress(0)
    setProcessedUrls(0)
    setStatusItems([])
    setFiles([])

    const urlsToProcess = urls.split("\n").filter((url) => url.trim() !== "")

    const processUrl = async (url: string) => {
      setStatusItems((prevStatusItems) => [...prevStatusItems, { url, status: "pending" }])

      try {
        // Simulate processing
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const randomNumber = Math.random()
        const success = randomNumber > 0.2

        if (success) {
          setStatusItems((prevStatusItems) =>
            prevStatusItems.map((item) =>
              item.url === url ? { ...item, status: "success", files: { json: JSON.stringify({ url: url }) } } : item,
            ),
          )
          setFiles((prevFiles) => [
            ...prevFiles,
            {
              name: `${url}.json`,
              type: "json",
              content: JSON.stringify({ url: url }),
              path: `output/${url}.json`,
            },
          ])
        } else {
          setStatusItems((prevStatusItems) =>
            prevStatusItems.map((item) =>
              item.url === url ? { ...item, status: "error", message: "Failed to process" } : item,
            ),
          )
        }
        setProcessedUrls((prevProcessedUrls) => prevProcessedUrls + 1)
        setProgress(Math.round((processedUrls / urlsToProcess.length) * 100))
      } catch (error) {
        setStatusItems((prevStatusItems) =>
          prevStatusItems.map((item) =>
            item.url === url ? { ...item, status: "error", message: "Failed to process" } : item,
          ),
        )
      }
    }

    for (const url of urlsToProcess) {
      processUrl(url)
    }
  }

  const handleStopProcessing = () => {
    abortControllerRef.current?.abort()
    setIsProcessing(false)
    toast({
      title: "Processing stopped",
      description: "The processing of URLs has been stopped.",
      variant: "info",
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="urls">URLs to Process (one per line)</Label>
          <Textarea
            id="urls"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            placeholder="https://example.com&#10;https://example.org&#10;https://example.net"
            className="h-32 bg-gray-700 text-gray-100 border-gray-600"
          />
        </div>
        <div className="flex gap-4">
          <Button onClick={handleStartProcessing} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700">
            {isProcessing ? "Processing..." : "Start Processing"}
          </Button>
          {isProcessing && (
            <Button onClick={handleStopProcessing} variant="destructive">
              Stop Processing
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
