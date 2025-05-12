import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EntertainmentDetailLoading() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" size="sm" className="text-white/70">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Entertainment
          </Button>
        </div>

        <div className="glass border border-primary/20 rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
            {/* Poster */}
            <Skeleton className="aspect-[2/3] bg-primary/10 rounded-lg" />

            {/* Details */}
            <div className="md:col-span-2">
              <Skeleton className="h-10 w-3/4 mb-4 bg-primary/10" />

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Skeleton className="h-6 w-24 rounded-full bg-primary/10" />
                <Skeleton className="h-6 w-16 rounded-full bg-primary/10" />
              </div>

              <Skeleton className="h-4 w-full mb-2 bg-primary/10" />
              <Skeleton className="h-4 w-full mb-2 bg-primary/10" />
              <Skeleton className="h-4 w-3/4 mb-6 bg-primary/10" />

              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-10 w-32 rounded-md bg-primary/10" />
                <Skeleton className="h-10 w-40 rounded-md bg-primary/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
