import { Button } from "@/components/ui/button"

export function ResultsDisplay({ results }: { results: string[] }) {
  if (results.length === 0) return null

  const jsonFiles = results.filter((file) => file.endsWith(".json"))
  const mdFiles = results.filter((file) => file.endsWith(".md"))

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-100">Output Files</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2 text-gray-300">Raw JSON Files</h4>
          {jsonFiles.map((file) => (
            <Button
              key={file}
              variant="outline"
              className="w-full mb-2 bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600"
            >
              Download {file}
            </Button>
          ))}
        </div>
        <div>
          <h4 className="font-medium mb-2 text-gray-300">Processed Markdown</h4>
          {mdFiles.map((file) => (
            <Button
              key={file}
              variant="outline"
              className="w-full mb-2 bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600"
            >
              Download {file}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

