"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { reviewFormDefaultValues } from "@/lib/constants";
import { insertReviewSchema } from "@/types/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function ReviewForm({
    userId,
    productId,
    onReviewSubmitted
}: {
    userId: string; 
    productId: string; 
    onReviewSubmitted?: () => void;
}) {
  const [open, setOpen] = useState(false);
    const form = useForm<z.infer<typeof insertReviewSchema>>({
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolver: zodResolver(insertReviewSchema) as any,
      defaultValues: reviewFormDefaultValues,
  });
    
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="default">Write a Review</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
              <Form {...form}>
                  <form method="POST">
                      <DialogHeader>
                                <DialogTitle>Write a Review</DialogTitle>
                                <DialogDescription>Share your thoughts with other customers</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                          <FormField
                              name="title"
                              control={form.control}
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Title</FormLabel>
                                      <FormControl>
                                          <Input placeholder="Enter title" {...field} />
                                      </FormControl>
                                  </FormItem>
                              )}
                          />
                          <FormField
                              name="description"
                              control={form.control}
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Comment</FormLabel>
                                      <FormControl>
                                          <Textarea placeholder="Enter description" {...field} />
                                      </FormControl>
                                  </FormItem>
                              )}
                          />
                          <FormField
                              name="rating"
                              control={form.control}
                              render={({ field }) => (
                                  <FormItem className="w-full">
                                      <FormLabel>Rating</FormLabel>
                                      <Select
                                          value={field.value.toString()}
                                          onValueChange={field.onChange}
                                      >
                                          <FormControl>
                                              <SelectTrigger className="w-full">
                                                  <SelectValue>
                                                    { field.value ?
                                                      <div>
                                                          {field.value}
                                                          <Star className="inline h-4 w-4"/>
                                                      </div> :
                                                        "Select a rating"
                                                    }
                                                  </SelectValue>
                                              </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                              {Array.from({ length: 5 }).map((_, index) => (
                                                  <SelectItem key={index} value={(index + 1).toString()}>
                                                      {index + 1}
                                                      <Star className="inline h-4 w-4"/>
                                                  </SelectItem>
                                              ))}
                                          </SelectContent>
                                      </Select>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                      </div>
                      <DialogFooter>
                          <Button
                              type="submit"
                              size="lg"
                              className="w-full"
                              disabled={form.formState.isSubmitting}
                          >
                              { form.formState.isSubmitting ? 'Submitting...' : 'Submit' }
                          </Button>
                      </DialogFooter>
                  </form>
              </Form>
        </DialogContent>
    </Dialog>
  )
}

export default ReviewForm;