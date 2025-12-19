import type { Metadata } from "next";

import { deleteUser, getAllUsers } from "@/db/actions/user.action";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/shared/Pagination";
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit } from "lucide-react";
import { formatId } from "@/lib/utils";
import UserBadge from "@/components/admin/UserBadge";

export const metadata: Metadata = {
    title: 'Admin Users'
};

async function AdminUserPage({ searchParams }: { searchParams: Promise<{ page: string }> }) {
  const { page} = await searchParams;
  const users = await getAllUsers({page: Number(page) || 1});
  
  return (
    <div className="space-y-2">
          <h2 className="h2-bold">Users</h2>
          <div className="overflow-x-auto">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>NAME</TableHead>
                          <TableHead>EMAIL</TableHead>
                          <TableHead>ROLE</TableHead>
                          <TableHead>ACTIONS</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.data.map((user) => (
                          <TableRow key={user.id}>
                              <TableCell>{ formatId(user.id)}</TableCell>
                              <TableCell>{ user.name}</TableCell>
                              <TableCell>{ user.email }</TableCell>
                              <TableCell>
                                <UserBadge role={user.role} />
                              </TableCell>
                              <TableCell className="flex gap-2 items-center">
                                  <Button asChild variant="outline" size="sm"> 
                                    <Link href={`/admin/users/${user.id}`}>
                                       <Edit />
                                    </Link>
                                  </Button>
                                  <ConfirmDeleteDialog id={user.id} action={deleteUser} />
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
              {users.totalPages > 1 && (
                  <Pagination page={ Number(page) || 1} totalPages={users.totalPages}/>
              )}
          </div>
    </div>
  )
}

export default AdminUserPage;
