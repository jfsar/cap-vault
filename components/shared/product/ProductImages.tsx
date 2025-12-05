'use client'

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"

function ProductImages({ images }: { images: string[] }) {
 const [currentIndex, setCurrentIndex] = useState(0)
  return (
    <div className="space-y-4">
        <div className="relative aspect-square min-h-2/3 overflow-hidden rounded-sm">
          <Image
              src={images[currentIndex]}
              alt="product image"
              fill
              className="object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
          <div className="flex">
              {images.map((img: string, index: number) => (
                  <div
                      key={img}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                          'border mr-2 min-h-[100px] min-w-[100px] cursor-pointer hover:border-orange-600 relative',
                          currentIndex === index && 'border-orange-500'
                      )}
                  >
                      <Image src={img} alt="image" fill className="object-center" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
                  </div>
              ))}
          </div>
    </div>
  )
}

export default ProductImages
