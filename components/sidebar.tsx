import { ConfigSettings } from "./config-settings"

export function Sidebar({ config, setConfig }: { config: any; setConfig: (config: any) => void }) {
  return (
    <div className="w-72 bg-gray-800 p-4 border-r border-gray-700 overflow-y-auto">
      <h2 className="text-sm font-semibold mb-4 text-gray-100">⚙️ Configuration</h2>
      <ConfigSettings config={config} setConfig={setConfig} />
    </div>
  )
}

