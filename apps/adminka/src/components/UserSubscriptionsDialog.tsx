import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useGames } from '@repo/api-client'

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
import { Button } from '@repo/ui/components/button'
import { MultiSelect } from '@repo/ui/components/multi-select'

const formSchema = z.object({
  gameIds: z.array(z.string()).min(1, 'Select at least one game'),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onSubmit: (data: FormValues) => Promise<void>
}

export default function UserSubscriptionsDialog({ open, onOpenChange, userId, onSubmit }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameIds: [],
    },
  })

  const { data: gamesResponse } = useGames()
  const games = gamesResponse?.data ?? []

  const handleSubmit = async (values: FormValues) => {
    await onSubmit(values)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Subscriptions</DialogTitle>
          <DialogDescription>
            Select games to subscribe the user to
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="gameIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Games</FormLabel>
                  <MultiSelect
                    values={field.value}
                    onValuesChange={field.onChange}
                    placeholder="Select games"
                    options={games.map(game => ({
                      label: game.name,
                      value: game.id,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Subscriptions</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 