import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User, { IUser } from '@/models/User';
import bcryptjs from 'bcryptjs';
import connectDB from '@/lib/db';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email }).select('+password');

        if (!user) {
          throw new Error('No user found with this email');
        }

        const isPasswordCorrect = await bcryptjs.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error('Incorrect password');
        }

        // Return a plain object, not the Mongoose document
        const userObject = user.toObject();
        // Remove password from the object returned to the client
        delete userObject.password;
        return userObject;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Note: user._id is typically a Mongoose ObjectId, convert to string
        token.id = (user as any)._id?.toString() || (user as any).id;
        token.email = (user as any).email;
        token.name = (user as any).name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
