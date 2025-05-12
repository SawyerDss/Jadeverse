import { Skeleton } from "@/components/ui/skeleton"
import { Film } from "lucide-react"

export default function EntertainmentLoading() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Film className="h-8 w-8 text-primary/50 mr-3" />
          <Skeleton className="h-12 w-64 bg-primary/10" />
        </div>

        <Skeleton className="h-12 w-full max-w-md mb-4 bg-primary/10" />

        <div className="glass border border-primary/20 rounded-xl p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 bg-primary/10" />
            <Skeleton className="h-10 bg-primary/10" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-primary/20">
                <Skeleton className="aspect-[2/3] w-full bg-primary/10" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2 bg-primary/10" />
                  <Skeleton className="h-4 w-1/2 bg-primary/10" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
