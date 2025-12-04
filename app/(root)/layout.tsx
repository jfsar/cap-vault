import Footer from "@/components/Footer";
import Header from "@/components/shared/header";
import { APP_DESCRIPTION, APP_NAME, APP_URL } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Home',
  description: `${APP_DESCRIPTION}`,
  metadataBase: new URL(APP_URL)
};

function Layout({ children }: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col h-screen">
       <Header />
       <main className="flex-1 wrapper">
         { children }
       </main>
       <Footer />
    </div>
  )
}

export default Layout
