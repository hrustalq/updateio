import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string({ message: 'Email is required' }).email({ message: 'Email is required' }),
  password: z
    .string({ message: 'Password is required' })
    .min(1, { message: 'Password is required' }),
});
