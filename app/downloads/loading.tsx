import { Download, Archive } from 'lucide-react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DownloadsLoading() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Download className="h-8 w-8 text-primary mr-3 animate-pulse" />
            <Skeleton className="h-12 w-48 bg-primary/20" />
          </div>
          <Skeleton className="h-6 w-96 bg-primary/10" />
        </div>

        {/* Search and Filters Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 flex-1 bg-primary/10" />
            <Skeleton className="h-10 w-48 bg-primary/10" />
            <Skeleton className="h-10 w-48 bg-primary/10" />
          </div>
        </div>

        {/* Featured Downloads Skeleton */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Archive className="h-6 w-6 text-primary mr-2 animate-pulse" />
            <Skeleton className="h-8 w-48 bg-primary/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="glass border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-12 h-12 rounded-lg bg-primary/20" />
                      <div>
                        <Skeleton className="h-6 w-32 bg-primary/20 mb-2" />
                        <Skeleton className="h-4 w-20 bg-primary/10" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16 bg-yellow-500/20" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full bg-primary/10 mb-2" />
                  <Skeleton className="h-4 w-3/4 bg-primary/10 mb-4" />
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-4 w-16 bg-primary/10" />
                    <Skeleton className="h-4 w-20 bg-primary/10" />
                    <Skeleton className="h-4 w-12 bg-primary/10" />
                  </div>
                  <Skeleton className="h-10 w-full bg-primary/20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Downloads Skeleton */}
        <div>
          <div className="flex items-center mb-4">
            <Archive className="h-6 w-6 text-primary mr-2 animate-pulse" />
            <Skeleton className="h-8 w-40 bg-primary/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="glass border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 rounded-lg bg-primary/20" />
                      <div>
                        <Skeleton className="h-5 w-24 bg-primary/20 mb-2" />
                        <Skeleton className="h-3 w-16 bg-primary/10" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-3 w-full bg-primary/10 mb-1" />
                  <Skeleton className="h-3 w-2/3 bg-primary/10 mb-4" />
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-3 w-12 bg-primary/10" />
                    <Skeleton className="h-3 w-8 bg-primary/10" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-3 w-16 bg-primary/10" />
                    <Skeleton className="h-3 w-12 bg-primary/10" />
                  </div>
                  <Skeleton className="h-8 w-full bg-primary/20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
