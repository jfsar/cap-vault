'use server';

import prisma from "@/lib/prima-client";
import { paymentMethodsScehma, shippingAddressSchema, signInSchema, signUpFormSchema } from "@/types/validator";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatErrors, hashedPassword } from "@/lib/utils";
import { PaymentMethodType, ShippingAddress } from "@/types";
import { PAGE_SIZE } from "@/lib/constants";
import { revalidatePath } from "next/cache";


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
 
export async function getUserById(userId: string) { 
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        }
    });
    
    return user;
}

export async function updateUserAddress(data: ShippingAddress) {
    try {
        const session = await auth();

        const currentUser = await prisma.user.findUnique({
            where: {
                id: session?.user?.id,
            }
        });

        if (!currentUser) throw new Error('User not found.');

        const address = shippingAddressSchema.parse(data);

        await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                address
            }
        });

        return {
            success: true,
            message: 'Address successfully updated.'
        };

    } catch (error) {
        return formatErrors(error);
    }
}
 
// Update user payment method
export async function updateUserPaymentMethod(data: PaymentMethodType) { 
    try {
        const session = await auth();

        const currentUser = await prisma.user.findUnique({
            where: {
                id: session?.user?.id
            }
        });

        if (!currentUser) throw new Error('User not found.');

        const paymentMethod = paymentMethodsScehma.parse(data);

        await prisma.user.update({
            where: { id: currentUser.id },
            data: { paymentMethod: paymentMethod.type }
        });

        return {
            success: true,
            message: 'User payment method updated successfully.'
        };

    } catch (error) {
        return formatErrors(error);
    }
}


export async function updateProfile(user: { name: string; email: string }) {
    try {
      const session = await auth();
  
      const currentUser = await prisma.user.findFirst({
        where: {
          id: session?.user?.id,
        },
      });
  
      if (!currentUser) throw new Error('User not found');
  
      await prisma.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          name: user.name,
        },
      });
  
      return {
        success: true,
        message: 'User updated successfully',
      };
    } catch (error) {
      return formatErrors(error);
    }
}
  
export async function getAllUsers({ limit = PAGE_SIZE, page }: { limit?: number; page: number }) {
    const data = await prisma.user.findMany({
        orderBy: { createdAt: 'desc'},
        take: limit,
        skip: (page -1) * limit,
    });

    const dataCount = await prisma.user.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit),
    };
}
 
export async function deleteUser(id: string) {
    try {
        await prisma.user.delete({
            where: { id: id}
        });
        revalidatePath('/admin/users');
        return {
            success: true,
            message: 'User deleted successfully.'
        };

    } catch (error) {
        return formatErrors(error);
    }
 }