import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Files, AlertTriangle, CheckCircle2 } from "lucide-react"

interface StatsProps {
  totalTime: number
  processedFiles: number
  errors: number
  successRate: number
}

export function StatsPanel({ totalTime, processedFiles, errors, successRate }: StatsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-gray-800 rounded-lg p-3 space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-300">
            <span>Processing Time</span>
            <span>{totalTime}s</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-3 space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-300">
            <span>Files Generated</span>
            <span>{processedFiles}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-3 space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-300">
            <span>Errors</span>
            <span>{errors}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-3 space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-300">
            <span>Success Rate</span>
            <span>{successRate}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
