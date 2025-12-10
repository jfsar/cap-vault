import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";


async function ProductDetailsSkeleton() {
  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-8">
          {/* images column */}
          <div className="col-span-2">
            <div className="space-y-4">
                    <div className="relative aspect-square min-h-2/3 overflow-hidden rounded-sm">
                       <Skeleton className="w-full h-full"/>
                    </div>
                      <div className="flex">
                          {Array.from({length: 2}).map((_, index: number) => (
                              <div
                                  key={index}
                                  className={cn(
                                      'border mr-2 min-h-[100px] min-w-[100px] cursor-pointer hover:border-orange-600 relative'
                                  )}
                              >
                                  <Skeleton className="w-full h-full"/>
                              </div>
                          ))}
                      </div>
                </div>
          </div>
          {/* details column */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
                <Skeleton className="w-1/2 h-8"/>
                <Skeleton className="w-2/3 h-8"/>
                <Skeleton className="w-1/3 h-8"/>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                   <Skeleton className="w-1/3 h-8"/>
                </div>
            </div>
            <div className="space-y-2 mt-10">
                 <Skeleton className="w-1/3 h-8"/>
                 <Skeleton className="w-2/3 h-8"/>
            </div>
          </div>
          {/* actions column */}
          <div>
            <Card>
                <CardContent className="p-4">
                    <div className="mb-2 flex justify-between">
                      <Skeleton className="w-1/3 h-8"/>
                      <Skeleton className="w-1/3 h-8"/>
                    </div>
                    <div className="mb-5 flex justify-between">
                      <Skeleton className="w-1/3 h-8"/>
                      <Skeleton className="w-1/3 h-8 rounded-full"/>
                    </div>
                    <div className="flex-center">
                        <Skeleton className="w-full h-12"/>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProductDetailsSkeleton;
