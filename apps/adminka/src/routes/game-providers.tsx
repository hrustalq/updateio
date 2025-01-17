import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { GameProvider } from '@repo/types'
import { gameProviders } from '@repo/api-client'
import { z } from 'zod'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table'
import { Button } from '@repo/ui/components/button'
import PageTitle from '@/components/PageTitle'
import GameProviderDialog from '@/components/GameProviderDialog'

const searchSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
})

export const Route = createFileRoute('/game-providers')({
  validateSearch: searchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { page, limit } = Route.useSearch()
  const [selectedProvider, setSelectedProvider] = useState<GameProvider | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const queryClient = useQueryClient()
  const navigate = Route.useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['game-providers', { page, limit }],
    queryFn: () => gameProviders.getAll({ page, limit }),
  })

  const providers = data?.data ?? []
  const pagination = data?.metadata?.pagination ?? { total: 0, page: 1, limit: 10, totalPages: 1 }

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => gameProviders.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-providers'] })
      setIsDialogOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => gameProviders.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-providers'] })
      setIsDialogOpen(false)
    },
  })

  const handleCreate = () => {
    setSelectedProvider(undefined)
    setIsDialogOpen(true)
  }

  const handleEdit = (provider: GameProvider) => {
    setSelectedProvider(provider)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (formData: FormData) => {
    if (selectedProvider) {
      await updateMutation.mutateAsync({ id: selectedProvider.id, formData })
    } else {
      await createMutation.mutateAsync(formData)
    }
  }

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
      replace: true,
    })
  }

  return (
    <div className='flex flex-col flex-1 w-full container mx-auto max-w-screen-2xl p-8 gap-8'>
      <PageTitle
        title="Провайдеры игр"
        description="Управление провайдерами игр в системе"
        action={
          <Button onClick={handleCreate}>
            Добавить провайдера
          </Button>
        }
      />

      <div className='flex-1 flex flex-col min-h-0 rounded-md border'>
        <div className="flex-1 min-h-0">
          <Table className='h-full'>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Название</TableHead>
                <TableHead className="min-w-[300px]">Описание</TableHead>
                <TableHead className="w-[100px]">Изображение</TableHead>
                <TableHead className="w-[150px]">Дата создания</TableHead>
                <TableHead className="w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-auto h-full">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-[200px]">
                    <div className="flex items-center justify-center h-full">
                      Загрузка...
                    </div>
                  </TableCell>
                </TableRow>
              ) : providers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-full">
                    <div className="flex items-center justify-center h-full">
                      Провайдеры не найдены
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                providers.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell className="font-medium">{provider.name}</TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {provider.description}
                    </TableCell>
                    <TableCell>
                      {provider.imageUrl && (
                        <img
                          src={provider.imageUrl}
                          alt={provider.name}
                          className="w-10 h-10 object-cover rounded-md"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(provider.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(provider)}
                      >
                        Редактировать
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-4 py-4 border-t bg-white">
          <div className="text-sm text-muted-foreground">
            {providers.length > 0 ? (
              <>Показано {(pagination?.page ?? 1) * (pagination?.limit ?? 10) + 1} - {Math.min((pagination?.page ?? 1) * (pagination?.limit ?? 10), pagination?.total ?? 0)} из {pagination?.total ?? 0}</>
            ) : (
              'Нет данных'
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange((pagination?.page ?? 1) - 1)}
              disabled={(pagination?.page ?? 1) <= 1 || providers.length === 0}
            >
              Предыдущая
            </Button>
            {Array.from({ length: pagination?.totalPages ?? 0 }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === pagination?.page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                disabled={providers.length === 0}
              >
                {pageNum}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange((pagination?.page ?? 1) + 1)}
              disabled={(pagination?.page ?? 1) >= (pagination?.totalPages ?? 1) || providers.length === 0}
            >
              Следующая
            </Button>
          </div>
        </div>
      </div>

      <GameProviderDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        gameProvider={selectedProvider}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
