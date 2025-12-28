import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingPage() {
  return (
    <div className="space-y-2">
      <div className="flex-between w-full">
              <div className="flex items-center gap-3 w-1/2">
                 <Skeleton className="w-32 h-8"/>
                 <Skeleton className="w-32 h-8"/>
              </div>
              <Skeleton className="w-32 h-8 rounded-sm"/>
      </div>
      <Table>
        <TableHeader>
            <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>CATEGORY</TableHead>
                <TableHead>STOCK</TableHead>
                <TableHead>RATING</TableHead>
                <TableHead className="w-[100px]">ACTIONS</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
                  {Array.from({length: 10}).map((_, i: number) => (
                      <TableRow key={i}>
                          <TableCell>
                              <Skeleton className="w-24 h-8" />
                          </TableCell>
                          <TableCell>
                              <Skeleton className="w-24 h-8" />
                          </TableCell>
                          <TableCell className="text-right">
                              <Skeleton className="w-24 h-8" />
                          </TableCell>
                          <TableCell>
                              <Skeleton className="w-24 h-8" />
                          </TableCell>
                          <TableCell>
                              <Skeleton className="w-24 h-8" />
                          </TableCell>
                          <TableCell>
                              <Skeleton className="w-24 h-8" />
                          </TableCell>
                          <TableCell className="flex gap-2 items-center">
                                <Skeleton className="w-12 h-8 rounded-sm" />
                                <Skeleton className="w-12 h-8 rounded-sm" />
                          </TableCell>
                      </TableRow>
                  ))}
        </TableBody>
      </Table>
      
      <div className="flex gap-2">
          <Skeleton className="w-24 h-12 rounded-sm" />
          <Skeleton className="w-24 h-12 rounded-sm" />
      </div>

    </div>
  )
}

export default LoadingPage;
