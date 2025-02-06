import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { StatusPanel } from "./status-panel";
import { FilePreview } from "./file-preview";
import { StatsPanel } from "./stats-panel";

export function SitemapProcessor({ config }: { config: any }) {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [statusItems, setStatusItems] = useState([
    {
      url: "https://assemblean.com/en/",
      status: "success",
      message: "Successfully processed",
      files: { json: "en.json", markdown: "en.md" },
    },
    {
      url: "https://assemblean.com/assembly-manufacturing/",
      status: "success",
      message: "Successfully processed",
      files: {
        json: "assembly-manufacturing.json",
        markdown: "assembly-manufacturing.md",
      },
    },
    {
      url: "https://assemblean.com/sheet-metal-processing/",
      status: "success",
      message: "Successfully processed",
      files: {
        json: "sheet-metal-processing.json",
        markdown: "sheet-metal-processing.md",
      },
    },
    {
      url: "https://assemblean.com/cnc-machining/",
      status: "success",
      message: "Successfully processed",
      files: { json: "cnc-machining.json", markdown: "cnc-machining.md" },
    },
    {
      url: "https://assemblean.com/die-casting/",
      status: "success",
      message: "Successfully processed",
      files: { json: "die-casting.json", markdown: "die-casting.md" },
    },
    {
      url: "https://assemblean.com/materials-overview/",
      status: "success",
      message: "Successfully processed",
      files: {
        json: "materials-overview.json",
        markdown: "materials-overview.md",
      },
    },
  ]);
  const [files, setFiles] = useState([]);

  // ... (rest of the component logic remains the same, just replace "scrape" with "process" in function names and messages)

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Website URL"
          className="bg-gray-700 text-gray-100 border-gray-600"
        />
        <Button
          onClick={() => setIsProcessing(true)}
          disabled={isProcessing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isProcessing ? "Processing..." : "Start Processing"}
        </Button>
      </div>

      <StatsPanel
        totalTime={125}
        processedFiles={8}
        errors={1}
        successRate={88.9}
      />

      <div className="grid grid-cols-2 gap-6">
        <StatusPanel
          items={statusItems}
          progress={66}
          totalUrls={3}
          processedUrls={2}
        />
        <FilePreview files={files} />
      </div>
    </div>
  );
}
