import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
    title: 'Loading User'
};

function LoadingPage() {

  return (
    <div className="space-y-8 max-w-lg mx-auto">
          <h1 className="h2-bold">Update User</h1>
          <div>
            <form className="space-y-4">
                {/* Email */}
                <div>
                    <Skeleton className="w-full h-12 rounded-sm"/>
                </div>
                {/* Name */}
                <div>
                   <Skeleton className="w-full h-12 rounded-sm"/>
                </div>
                {/* Role */}
                <div>
                   <Skeleton className="w-full h-12 rounded-sm"/>
                </div>
                <div className="flex-between mt-6">
                   <Skeleton className="w-full h-12 rounded-sm"/>
                </div>
            </form>
        </div>
    </div>
  )
}

export default LoadingPage;