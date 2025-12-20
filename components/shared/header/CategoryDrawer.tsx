import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { getAllCategories } from "@/db/actions/product.action";
import { Menu } from "lucide-react";
import Link from "next/link";


async function CategoryDrawer() {
  const categories = await getAllCategories();
  return (
    <Drawer direction="left">
       <DrawerTrigger asChild>
         <Button variant="outline">
                <Menu />
         </Button>
       </DrawerTrigger>
       <DrawerContent className="h-full max-w-sm">
         <DrawerHeader>
                  <DrawerTitle>Select Categories</DrawerTitle>
                  <div className="space-y-1 mt-4">
                      {categories.map(item => (
                          <Button
                              key={item.category}
                              className="w-full justify-start"
                              variant="ghost"
                              asChild
                          >
                              <DrawerClose asChild>
                                  <Link href={`/search?category=${item.category}`}>
                                      {item.category} ({item._count })
                                  </Link>
                              </DrawerClose>
                          </Button>
                      ))}
                  </div>
         </DrawerHeader>
       </DrawerContent>
    </Drawer>
  )
}

export default CategoryDrawer;
