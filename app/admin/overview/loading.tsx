import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: 'Loading Overview'
};

function LoadingPage() {
  return (
    <div className="space-y-2">
      <Skeleton className="w-32 h-12" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="w-12 h-8" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </CardHeader>
          <CardContent>
             <Skeleton className="w-12 h-8" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="w-12 h-8" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="w-12 h-8" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="w-12 h-8" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </CardHeader>
          <CardContent>
             <Skeleton className="w-12 h-8" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="w-12 h-8" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </CardHeader>
          <CardContent>
              <Skeleton className="w-12 h-8" />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
             <Skeleton className="w-12 h-8" />
          </CardHeader>
          <CardContent>
             <Skeleton className="w-full max-h-[300px]" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
             <Skeleton className="w-12 h-8" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>BUYER</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>TOTAL</TableHead>
                  <TableHead>ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({length: 10}).map((_, i: number) => (
                  <TableRow key={i}>
                    <TableCell>
                       <Skeleton className="w-12 h-8" />
                    </TableCell>
                    <TableCell>
                       <Skeleton className="w-12 h-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-12 h-8" />
                    </TableCell>
                    <TableCell>
                       <Skeleton className="w-12 h-8" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoadingPage;