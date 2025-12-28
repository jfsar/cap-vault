import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: 'Loading Orders'
};

function LoadingPage() {

  return (
    <div className="space-y-2">
          <div className="flex items-center gap-3 w-1/2">
                 <Skeleton className="w-32 h-8"/>
          </div>
          <div className="overflow-x-auto">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>DATE</TableHead>
                          <TableHead>BUYER</TableHead>
                          <TableHead>TOTAL</TableHead>
                          <TableHead>PAID</TableHead>
                          <TableHead>DELIVERED</TableHead>
                          <TableHead>ACTIONS</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {Array.from({ length: 10}).map((_, i: number) => (
                          <TableRow key={i}>
                              <TableCell><Skeleton className="w-24 h-8"/></TableCell>
                              <TableCell><Skeleton className="w-24 h-8"/></TableCell>
                              <TableCell><Skeleton className="w-24 h-8"/></TableCell>
                              <TableCell><Skeleton className="w-24 h-8"/></TableCell>
                              <TableCell><Skeleton className="w-24 h-8"/></TableCell>
                              <TableCell><Skeleton className="w-24 h-8"/></TableCell>
                              <TableCell className="flex gap-2 items-center">
                                  <Skeleton className="w-8 h-8 rounded-lg"/>
                                  <Skeleton className="w-8 h-8 rounded-lg"/>
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
    </div>
  )
}

export default LoadingPage;
