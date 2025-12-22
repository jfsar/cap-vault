import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingPage() {
  return (
    <div className="grid md:grid-cols-5 md:gap-5">
        <div className="filter-links">
              <div className="text-xl mb-2 mt-3">
                 <Skeleton className="w-full h-8"/> 
              </div>
              <div>
                  <ul className="space-y-1">
                      {Array.from({ length: 4 }).map((_, index) => (
                          <Skeleton key={index} className="w-full h-8"/>
                      ))}
                  </ul>
              </div>
              {/* price links */}
              <div className="text-xl mb-2 mt-8">
                 <Skeleton className="w-full h-8"/> 
              </div>
              <div>
                  <ul className="space-y-1">
                      {Array.from({ length: 4 }).map((_, index) => (
                          <Skeleton key={index} className="w-full h-8"/>
                      ))}
                  </ul>
              </div>
              {/* rating links */}
              <div className="text-xl mb-2 mt-8">
                 <Skeleton className="w-full h-8"/> 
              </div>
              <div>
                  <ul className="space-y-1">
                     {Array.from({ length: 4 }).map((_, index) => (
                          <Skeleton key={index} className="w-full h-8"/>
                      ))}
                  </ul>
              </div>
       </div>
      <div className="space-y-4 md:col-span-4">
          <div className="flex-between flex-col md:flex-row my-4">
            <div className="flex items-center">
                <Skeleton className="w-full h-8"/>
            </div>
            <div className="flex gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="w-8 h-8"/>
                ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
    </div>
  )
}

export default LoadingPage;
