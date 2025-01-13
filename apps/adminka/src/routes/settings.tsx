import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/api'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form'
import { Input } from '@repo/ui/components/input'
import { Button } from '@repo/ui/components/button'
import PageTitle from '@/components/PageTitle'

const settingsSchema = z.object({
  apiUrl: z.string().url('Должен быть валидный URL'),
  discordWebhookUrl: z.string().url('Должен быть валидный URL'),
  telegramBotToken: z.string().min(1, 'Обязательное поле'),
  updateCheckInterval: z.number().min(1, 'Минимальное значение 1').max(60, 'Максимальное значение 60'),
})

type Settings = z.infer<typeof settingsSchema>

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm<Settings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      apiUrl: '',
      discordWebhookUrl: '',
      telegramBotToken: '',
      updateCheckInterval: 5,
    },
  })

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => apiClient.get('/v1/settings').then(res => res.data as Settings),
  })

  useEffect(() => {
    if (settings) {
      form.reset(settings)
    }
  }, [settings, form])

  const mutation = useMutation({
    mutationFn: (data: Settings) =>
      apiClient.patch('/v1/settings', data).then(res => res.data),
  })

  const onSubmit = async (data: Settings) => {
    try {
      await mutation.mutateAsync(data)
    } catch (error) {
      console.error('Failed to update settings:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-57px)]">
        Загрузка...
      </div>
    )
  }

  return (
    <div className='flex flex-col h-[calc(100vh-57px)] w-full container mx-auto max-w-screen-2xl p-8 gap-8'>
      <PageTitle
        title="Настройки"
        description="Системные настройки и конфигурация"
      />

      <div className='max-w-2xl'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="apiUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL API</FormLabel>
                  <FormControl>
                    <Input placeholder="https://api.example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL для подключения к основному API
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discordWebhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discord Webhook URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://discord.com/api/webhooks/..." {...field} />
                  </FormControl>
                  <FormDescription>
                    URL для отправки уведомлений в Discord
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telegramBotToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telegram Bot Token</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz" {...field} />
                  </FormControl>
                  <FormDescription>
                    Токен для Telegram бота
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="updateCheckInterval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Интервал проверки обновлений (минуты)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={60}
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Как часто проверять наличие обновлений (от 1 до 60 минут)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Сохранение...' : 'Сохранить настройки'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
} 