import { getAllCategories } from "@/db/actions/product.action";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";


async function Search() {
  const categories = await getAllCategories();
  return (
    <form action="/search" method="GET">
       <div className="flex w-full max-w-sm items-center space-x-2">
           <Select name="category">
              <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All"/>
              </SelectTrigger>
              <SelectContent>
                      <SelectItem key="all" value="all">All</SelectItem>
                      {categories.map(item => (
                          <SelectItem key={item.category} value={item.category}>{item.category}</SelectItem>
                      ))}
              </SelectContent>
           </Select>
           <Input type="text" name="q" placeholder="Search..." className="md:w-[100px] lg:w-[300px]"/>
           <Button>
              <SearchIcon />
           </Button>
       </div>
    </form>
  )
}

export default Search;
