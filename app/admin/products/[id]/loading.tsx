import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Update Product'
};

function LoadingPage() {
  
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
          <h1 className="h2-bold">Update Product</h1>
          <div>
            <form className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                        {/* Name */}
                        <Skeleton className="w-full md:w-1/2 h-12 rounded-sm"/>
                        {/* slug */}
                        <Skeleton className="w-full md:w-1/2 h-12 rounded-sm"/>
                </div>
                <div className="flex flex-col md:flex-row gap-5">
                        {/* category */}
                        <Skeleton className="w-full md:w-1/2 h-12 rounded-sm"/>
                        {/* brand */}
                        <Skeleton className="w-full md:w-1/2 h-12 rounded-sm"/>
                </div>
                <div className="flex flex-col md:flex-row gap-5">
                        {/* price */}
                        <Skeleton className="w-full md:w-1/2 h-12 rounded-sm"/>
                        {/* stock */}
                        <Skeleton className="w-full md:w-1/2 h-12 rounded-sm"/>
                </div>
                <div className="upload-field flex flex-col md:flex-row gap-5">
                        {/* images */}
                        <div className="w-full">
                            <Skeleton className="w-full md:w-1/2 h-12 rounded-sm"/>
                                <Card>
                                    <CardContent className="mt-2 space-y-2 min-h-48">
                                        <div className="flex-start space-x-2">
                                            {Array.from({length: 3}).map((_, i) => (
                                              <Skeleton key={i} className="w-36 h-36"/>
                                            ))}
                                            <Skeleton className="w-24 h-12"/>
                                        </div>
                                    </CardContent>
                                </Card>
                        </div>
                </div>
                <div className="upload-field">
                        {/* isFeatured */}
                        <Card>
                        <CardContent className="space-y-2 mt-2">
                            <Skeleton className="w-24 h-12"/>
                            <Skeleton className="w-48 h-48"/>
                            <Skeleton className="w-24 h-12"/>
                        </CardContent>
                        </Card>
                </div>
                <div>
                    <Skeleton className="w-24 h-12"/>
                </div>
                <div>
                        {/* submit */}
                        <Skeleton className="w-full h-24 rounded-sm"/>
                </div>
            </form>
         </div>
    </div>
  )
}

export default LoadingPage;