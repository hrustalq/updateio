'use server';

import * as z from 'zod';
import { AuthError } from 'next-auth';

import { signIn } from '@/auth';

import { LoginSchema } from '@/schemas/login.schema';
import { DEFAULT_LOGIN_REDIRECT } from '@/schemas/routes.schema';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const { data, success, error } = LoginSchema.safeParse(values);

  if (!success) {
    return { error: 'Invalid fields' };
  }

  const { email, password } = data;

  try {
    const data = await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            error: 'Invalid credentials',
          };
        default:
          return {
            error: 'Something went wrong',
          };
      }
    }
    throw error;
  }
};
