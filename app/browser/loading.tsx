import { RefreshCw } from "lucide-react"

export default function BrowserLoading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h3 className="mt-6 text-xl font-bold text-white text-bloom-primary">Loading Browser</h3>
        <p className="mt-2 text-white/70">Initializing secure browsing environment...</p>
      </div>
    </div>
  )
}
