import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";
import {  getAllProducts, deleteProduct } from "@/db/actions/product.action";
import Pagination from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdmin } from "@/lib/admin-auth-guard";
import { formatId, formatPrice } from "@/lib/utils";
import { Edit } from "lucide-react";
import Link from "next/link";


async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ page: string; query: string; category: string; }>}) {
    const seachParams = await searchParams;
    const page = Number(seachParams.page) || 1;
    const searchText = seachParams.query || "";
    const category = seachParams.category || "";
    await requireAdmin();

    const products = await getAllProducts({
        query: searchText,
        page,
        category,
    });

  return (
    <div className="space-y-2">
      <div className="flex-between w-full">
              <div className="flex items-center gap-3 w-1/2">
                 <h1 className="h2-bold">Products</h1>
                 {searchText && (
                    <div className="space-x-4">
                       Filtered by: <i>&quot;{searchText}&quot;</i>
                       <Link href="/admin/products">
                          <Button variant="outline" size="sm">Remove Filter</Button>
                       </Link>
                    </div>
                 )}
              </div>
              <Button asChild variant="default">
                  <Link href="/admin/products/create">Create Product</Link>
              </Button>
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
                  {products.data.map((product) => (
                      <TableRow key={product.id}>
                          <TableCell>{ formatId(product.id)}</TableCell>
                          <TableCell>{ product.name }</TableCell>
                          <TableCell className="text-right">{ formatPrice(Number(product.price))}</TableCell>
                          <TableCell>{ product.category }</TableCell>
                          <TableCell>{ product.stock }</TableCell>
                          <TableCell>{String(product.rating)}</TableCell>
                          <TableCell className="flex gap-2 items-center">
                               <Button asChild variant="outline" size="sm"> 
                                    <Link href={`/admin/products/${product.id}`}>
                                       <Edit />
                                    </Link>
                                </Button>
                                <ConfirmDeleteDialog id={product.id} action={deleteProduct} />
                          </TableCell>
                      </TableRow>
                  ))}
        </TableBody>
      </Table>
      
      {products.totalPages > 1 && (
            <Pagination page={ Number(page) || 1} totalPages={products.totalPages}/>
      )}

    </div>
  )
}

export default AdminProductsPage;
