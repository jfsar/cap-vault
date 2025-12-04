
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() { 
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <Card className="flex flex-col items-center mx-auto p-6 rounded-lg shadow-md max-w-sm md:min-w-2xl">
                <Image src="/images/logo.svg" alt={`${APP_NAME} logo`} width={48} height={48} priority={true} />
                <div className="w-full text-center">
                    <h1 className="text-3xl font-bold mb-4">404</h1>
                    <p className="text-destructive">Could not find requested page.</p>
                    <Button variant='outline' className="mt-4 ml-2" asChild>
                        <Link href='/'>Back to home</Link>
                    </Button>
                </div>
            </Card>
        </div>
    )
}