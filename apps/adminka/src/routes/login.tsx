import React from 'react'
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@repo/credentials'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form'
import { Input } from '@repo/ui/components/input'
import { Button } from '@repo/ui/components/button'
import { Alert, AlertDescription } from '@repo/ui/components/alert'

const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Минимальная длина пароля 6 символов'),
})

type LoginForm = z.infer<typeof loginSchema>

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    // No need for beforeLoad check as the AuthProvider will handle redirects
  },
  component: LoginPage,
})

function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const { login, loading } = useAuth()

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setError(null)
      await login(data.email, data.password)
      // AuthProvider will handle the redirect
    } catch (err) {
      setError('Неверный email или пароль')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background flex-1 basis-full w-full">
      <div className="w-full max-w-lg space-y-6 bg-card rounded-xl border shadow-lg p-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            UpdateIO
          </h1>
          <p className="text-sm text-muted-foreground">
            Введите свои учетные данные для входа
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="admin@example.com"
                      type="email"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
} 