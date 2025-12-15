"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";

function ConfirmDeleteDialog({ id, action }: { id: string; action: (id: string) => Promise<{ success: boolean; message: string; }> }) {

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const handleDelete = async () => {
      startTransition(async () => {
          const result = await action(id);

          if (!result.success) {
            toast.error(null, {
                description: result.message,
                style: {
                    backgroundColor: 'var(--destructive)',
                }
            });
            return;
          }
          setOpen(false);
          toast.success(null, {
              description: result.message,
          });
       });
  }
  
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
            <Button size="sm" variant="outline">
                <Trash className="text-destructive"/>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>This action can&apos;t be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button variant="destructive" disabled={isPending} onClick={handleDelete}>
                      { isPending ? 'Deleting...': 'Delete'}
                  </Button>
              </AlertDialogFooter>
          </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmDeleteDialog;