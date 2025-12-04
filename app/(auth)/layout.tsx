import { APP_DESCRIPTION, APP_NAME, APP_URL } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: `${APP_DESCRIPTION}`,
  metadataBase: new URL(APP_URL)
};

function AuthLayout({ children }: {children: React.ReactNode}) {
  return (
    <div className="flex-center min-h-screen">
          { children }
    </div>
  )
}

export default AuthLayout
