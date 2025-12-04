'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpUser } from "@/db/actions/user.action";
import { signUpDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";


const SignUpButton = () => { 
    const { pending } = useFormStatus();
    return (
        <Button
            disabled={pending}
            className="w-full"
            variant="default"
        >
            { pending ? 'Submitting...' : 'Sign Up'}
        </Button>
    )
}


function SignUpForm() {

 const [data, action] = useActionState(signUpUser, {
        success: false,
        message: ''
 })
    
 const searchParams = useSearchParams();
 const callbackUrl = searchParams.get('callbackUrl') || '/';
 
    
  return (
    <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
            <div className="space-y-4">
                <Label htmlFor="email">Name</Label>
                <Input
                    type="text"
                    name="name"
                    id="name"
                    //required
                    autoComplete="name"
                    defaultValue={signUpDefaultValues.name}
                />
            </div>
            <div className="space-y-4">
                <Label htmlFor="email">Email</Label>
                <Input
                    type="email"
                    name="email"
                    id="email"
                    //required
                    autoComplete="email"
                    defaultValue={signUpDefaultValues.email}
                />
            </div>
            <div className="space-y-4">
                <Label htmlFor="password">Password</Label>
                <Input
                    type="password"
                    name="password"
                    id="password"
                    required
                    autoComplete="password"
                    defaultValue={signUpDefaultValues.password}
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    autoComplete="confirmPassword"
                    defaultValue={signUpDefaultValues.confirmPassword}
                />
            </div>
            <div>
                <SignUpButton />
            </div>
            
            { data && !data.success && (
               <div className="text-center text-destructive">{ data.message }</div> 
            )}
            
            <div className="text-sm text-center text-muted-foreground">
                Already have an account? <Link href='/sign-in' target="_self" className="link">Sign In</Link>
            </div>
        </div>   
    </form>
  )
}

export default SignUpForm;