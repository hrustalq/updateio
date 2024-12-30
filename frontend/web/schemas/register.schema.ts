import * as z from 'zod';

export const RegisterSchema = z.object({
  email: z.string({ message: 'Email is required' }).email({ message: 'Email is required' }),
  password: z
    .string({ message: 'Password is required' })
    .min(6, { message: 'Minimum 6 characters required' }),
});
