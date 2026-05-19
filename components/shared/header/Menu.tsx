import { Button } from "@/components/ui/button"
import { ModeToggle } from "./ModeToggle"
import Link from "next/link"
import { EllipsisVertical, ShoppingCart } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import UserButton from "./UserButton"
import { getMyCart } from "@/db/actions/cart.action"


async function CartButton() {
  const cart = await getMyCart();
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.qty, 0) ?? 0;

  return (
    <Button variant='ghost' asChild>
      <Link href='/cart' className="relative">
        <ShoppingCart />
        Cart
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center leading-none">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </Link>
    </Button>
  );
}

function Menu() {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-3">
        <ModeToggle />
        <CartButton />
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
            <CartButton />
            <UserButton />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default Menu;