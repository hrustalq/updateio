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
  DialogDescription,
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

const formSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  image: z.instanceof(File).optional(),
})


type FormValues = z.infer<typeof formSchema>

interface GameProviderDialogProps {
  gameProvider?: GameProvider
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => Promise<void>
}

export default function GameProviderDialog({
  gameProvider,
  open,
  onOpenChange,
  onSubmit,
}: GameProviderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: gameProvider?.name ?? '',
      description: gameProvider?.description ?? '',
    },
  })

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true)
      const formData = new FormData()
      
      if (values.name) formData.append('name', values.name)
      if (values.description) formData.append('description', values.description)
      if (values.image) formData.append('image', values.image)

      await onSubmit(formData)
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error('Failed to create game provider:', error)
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
          <DialogDescription>
            {gameProvider 
              ? 'Измените данные провайдера игр' 
              : 'Заполните данные для нового провайдера игр'
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
