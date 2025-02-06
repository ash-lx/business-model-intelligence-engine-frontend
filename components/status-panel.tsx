import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, XCircle, FileJson, FileText } from "lucide-react"

interface StatusItem {
  url: string
  status: "pending" | "success" | "error"
  message?: string
  files?: {
    json?: string
    markdown?: string
  }
}

interface StatusPanelProps {
  items: StatusItem[]
  progress: number
  totalUrls: number
  processedUrls: number
}

export function StatusPanel({ items, progress, totalUrls, processedUrls }: StatusPanelProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-300">
          <span>Processing Progress</span>
          <span>
            {processedUrls} / {totalUrls} URLs
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <ScrollArea className="h-[400px] rounded-md border border-gray-700">
        <div className="space-y-2 p-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-start space-x-3 p-2 rounded-lg bg-gray-900">
              {item.status === "pending" && <Clock className="w-5 h-5 text-blue-400" />}
              {item.status === "success" && <CheckCircle2 className="w-5 h-5 text-green-400" />}
              {item.status === "error" && <XCircle className="w-5 h-5 text-red-400" />}

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-200">{item.url}</span>
                  <div className="flex gap-2">
                    {item.files?.json && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <FileJson className="w-3 h-3" />
                        JSON
                      </Badge>
                    )}
                    {item.files?.markdown && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        MD
                      </Badge>
                    )}
                  </div>
                </div>
                {item.message && <p className="text-xs text-gray-400">{item.message}</p>}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

