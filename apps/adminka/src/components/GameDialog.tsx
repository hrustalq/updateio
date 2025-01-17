import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import type { Game, GameProvider, PaginatedResponse } from '@repo/types'
import { gameProviders } from '@repo/api-client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@repo/ui/components/dialog'
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
import { Textarea } from '@repo/ui/components/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select'

const formSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  providerId: z.string().min(1, 'Провайдер обязателен'),
  externalId: z.string().optional(),
  image: z.instanceof(File).optional(),
  imageUrl: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface GameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  game?: Game
  onSubmit: (data: FormData) => Promise<void>
}

export default function GameDialog({ open, onOpenChange, game, onSubmit }: GameDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: game?.name ?? '',
      description: game?.description ?? '',
      providerId: game?.providerId ?? '',
      externalId: game?.externalId ?? '',
      imageUrl: game?.imageUrl ?? '',
    },
  })

  const { data: providersData } = useQuery({
    queryKey: ['game-providers'],
    queryFn: () => gameProviders.getAll(),
  })

  const providers = providersData?.data ?? []

  const handleSubmit = async (values: FormValues) => {
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        if (value instanceof File) {
          formData.append('image', value)
        } else {
          formData.append(key, value)
        }
      }
    })

    await onSubmit(formData)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{game ? 'Редактировать игру' : 'Добавить игру'}</DialogTitle>
          <DialogDescription>
            {game 
              ? 'Измените основную информацию об игре, включая название, описание и провайдера' 
              : 'Заполните основную информацию о новой игре, включая название, описание и провайдера'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите название игры" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Введите описание игры" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="providerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Провайдер</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите провайдера" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {providers.map((provider: GameProvider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="externalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Внешний ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите внешний ID игры" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Изображение</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          onChange(file)
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {game && (
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL изображения</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите URL изображения" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type="submit">
                {game ? 'Сохранить' : 'Создать'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 