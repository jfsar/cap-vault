import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";


function CartTableSkeleton() {
  return (
    <>
        <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-center">Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { Array.from({length: 3}).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Skeleton className="h-12 w-full"/>
                                </TableCell>
                                <TableCell className="flex-center gap-2">
                                    <Skeleton className="h-12 w-12 rounded-md"/>
                                     <Skeleton className="h-12 w-8"/>
                                     <Skeleton className="h-12 w-12 rounded-md"/>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Skeleton className="h-12 w-full rounded-lg justify-end"/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Card>
                <CardContent className="p-4 gap-4">
                    <div className="pb-3 flex w-full text-xl space-x-2">
                          <Skeleton className="h-12 w-1/2" />
                          <Skeleton className="h-12 w-1/2" />
                    </div>
                    <div>
                       <Skeleton className="h-12 w-full"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    </>
  )
}

export default CartTableSkeleton;