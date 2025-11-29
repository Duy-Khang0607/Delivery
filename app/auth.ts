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
            async authorize(credentials, request) {
                try {
                    await connectDB();
                    const { email, password } = credentials as { email: string, password: string };
                    const user = await User.findOne({ email }) as IUser;
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

}) 