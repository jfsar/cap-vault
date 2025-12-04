import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import { neon } from "@neondatabase/serverless";
import Credentials from "next-auth/providers/credentials"
import { verifyPassword } from './lib/utils';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export const config = {
    providers: [
        Credentials({
            credentials: {
                email: { type: 'email' },
                password: { type: 'password' },
            },
            authorize: async (credentials) => {
                if (credentials === null) {
                    return null;
                }

                //find user from the database
                try {
                    const users = await sql`
                        SELECT id, email, name, role, password 
                        FROM "User"
                        WHERE email = ${(credentials.email as string)}
                    `;

                    if (users.length === 0) return null;

                     const user = users[0];

                    //check if user exists and password matches
                    if (user && user.password) {
                        const isMatch = verifyPassword(credentials.password as string, user.password);

                        //if password match, return user
                        if (isMatch) {
                            return {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                role: user.role,
                            };
                        }
                    }

                    //if user does not exist and the password does not match return null
                    return null;
                } catch (error) {
                    console.error('Error during user authentication:', error);
                    return null;
                }
            }
        }),
    ],
    callbacks: {
        async session({ session, user, token, trigger }: any) {
            // Set the user Id from the token
            session.user.id = token.sub;
            session.user.role = token.role;
            session.user.name = token.name;
            //if there is an update, set the user name
            if (trigger === 'update') {
                session.user.name = user.name;
            }
            return session;
        },

        async jwt({ token, user, trigger, session }: any) {
            // Assing user fields to the token
            if (user) {
                token.role = user?.role;
                
                // if user has no name then use email
                if (user.name === 'NO_NAME') { 
                    token.name = user.email!.split('@')[0];
                    // update the db to reflect the token name
                    try {
                        const result = await sql`
                        UPDATE "User"
                        SET 
                            name = ${token.name}
                            WHERE id = ${user.id}
                            RETURNING id, name, email
                        `;
    
                        if (result.length === 0) {
                           throw new Error('User not found');
                        }
                    } catch (error) {
                        throw error;
                    }
                }
            }
            
            return token;
        },
        authorized: async ({ request, auth }) => { 
            // Check for session cart cookie
            if (!request.cookies.get('sessionCartId')) {

                // generate new session cart id cookie
                const sessionCartId = crypto.randomUUID();

                // clone request headers
                const newRequestHeaders = new Headers(request.headers);
                
                // create new response and pass the headers
                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeaders,
                    }
                });

                // set new generated sessionCartId to the cookies
                response.cookies.set('sessionCartId', sessionCartId);

                response.headers.set('Cache-Control', 'no-store, must-revalidate');
                response.headers.set('Pragma', 'no-cache');

                return response;
            } else {
                return true;
             }
        }
    },
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: { 
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    // adapter: PrismaAdapter(prisma)
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);