import { Film } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function MoviesLoading() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Film className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            <span className="text-gradient">Movies</span>
          </h1>
        </div>

        {/* Filters and Search Skeleton */}
        <div className="glass border border-primary/20 rounded-xl p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-10 w-full bg-black/30" />
            <Skeleton className="h-10 w-full bg-black/30" />
            <Skeleton className="h-10 w-full bg-black/30" />
          </div>
        </div>

        {/* Movies Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="glass border border-primary/20 rounded-xl overflow-hidden">
              <Skeleton className="aspect-[2/3] w-full bg-black/30" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2 bg-black/30" />
                <Skeleton className="h-4 w-1/2 mb-2 bg-black/30" />
                <Skeleton className="h-4 w-1/4 bg-black/30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
