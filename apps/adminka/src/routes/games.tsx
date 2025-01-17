import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Game, GameProvider } from '@repo/types'
import { games, gameProviders } from '@repo/api-client'
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
import GameDialog from '@/components/GameDialog'

const searchSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
})

export const Route = createFileRoute('/games')({
  validateSearch: searchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { page, limit } = Route.useSearch()
  const [selectedGame, setSelectedGame] = useState<Game | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const queryClient = useQueryClient()
  const navigate = Route.useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['games', { page, limit }],
    queryFn: () => games.getAll({ page, limit }),
  })

  const { data: providersData } = useQuery({
    queryKey: ['game-providers'],
    queryFn: () => gameProviders.getAll(),
  })

  const providersMap = React.useMemo(() => {
    const map = new Map<string, GameProvider>()
    providersData?.data?.forEach((provider) => {
      map.set(provider.id, provider)
    })
    return map
  }, [providersData?.data])

  const gamesList = data?.data ?? []
  const pagination = data?.metadata?.pagination ?? { total: 0, page: 1, limit: 10, totalPages: 1 }

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return games.create(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      setIsDialogOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      return games.update(id, formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      setIsDialogOpen(false)
    },
  })

  const handleCreate = () => {
    setSelectedGame(undefined)
    setIsDialogOpen(true)
  }

  const handleEdit = (game: Game) => {
    setSelectedGame(game)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (formData: FormData) => {
    if (selectedGame) {
      await updateMutation.mutateAsync({ id: selectedGame.id, formData })
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
        title="Игры"
        description="Управление играми в системе"
        action={
          <Button onClick={handleCreate}>
            Добавить игру
          </Button>
        }
      />

      <div className='flex-1 basis-full flex flex-col min-h-0 rounded-md border'>
        <div className="flex-1 min-h-0">
          <Table className='h-full'>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Название</TableHead>
                <TableHead className="min-w-[300px]">Описание</TableHead>
                <TableHead className="w-[100px]">Изображение</TableHead>
                <TableHead className="w-[200px]">Провайдер</TableHead>
                <TableHead className="w-[150px]">Дата создания</TableHead>
                <TableHead className="w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-auto h-full">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-[200px]">
                    <div className="flex items-center justify-center h-full">
                      Загрузка...
                    </div>
                  </TableCell>
                </TableRow>
              ) : gamesList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-full">
                    <div className="flex items-center justify-center h-full">
                      Игры не найдены
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                gamesList.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell className="font-medium">{game.name}</TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {game.description}
                    </TableCell>
                    <TableCell>
                      {game.imageUrl && (
                        <img
                          src={game.imageUrl}
                          alt={game.name}
                          className="w-10 h-10 object-cover rounded-md"
                        />
                      )}
                    </TableCell>
                    <TableCell>{providersMap.get(game.providerId)?.name}</TableCell>
                    <TableCell>
                      {new Date(game.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(game)}
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
            {gamesList.length > 0 ? (
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
              disabled={(pagination?.page ?? 1) <= 1 || gamesList.length === 0}
            >
              Предыдущая
            </Button>
            {Array.from({ length: pagination?.totalPages ?? 0 }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === pagination?.page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                disabled={gamesList.length === 0}
              >
                {pageNum}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange((pagination?.page ?? 1) + 1)}
              disabled={(pagination?.page ?? 1) >= (pagination?.totalPages ?? 1) || gamesList.length === 0}
            >
              Следующая
            </Button>
          </div>
        </div>
      </div>

      <GameDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        game={selectedGame}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
