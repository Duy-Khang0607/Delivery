import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/db";
import bcrypt from "bcryptjs";
import User, { IUser } from "./models/user.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {
                    type: "email",
                    label: "Email",
                    placeholder: "johndoe@gmail.com",
                },
                password: {
                    type: "password",
                    label: "Password",
                    placeholder: "*****",
                },
            },
            authorize: async (credentials, request) => {
                try {
                    await connectDB();
                    const { email, password } = credentials as { email: string, password: string };
                    const user = await User.findOne({ email });
                    if (!user) {
                        throw new Error("User not found");
                    }
                    const isPasswordCorrect = await bcrypt.compare(password, user.password);
                    if (!isPasswordCorrect) {
                        throw new Error("Incorrect password");
                    }
                    return user;
                } catch (error) {
                    throw new Error("Internal server error");
                }
            }
        })
    ],
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                token.id = user.id as string;
                token.name = user.name as string;
                token.email = user.email as string;
                token.role = user.role as string;
            }
            return token;
        },
        session: ({ session, token }) => {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
}) 