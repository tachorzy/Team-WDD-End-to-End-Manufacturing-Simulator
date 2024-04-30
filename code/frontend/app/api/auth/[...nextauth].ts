import NextAuth, { NextAuthOptions } from "next-auth";
import CredintialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredintialsProvider({
            name: "Credentials",
            type: "credentials",
            credentials: {
                email: {
                    label: "Username",
                    type: "text",
                    placeholder: "jsmith",
                },
                password: { label: "Password", type: "password" },
            },
            authorize(credentials, req) {
                const { email, password } = credentials as {
                    email: string;
                    password: string;
                };
                if (email !== "admin" || password !== "admin") {
                    return null;
                }
                return { id: 1, name: "Admin", email: "admin" };
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin",
    },
};
export default NextAuth(authOptions);
