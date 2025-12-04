'use server';

import prisma from "@/lib/prima-client";
import { signInSchema, signUpFormSchema } from "@/types/validator";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatErrors, hashedPassword } from "@/lib/utils";


export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        const user = signInSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
        });
        await signIn('credentials', user);
        return { success: true, message: 'Signed in successfully.'};
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        
        return {success: false, message: 'Invalid email or password.'};
    }
}
 
export async function signOutUser() { 
    await signOut({redirect: true, redirectTo: '/sign-in'});
}


export async function signUpUser(prevState: unknown, formData: FormData) {

    try {
        const user = signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        });

        const plainPassword = user.password;

        user.password = hashedPassword(user.password);

        const newUser = await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password
            }
        });

        await signIn('credentials', {
            email: newUser.email,
            password: plainPassword
        })

        return { success: true, message: 'User registered successfully.'}

    } catch (error) {
        return formatErrors(error);
    }
 }