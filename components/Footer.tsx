import { APP_NAME } from "@/lib/constants";
import LinkedIn from "./icons/LinkedInIcon";
import Github from "./icons/GithubIcon";
import Link from "next/link";
import { MailIcon } from "lucide-react";
import EmailIcon from "./icons/EmailIcon";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t py-2">
      <div className="wrapper flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <p className="text-muted-foreground text-sm">&copy; {currentYear} { APP_NAME }. All Rights Reserved.</p>
            </div>
            
            <div className="flex items-center gap-3">
                  <Link className="opacity-75 hover:opacity-100" href="https://www.linkedin.com/in/srmntz/" target="_blank">
                      <LinkedIn className="w-5 h-5" />
                  </Link>
                  <Link className="opacity-75 hover:opacity-100" href="https://github.com/jfsar" target="_blank">
                      <Github className="w-5 h-5" />
                  </Link>
                  <EmailIcon />
            </div>
      </div>
    </footer>
  )
}

export default Footer;
