import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

const providers: NextAuthOptions['providers'] = [];

// Credentials login (always available — uses ADMIN_PASSWORD from .env.local)
providers.push(
  CredentialsProvider({
    id: 'credentials',
    name: 'Admin Key',
    credentials: {
      password: { label: 'Admin Key', type: 'password' },
    },
    async authorize(credentials) {
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!adminPassword || adminPassword.length < 4) {
        return null; // No admin password configured
      }
      if (credentials?.password === adminPassword) {
        return {
          id: 'admin',
          name: 'Administrator',
          email: process.env.ADMIN_EMAILS?.split(',')[0]?.trim() || 'admin@travel-to-china.local',
          image: '',
        };
      }
      return null;
    },
  })
);

// Google OAuth (only if keys are configured)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    })
  );
}

// GitHub OAuth (only if keys are configured)
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).provider = token.provider;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'travel-to-china-secret-key-change-in-production',
};
