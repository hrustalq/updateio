import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@repo/ui/components/dialog'
import { Button } from '@repo/ui/components/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form'
import { Input } from '@repo/ui/components/input'
import { Textarea } from '@repo/ui/components/textarea'
import { GameProvider } from '@repo/types'

const gameProviderFormSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().nullable(),
  imageUrl: z.string().url('Должен быть валидный URL').nullable(),
})

type GameProviderFormValues = z.infer<typeof gameProviderFormSchema>

interface GameProviderDialogProps {
  gameProvider?: GameProvider
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: GameProviderFormValues) => Promise<void>
}

export default function GameProviderDialog({
  gameProvider,
  open,
  onOpenChange,
  onSubmit,
}: GameProviderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<GameProviderFormValues>({
    resolver: zodResolver(gameProviderFormSchema),
    defaultValues: {
      name: gameProvider?.name ?? '',
      description: gameProvider?.description ?? '',
      imageUrl: gameProvider?.imageUrl ?? '',
    },
  })

  const handleSubmit = async (data: GameProviderFormValues) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error('Failed to submit game provider:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {gameProvider ? 'Редактировать провайдера' : 'Создать провайдера'}
          </DialogTitle>
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
                    <Input placeholder="Введите название провайдера" {...field} />
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
                    <Textarea
                      placeholder="Введите описание провайдера"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL изображения</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Введите URL изображения"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
