"use client";

import { useRouter } from "next/navigation";
import {Product} from "@/types";
import { SubmitHandler, useForm } from "react-hook-form";
import slugify from 'slugify';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, updateProductSchema } from "@/types/validator";
import { productDefaultValues } from "@/lib/constants";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createProduct, updateProduct } from "@/db/actions/product.action";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { Checkbox } from "../ui/checkbox";

type ProductFormProps =
  | {
      type: 'Create';
      product?: never;
      productId?: never;
    }
  | {
      type: 'Update';
      product: Product;
      productId: string;
    };

function ProductForm({
    type,
    product,
    productId
}: ProductFormProps) {
    
  const router = useRouter();
    
  // Use a union type instead of conditional
  type ProductFormValues = 
    | z.infer<typeof insertProductSchema>
    | z.infer<typeof updateProductSchema>;

  const schema = type === 'Create' ? insertProductSchema : updateProductSchema;
  const defaults = type === 'Update' ? product : productDefaultValues;

 

  const form = useForm<ProductFormValues>({
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: defaults as ProductFormValues,
  });

  const images = form.watch('images');
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');

  const onSubmit: SubmitHandler<ProductFormValues> = async (values: ProductFormValues) => { 
    
    // on create
    if (type === "Create") { 
      const result = await createProduct(values);
      if (!result.success) {
        toast.error(null, {
          description: result.message,
          style: {
            backgroundColor: 'var(--destructive)',
          }
        });
      } else { 
        toast.success(null, {
          description: result.message
        });
        router.push('/admin/products');
      }
    }

    if (type === "Update") { 
      if (!productId) {
        router.push("/admin/products");
        return;
       }
      const result = await updateProduct({...values, id: productId});
      if (!result.success) {
        toast.error(null, {
          description: result.message,
          style: {
            backgroundColor: 'var(--destructive)',
          }
        });
      } else { 
        toast.success(null, {
          description: result.message
        });
        router.push('/admin/products');
      }
    }
  }

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-start gap-5">
                  {/* Name */}
                  <FormField
                      name="name"
                      control={form.control}
                      render={({ field }) => (
                          <FormItem className="w-full">
                              <FormLabel htmlFor="name">Name</FormLabel>
                              <FormControl>  
                                   <Input type="text" placeholder="Enter product name" {...field}/>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  {/* slug */}
                  <FormField
                      name="slug"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel htmlFor="slug">Slug</FormLabel>
                            <FormControl>
                                  <div className="relative">
                                      <Input type="text" placeholder="Enter slug" {...field} />
                                      <Button
                                         type='button'
                                         className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2'
                                         onClick={() => {
                                            form.setValue(
                                            'slug',
                                            slugify(form.getValues('name'), { lower: true })
                                            );
                                         }}
                                      >
                                        Generate
                                      </Button>
                                  </div> 
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                  />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
                  {/* category */}
                  <FormField
                      name="category"
                      control={form.control}
                      render={({ field }) => (
                          <FormItem className="w-full">
                              <FormLabel htmlFor="category">Category</FormLabel>
                              <FormControl>  
                                   <Input type="text" placeholder="Enter category" {...field}/>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  {/* brand */}
                  <FormField
                      name="brand"
                      control={form.control}
                      render={({ field }) => (
                          <FormItem className="w-full">
                              <FormLabel htmlFor="band">Brand</FormLabel>
                              <FormControl>  
                                   <Input type="text" placeholder="Enter brand" {...field}/>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
                   {/* price */}
                   <FormField
                      name="price"
                      control={form.control}
                      render={({ field }) => (
                          <FormItem className="w-full">
                              <FormLabel htmlFor="name">Price</FormLabel>
                              <FormControl>  
                                   <Input type="text" placeholder="Enter product price" {...field}/>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />
                   {/* stock */}
                   <FormField
                      name="stock"
                      control={form.control}
                      render={({ field }) => (
                          <FormItem className="w-full">
                              <FormLabel htmlFor="name">Stock</FormLabel>
                              <FormControl>  
                                   <Input type="text" placeholder="Enter product stock" {...field}/>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />
        </div>
        <div className="upload-field flex flex-col md:flex-row gap-5">
                  {/* images */}
                  <FormField
                      name="images"
                      control={form.control}
                      render={() => (
                          <FormItem className="w-full">
                              <FormLabel htmlFor="name">Images</FormLabel>
                              <Card>
                                <CardContent className="mt-2 space-y-2 min-h-48">
                                  <div className="flex-start space-x-2">
                                    { images.map(image => (
                                      <Image
                                        key={image}
                                        src={image}
                                        alt='product-image'
                                        className="w-20 h-20 object-cover object-center rounder-sm"
                                        width={100}
                                        height={100}
                                      />
                                    ))}
                                    <FormControl>
                                      <UploadButton 
                                          endpoint="imageUploader" 
                                          onClientUploadComplete={(res: {url: string}[]) => form.setValue('images', [...images, res[0].url]) } 
                                          onUploadError={(error: Error) => {
                                            toast.error(null, {
                                              description: error.message,
                                              style: {
                                                backgroundColor: 'var(--destructive)',
                                              }
                                            })
                                          } }
                                      />
                                    </FormControl>
                                  </div>
                                </CardContent>
                              </Card>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
        </div>
        <div className="upload-field">
                 {/* isFeatured */}
                 Featured Product
                 <Card>
                  <CardContent className="space-y-2 mt-2">
                     <FormField 
                         control={form.control} 
                         name="isFeatured"
                         render={({ field }) => (
                           <FormItem className="space-x-2 flex items-center">
                             <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                             </FormControl>
                             <FormLabel>Is Featured?</FormLabel>
                           </FormItem>
                         )}
                     />
                     {isFeatured && banner && (
                        <Image 
                             src={banner} 
                             alt="banner" 
                             width={1920} 
                             height={680} 
                             className="w-full object-cover object-center rounded-sm"
                        />
                     )}
                     {isFeatured && !banner && (
                       <UploadButton 
                            endpoint="imageUploader" 
                            onClientUploadComplete={(res: {url: string}[]) => form.setValue('banner', res[0].url) } 
                            onUploadError={(error: Error) => {
                              toast.error(null, {
                                description: error.message,
                                style: {
                                   backgroundColor: 'var(--destructive)',
                                }
                              })
                            }}
                        />
                     )}
                  </CardContent>
                 </Card>
        </div>
        <div>
                  {/* description */}
                  <FormField
                      name="description"
                      control={form.control}
                      render={({ field }) => (
                          <FormItem className="w-full">
                              <FormLabel htmlFor="description">Description</FormLabel>
                              <FormControl>  
                                   <Textarea className="resize-none" placeholder="Enter product description" {...field}/>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                    />
        </div>
        <div>
                   {/* submit */}
                   <Button className="button col-span-2 w-full" type="submit" size="lg" disabled={form.formState.isSubmitting}>
                     { form.formState.isSubmitting ? "Submitting..." : `${type} Product` }
                   </Button>
        </div>
      </form>
    </Form>
  );
}

export default ProductForm;