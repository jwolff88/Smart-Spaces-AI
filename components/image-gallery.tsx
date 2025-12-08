"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface ImageGalleryProps {
  images: string[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      {/* Main Image Grid */}
      <div className="grid grid-cols-4 gap-2 h-[400px] rounded-lg overflow-hidden">
        <div className="col-span-2 row-span-2 relative">
          <img
            src={images[0] || "/placeholder.svg"}
            alt="Property main view"
            className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all"
          />
        </div>
        {images.slice(1, 5).map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image || "/placeholder.svg"}
              alt={`Property view ${index + 2}`}
              className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all"
            />
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="gap-2">
                      <Grid3X3 className="h-4 w-4" />
                      Show all photos
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                    <div className="relative">
                      <img
                        src={images[currentIndex] || "/placeholder.svg"}
                        alt={`Property view ${currentIndex + 1}`}
                        className="w-full h-[70vh] object-cover rounded-lg"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentIndex + 1} / {images.length}
                      </div>
                    </div>
                    <div className="grid grid-cols-6 gap-2 mt-4 max-h-20 overflow-y-auto">
                      {images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Thumbnail ${index + 1}`}
                          className={`w-full h-16 object-cover rounded cursor-pointer ${
                            index === currentIndex ? "ring-2 ring-primary" : "hover:opacity-80"
                          }`}
                          onClick={() => setCurrentIndex(index)}
                        />
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
