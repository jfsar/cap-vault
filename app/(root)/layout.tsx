import Footer from "@/components/Footer";
import Header from "@/components/shared/header";


function RootLayout({ children }: {children: React.ReactNode}) {
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

export default RootLayout;
