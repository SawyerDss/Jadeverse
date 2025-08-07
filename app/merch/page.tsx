import { ShirtIcon as TShirt, AlertTriangle, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function MerchPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-1 bg-red-500/30 blur-xl rounded-full"></div>
            <div className="relative w-24 h-24 mx-auto rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-red-400" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Merchandise Store
          </h1>
          
          <div className="inline-flex items-center bg-red-500/20 border border-red-500/50 rounded-full px-6 py-3 mb-6">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-400 font-semibold">NOT WORKING</span>
          </div>

          <p className="text-white/70 text-xl max-w-2xl mx-auto mb-8">
            Our merchandise store is currently under maintenance. We're working hard to bring you awesome s0lara gear soon!
          </p>
        </div>

        <Card className="glass border-red-500/20 max-w-2xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-center">
              <TShirt className="h-6 w-6 text-red-400 mr-2" />
              Store Status
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h3 className="text-red-400 font-semibold mb-2">Temporarily Unavailable</h3>
                <p className="text-white/70 text-sm">
                  We're currently updating our merchandise system to serve you better. The store will be back online soon with new products and improved features.
                </p>
              </div>
              
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h3 className="text-primary font-semibold mb-2">Coming Soon</h3>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• s0lara branded apparel</li>
                  <li>• Gaming accessories</li>
                  <li>• Collectible items</li>
                  <li>• Digital wallpapers and themes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <p className="text-white/60">
            Want to be notified when the store is back online?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <Link href="/suggestions">
              <Button className="bg-primary hover:bg-primary/80 text-white">
                <TShirt className="h-4 w-4 mr-2" />
                Suggest Merchandise Ideas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
