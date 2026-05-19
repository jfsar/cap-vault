import { APP_NAME } from "@/lib/constants";
import Link from "next/link";

const CURRENT_YEAR = new Date().getFullYear();

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/srmntz/" },
  { label: "GitHub", href: "https://github.com/jfsar" },
];

function Footer() {
  return (
    <footer className="border-t py-2">
      <div className="wrapper flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2">
          <p className="text-muted-foreground text-sm">
            &copy; {CURRENT_YEAR} {APP_NAME}. All Rights Reserved.
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {SOCIAL_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-75 hover:opacity-100"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;