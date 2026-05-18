import { APP_NAME } from "@/lib/constants";
import Link from "next/link";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t py-2">
      <div className="wrapper flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <p className="text-muted-foreground text-sm">&copy; {currentYear} { APP_NAME }. All Rights Reserved.</p>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
                  <Link className="opacity-75 hover:opacity-100" href="https://www.linkedin.com/in/srmntz/" target="_blank">
                      LinkedIn
                  </Link>
                  <Link className="opacity-75 hover:opacity-100" href="https://github.com/jfsar" target="_blank">
                      GitHub
                  </Link>
            </div>
      </div>
    </footer>
  )
}

export default Footer;
