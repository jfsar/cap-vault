import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";
import Pagination from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteOrder, getAllOrders } from "@/db/actions/order.action";
import { requireAdmin } from "@/lib/admin-auth-guard";
import { formatDateTime, formatId, formatPrice } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Admin Orders'
};

async function AdminOrderPage({ searchParams }: { searchParams: Promise<{ page: string; query: string; }> }) {
  const { page = "1", query: searchText } = await searchParams;
  
  await requireAdmin();
  
  const orders = await getAllOrders({
      page: parseInt(page),
      query: searchText
  });
  return (
    <div className="space-y-2">
          <div className="flex items-center gap-3 w-1/2">
                 <h2 className="h2-bold">Orders</h2>
                 {searchText && (
                    <div className="space-x-4">
                       Filtered by: <i>&quot;{searchText}&quot;</i>
                       <Link href="/admin/orders">
                          <Button variant="outline" size="sm">Remove Filter</Button>
                       </Link>
                    </div>
                 )}
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
                      {orders.data.map((order) => (
                          <TableRow key={order.id}>
                              <TableCell>{ formatId(order.id)}</TableCell>
                              <TableCell>{ formatDateTime(order.createdAt!).dateTime}</TableCell>
                              <TableCell>{ order.user.name }</TableCell>
                              <TableCell>{ formatPrice(Number(order.totalPrice))}</TableCell>
                              <TableCell>{ order.isPaid && order.paidAt ? formatDateTime(order.paidAt!).dateTime : 'Not Paid'}</TableCell>
                              <TableCell>{order.isDelivered && order.deliveredAt ? formatDateTime(order.deliveredAt!).dateTime : 'Not Delivered'}</TableCell>
                              <TableCell className="flex gap-2 items-center">
                                  <Button asChild variant="outline" size="sm"> 
                                    <Link href={`/order/${order.id}`}>
                                       <ArrowUpRight />
                                    </Link>
                                  </Button>
                                  <ConfirmDeleteDialog id={order.id} action={deleteOrder} />
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
              {orders.totalPages > 1 && (
                  <Pagination page={ Number(page) || 1} totalPages={orders.totalPages}/>
              )}
          </div>
    </div>
  )
}

export default AdminOrderPage;
