import { Button } from "@/components/ui/button"
import { ModeToggle } from "./ModeToggle"
import Link from "next/link"
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import UserButton from "./UserButton"

function Menu() {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Button variant='ghost' asChild>
            <Link href='/cart'>
                <ShoppingCart />
                Cart
            </Link>
        </Button>
        <UserButton />
      </nav>
      <nav className="md:hidden">
        <Sheet>
            <SheetTrigger>
                <EllipsisVertical className="w-5 h-5"/>
            </SheetTrigger>
            <SheetContent className="flex flex-col items-start px-8 py-4">
                <SheetTitle>Menu</SheetTitle>
                <ModeToggle />
                <Button variant='ghost' asChild>
                    <Link href='/cart'>
                        <ShoppingCart />
                        Cart
                    </Link>
                </Button>
                <UserButton />
            </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default Menu
