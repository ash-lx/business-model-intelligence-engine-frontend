import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Download, Copy, FileJson, FileText } from "lucide-react"

interface FilePreviewProps {
  files: {
    name: string
    type: "json" | "markdown"
    content: string
    path: string
  }[]
}

export function FilePreview({ files }: FilePreviewProps) {
  const [activeFile, setActiveFile] = useState(files[0]?.name)

  return (
    <div className="bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-gray-100">Generated Files</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Download className="w-4 h-4 mr-2" />
            Download All
          </Button>
        </div>
      </div>

      <Tabs defaultValue={files[0]?.name} className="w-full" onValueChange={setActiveFile}>
        <TabsList className="p-2 bg-gray-900">
          {files.map((file) => (
            <TabsTrigger key={file.name} value={file.name} className="flex items-center gap-2">
              {file.type === "json" ? <FileJson className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
              {file.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {files.map((file) => (
          <TabsContent key={file.name} value={file.name} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">{file.path}</span>
              <Button variant="ghost" size="sm" className="h-8">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <ScrollArea className="h-[500px] w-full rounded-md border border-gray-700">
              <pre className="p-4 text-sm">
                <code className="text-gray-300">{file.content}</code>
              </pre>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

