import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader } from "../ui/card";

function ProductSkeleton() {
  return (
    <div className="my-10">
          <h2 className="h2-bold mb-4"><Skeleton className="w-48 h-6"/></h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({length: 4}).map((_, index) => (
                <Card key={index} className="w-full max-w-sm pt-0 overflow-hidden">
                    <CardHeader className="p-0 items-center">
                      <Skeleton className="min-h-[300px] min-w-[300px]"/>
                    </CardHeader>
                    <CardContent className="p-4 grid gap-4">
                      <div className="text-xs"><Skeleton className="w-32 h-6"/></div>
                         <div className="text-sm font-medium"><Skeleton className="w-48 h-6"/></div>
                      <div className="flex-between gap-4">
                         <div><Skeleton className="w-24 h-6"/></div>
                          <div className="text-destructive"><Skeleton className="w-24 h-6"/></div>
                      </div>
                    </CardContent>
                 </Card>
              ))}
           </div>
    </div>
  )
}

export default ProductSkeleton;
