"use client";

import { MailIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";

function EmailIcon() {
  const myEmail = "john.sarmiento452@gmail.com";
  
  const handleEmailClick = async () => {
    try {
        await navigator.clipboard.writeText(myEmail);
        toast.success('Success', {
            description: 'Email has been copied to clipboard.'
        });
    } catch (error) {
        toast.error('Error', {
            description: 'Failed to copy email address to clipboard.',
            style: {
                backgroundColor: 'var(--destructive)'
            },
        });
    }
  }
  
  return (
    <Button className="opacity-75 hover:opacity-100 cursor-pointer" variant={"ghost"} onClick={handleEmailClick} size="icon" asChild>
        <MailIcon className="w-5 h-6" />
    </Button>
  )
}

export default EmailIcon;
