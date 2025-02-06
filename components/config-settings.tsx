import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type React from "react"

interface ConfigSettings {
  outputDir: string
  rateLimit: number
  maxConcurrentRequests: number
  sitemapOutput: string
  summaryFile: string
  maxRetries: number
  retryDelay: number
  crawlTimeout: number
}

export function ConfigSettings({
  config,
  setConfig,
}: {
  config: ConfigSettings
  setConfig: (config: ConfigSettings) => void
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numericFields = ["rateLimit", "maxConcurrentRequests", "maxRetries", "retryDelay", "crawlTimeout"]
    setConfig({
      ...config,
      [name]: numericFields.includes(name) ? Number(value) : value,
    })
  }

  return (
    <div className="space-y-6">
      {/* Processing Configuration */}
      <div>
        <h3 className="text-sm font-semibold text-gray-200 mb-3">Processing Configuration</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="outputDir" className="text-xs text-gray-300">
              Output Directory
            </Label>
            <Input
              id="outputDir"
              name="outputDir"
              value={config.outputDir}
              onChange={handleChange}
              className="h-8 text-sm bg-gray-700 text-gray-100 border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="rateLimit" className="text-xs text-gray-300">
              Rate Limit (seconds)
            </Label>
            <Input
              id="rateLimit"
              name="rateLimit"
              type="number"
              value={config.rateLimit}
              onChange={handleChange}
              className="h-8 text-sm bg-gray-700 text-gray-100 border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="maxConcurrentRequests" className="text-xs text-gray-300">
              Max Concurrent Requests
            </Label>
            <Input
              id="maxConcurrentRequests"
              name="maxConcurrentRequests"
              type="number"
              value={config.maxConcurrentRequests}
              onChange={handleChange}
              className="h-8 text-sm bg-gray-700 text-gray-100 border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="crawlTimeout" className="text-xs text-gray-300">
              Crawl Timeout (seconds)
            </Label>
            <Input
              id="crawlTimeout"
              name="crawlTimeout"
              type="number"
              value={config.crawlTimeout}
              onChange={handleChange}
              className="h-8 text-sm bg-gray-700 text-gray-100 border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* File Settings */}
      <div>
        <h3 className="text-sm font-semibold text-gray-200 mb-3">File Settings</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="sitemapOutput" className="text-xs text-gray-300">
              Sitemap Output
            </Label>
            <Input
              id="sitemapOutput"
              name="sitemapOutput"
              value={config.sitemapOutput}
              onChange={handleChange}
              className="h-8 text-sm bg-gray-700 text-gray-100 border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="summaryFile" className="text-xs text-gray-300">
              Summary File
            </Label>
            <Input
              id="summaryFile"
              name="summaryFile"
              value={config.summaryFile}
              onChange={handleChange}
              className="h-8 text-sm bg-gray-700 text-gray-100 border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Retry Settings */}
      <div>
        <h3 className="text-sm font-semibold text-gray-200 mb-3">Retry Settings</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="maxRetries" className="text-xs text-gray-300">
              Max Retries
            </Label>
            <Input
              id="maxRetries"
              name="maxRetries"
              type="number"
              value={config.maxRetries}
              onChange={handleChange}
              className="h-8 text-sm bg-gray-700 text-gray-100 border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="retryDelay" className="text-xs text-gray-300">
              Retry Delay (seconds)
            </Label>
            <Input
              id="retryDelay"
              name="retryDelay"
              type="number"
              value={config.retryDelay}
              onChange={handleChange}
              className="h-8 text-sm bg-gray-700 text-gray-100 border-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

