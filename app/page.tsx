"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SitemapProcessor } from "@/components/sitemap-processor"
import { UrlListProcessor } from "@/components/url-list-processor"
import { LlmProcessing } from "@/components/llm-processing"
import { Sidebar } from "@/components/sidebar"

export default function Home() {
  const [config, setConfig] = useState({
    outputDir: "processed_data",
    rateLimit: 2,
    maxConcurrentRequests: 5,
    sitemapOutput: "sitemap.xml",
    summaryFile: "summary.json",
    maxRetries: 3,
    retryDelay: 5,
    crawlTimeout: 30,
  })

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar config={config} setConfig={setConfig} />
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-100">Business Model Intelligence Engine (BMIE)</h1>
        <Tabs defaultValue="sitemap" className="w-full">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="sitemap" className="data-[state=active]:bg-gray-700">
              Sitemap Processor
            </TabsTrigger>
            <TabsTrigger value="urllist" className="data-[state=active]:bg-gray-700">
              URL List Processor
            </TabsTrigger>
            <TabsTrigger value="llm" className="data-[state=active]:bg-gray-700">
              LLM Processing
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sitemap">
            <SitemapProcessor config={config} />
          </TabsContent>
          <TabsContent value="urllist">
            <UrlListProcessor config={config} />
          </TabsContent>
          <TabsContent value="llm">
            <LlmProcessing />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
