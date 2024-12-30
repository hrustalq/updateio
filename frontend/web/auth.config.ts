import Credentials from 'next-auth/providers/credentials';

import { type NextAuthConfig } from 'next-auth';

import { LoginSchema } from '@/schemas/login.schema';
import { getUserByEmail } from '@/data/user.data';

import bcrypt from 'bcryptjs';

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return user;
          }
          return null;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
