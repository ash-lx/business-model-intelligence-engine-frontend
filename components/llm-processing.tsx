import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { FilePreview } from "./file-preview"
import { StatsPanel } from "./stats-panel"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function LlmProcessing() {
  const [apiKey, setApiKey] = useState("")
  const [inputFile, setInputFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analysisSteps, setAnalysisSteps] = useState<string[]>([
    "Step 1: Input Validation - Verify the file format and size.",
    "Step 2: Data Preprocessing - Clean and normalize the input data.",
    "Step 3: Feature Extraction - Identify key features for analysis.",
    "Step 4: Model Inference - Run the data through the LLM for insights.",
    "Step 5: Post-Processing - Format and validate the output.",
    "Step 6: Result Compilation - Generate final analysis report."
  ])
  const [finalAnalysis, setFinalAnalysis] = useState("")
  const [files, setFiles] = useState<
    Array<{
      name: string
      type: "json" | "markdown"
      content: string
      path: string
    }>
  >([
    {
      name: "analysis-summary.json",
      type: "json",
      content: JSON.stringify({ key: "value" }),
      path: "/processed_data/analysis-summary.json"
    },
    {
      name: "analysis-report.md",
      type: "markdown",
      content: "# Analysis Report",
      path: "/processed_data/analysis-report.md"
    },
    {
      name: "model-insights.json",
      type: "json",
      content: JSON.stringify({ key: "value" }),
      path: "/processed_data/model-insights.json"
    },
    {
      name: "feature-extraction.md",
      type: "markdown",
      content: "# Feature Extraction",
      path: "/processed_data/feature-extraction.md"
    }
  ])
  const [stats, setStats] = useState({
    totalTime: 31,
    processedFiles: 2,
    errors: 0,
    successRate: 26,
  })
  const { toast } = useToast()
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setInputFile(event.target.files[0])
    }
  }

  const handleStartAnalysis = async () => {
    if (isProcessing || !inputFile || !apiKey) return

    setIsProcessing(true)
    setProgress(0)
    setAnalysisSteps([])
    setFinalAnalysis("")
    setFiles([])
    setStats({
      totalTime: 0,
      processedChunks: 0,
      errors: 0,
      successRate: 0,
    })

    abortControllerRef.current = new AbortController()
    const startTime = Date.now()

    try {
      const formData = new FormData()
      formData.append("file", inputFile)
      formData.append("apiKey", apiKey)

      const response = await fetch("/api/analyze-business-model", {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const reader = response.body?.getReader()
      if (!reader) throw new Error("Response body is not readable")

      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.trim() === "") continue
          const data = JSON.parse(line)

          if (data.type === "progress") {
            setProgress(data.value)
          } else if (data.type === "step") {
            setAnalysisSteps((prev) => [...prev, data.value])
          } else if (data.type === "file") {
            setFiles((prev) => [
              ...prev,
              {
                name: data.name,
                type: data.fileType as "json" | "markdown",
                content: data.content,
                path: data.path,
              },
            ])
          } else if (data.type === "final") {
            setFinalAnalysis(data.value)
          } else if (data.type === "stats") {
            setStats(data.value)
          }
        }
      }

      toast({
        title: "Analysis Complete",
        description: "The business model analysis has been completed successfully.",
      })
    } catch (error) {
      if (error.name === "AbortError") {
        toast({
          title: "Analysis Aborted",
          description: "The analysis process has been manually stopped.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Analysis Error",
          description: error.message,
          variant: "destructive",
        })
        setStats((prev) => ({ ...prev, errors: prev.errors + 1 }))
      }
    } finally {
      setIsProcessing(false)
      abortControllerRef.current = null
    }
  }

  const handleStopAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsProcessing(false)
      toast({
        title: "Analysis Stopped",
        description: "The analysis process has been manually stopped.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">OpenAI API Key</Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your OpenAI API Key"
            className="bg-gray-700 text-gray-100 border-gray-600"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inputFile">Input Markdown File</Label>
          <Input
            id="inputFile"
            type="file"
            onChange={handleFileChange}
            accept=".md"
            className="bg-gray-700 text-gray-100 border-gray-600"
          />
        </div>
        <div className="flex gap-4">
          <Button
            onClick={handleStartAnalysis}
            disabled={isProcessing || !inputFile || !apiKey}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? "Processing..." : "Start Analysis"}
          </Button>
          {isProcessing && (
            <Button onClick={handleStopAnalysis} variant="destructive">
              Stop Analysis
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
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">Analysis Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <ul className="space-y-2">
                {analysisSteps.map((step, index) => (
                  <li key={index} className="text-gray-300">
                    {step}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
        <FilePreview files={files} />
      </div>

      {finalAnalysis && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">Final Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="text-gray-300 whitespace-pre-wrap">{finalAnalysis}</div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
