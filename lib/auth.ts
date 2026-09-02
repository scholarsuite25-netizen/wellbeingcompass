import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { env } from "./env";

// Validate env at import — fails fast if NEXTAUTH_SECRET missing in production
void env.NEXTAUTH_SECRET;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: { label:"Email", type:"email"}, password:{ label:"Password", type:"password"} },
      async authorize(credentials){
        if(!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where:{ email: credentials.email }});
        if(!user || !user.password) return null;
        const ok = await bcrypt.compare(credentials.password, user.password);
        if(!ok) return null;
        return { id: user.id, email: user.email!, name: user.name ?? undefined, image: user.image ?? undefined, role: (user as any).role } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }){
      if(user) (token as any).role = (user as any).role;
      // refresh role from DB on each jwt
      if(token.email){
        const dbUser = await prisma.user.findUnique({ where:{ email: token.email }});
        if(dbUser) (token as any).role = dbUser.role;
      }
      return token;
    },
    async session({ session, token }){
      if(session.user) (session.user as any).role = (token as any).role;
      return session;
    }
  },
  pages: { signIn: "/login" },
};
