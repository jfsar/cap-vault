import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { signOutUser } from "@/db/actions/user.action";


async function UserButton() {

    const session = await auth();
  
  if(!session?.user) {
      return (
        <Button asChild>
            <Link href='/sign-in'>
                <UserIcon />
                Sign In
            </Link>
        </Button>
    )
  }
  
  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? 'U';
  
  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <div className="flex items-center">
                <Button 
                    variant='ghost' 
                    className="relative cursor-pointer bg-gray-200 w-8 h-8 rounded-full ml-2 flex items-center justify-center"
                >
                    {firstInitial}
                </Button>
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium leading-none">
                        { session.user?.name }
                    </div>
                    <div className="text-sm text-muted-foreground leading-none">
                        { session.user?.email }
                    </div>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuItem className="p-0 mb-1">
                  <form action={signOutUser}>
                    <Button 
                       className="w-full py-4 px-2 h-4 justify-start cursor-pointer"
                       variant='ghost'
                    >
                        Sign Out
                    </Button>
                  </form>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default UserButton;
