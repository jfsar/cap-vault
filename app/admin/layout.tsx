import Menu from "@/components/shared/header/Menu";
import Link from "next/link";
import MainNav from "./MainNav";
import { Input } from "@/components/ui/input";

function AdminLayout({ children }: {children: React.ReactNode}) {
  return (
    <>
        <div className="flex flex-col h-screen">
            <div className="border-b container mx-auto">
                <div className="flex wrapper items-center h-16 px-4">
                    <Link href="/">
                        <span className='font-bold text-2xl'>UrbanCap</span>
                    </Link>
                    <MainNav className="mx-6"/>
                    <div className="ml-auto items-center flex space-x-4">
                        <div>
                            <Input type="search" placeholder="Search..." className="md:w-[100px] lg:w-[300px]"/>
                        </div>
                        <Menu />
                    </div>
                </div>
            </div>
            <div className="flex-1 wrapper mx-auto space-y-4 p-8 pt-6">
                { children }
            </div>
        </div>
    </>
  )
}

export default AdminLayout;
