'use server';

import * as z from 'zod';

import { RegisterSchema } from '@/schemas/register.schema';

import bcrypt from 'bcrypt';

import db from '@/lib/db';
import { $Enums } from '@prisma/client';
import { getUserByEmail } from '@/data/user.data';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const { data, success, error } = RegisterSchema.safeParse(values);

  if (!success) {
    return { error: 'Invalid fields' };
  }

  if (error) {
    return { error: error };
  }

  const { email, password } = data;

  const exists = await getUserByEmail(email);

  if (exists) {
    return {
      error: 'Email already in use',
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      email: email,
      password: hashedPassword,
      role: [$Enums.Role.USER],
    },
  });

  return {
    success: 'Account created',
  };
};
