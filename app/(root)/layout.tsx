import Footer from "@/components/Footer";
import Header from "@/components/shared/header";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-50 w-full bg-background border-b border-border">
        <Header />
      </div>
      <main className="wrapper flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout;