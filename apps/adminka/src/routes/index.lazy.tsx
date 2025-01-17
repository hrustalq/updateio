import React, { useState } from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useUpdates, useCreateUpdate, useUpdateUpdate, useGames } from '@repo/api-client'
import { cn } from '@repo/ui/lib/utils'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card'
import { Button } from '@repo/ui/components/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@repo/ui/components/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select'
import PageTitle from '@/components/PageTitle'
import UpdateDialog from '@/components/UpdateDialog'
import { Skeleton } from '@repo/ui/components/skeleton'

interface Update {
  id: string
  gameId: string
  version?: string
  content?: string
  createdAt: string
  updatedAt: string
}

type SortField = 'createdAt' | 'version' | 'gameId'
type SortOrder = 'ASC' | 'DESC'

const ITEMS_PER_PAGE = 9

export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedUpdate, setSelectedUpdate] = useState<Update | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('DESC')

  const { data: response, isLoading: isUpdatesLoading } = useUpdates({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    gameId: selectedGameId === 'all' ? undefined : selectedGameId || undefined,
    sort: [`${sortField}:${sortOrder}`],
  })
  const { data: gamesResponse, isLoading: isGamesLoading } = useGames()
  
  const updates = response?.data ?? []
  const games = gamesResponse?.data ?? []
  const totalItems = response?.metadata?.pagination?.total ?? 0
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  const isLoading = isUpdatesLoading || isGamesLoading

  const createMutation = useCreateUpdate()
  const updateMutation = useUpdateUpdate()

  const handleCreate = () => {
    setSelectedUpdate(undefined)
    setIsDialogOpen(true)
  }

  const handleEdit = (update: Update) => {
    setSelectedUpdate(update)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (data: Omit<Update, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedUpdate) {
      await updateMutation.mutateAsync({ id: selectedUpdate.id, ...data })
    } else {
      await createMutation.mutateAsync(data)
    }
    setIsDialogOpen(false)
  }

  const getGameName = (gameId: string) => {
    return games.find(game => game.id === gameId)?.name ?? 'Неизвестная игра'
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleGameChange = (value: string | null) => {
    setSelectedGameId(value)
    setCurrentPage(1)
  }

  const handleSortChange = (value: SortField) => {
    if (value === sortField) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSortField(value)
      setSortOrder('DESC')
    }
    setCurrentPage(1)
  }

  const renderPaginationItems = () => {
    const items = []
    const maxVisiblePages = 5
    const halfVisible = Math.floor(maxVisiblePages / 2)
    
    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      )
      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-57px)] w-full container mx-auto max-w-screen-2xl p-8 gap-8">
      <PageTitle
        title="Обновления"
        description="Мониторинг и управление обновлениями игр"
        action={
          <Button onClick={handleCreate}>
            Создать обновление
          </Button>
        }
      />

      <div className="flex gap-4 items-center">
        <Select value={selectedGameId || undefined} onValueChange={handleGameChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Все игры" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все игры</SelectItem>
            {games.map((game) => (
              <SelectItem key={game.id} value={game.id}>
                {game.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={sortField === 'createdAt' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSortChange('createdAt')}
            className="flex items-center gap-1"
          >
            Дата
            {sortField === 'createdAt' && (
              <span>{sortOrder === 'ASC' ? '↑' : '↓'}</span>
            )}
          </Button>
          <Button
            variant={sortField === 'version' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSortChange('version')}
            className="flex items-center gap-1"
          >
            Версия
            {sortField === 'version' && (
              <span>{sortOrder === 'ASC' ? '↑' : '↓'}</span>
            )}
          </Button>
          <Button
            variant={sortField === 'gameId' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSortChange('gameId')}
            className="flex items-center gap-1"
          >
            Игра
            {sortField === 'gameId' && (
              <span>{sortOrder === 'ASC' ? '↑' : '↓'}</span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {isLoading ? (
          Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="flex-1">
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-28" />
              </CardFooter>
            </Card>
          ))
        ) : updates.length === 0 ? (
          <div className="col-span-full flex items-center justify-center h-full flex-1">
            Обновления не найдены
          </div>
        ) : (
          updates.map((update) => (
            <Card key={update.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {update.version ? `Версия ${update.version}` : 'Без версии'}
                    </CardTitle>
                    <CardDescription className="font-medium">
                      {getGameName(update.gameId)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground line-clamp-3">
                  {update.content || 'Нет описания'}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {new Date(update.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEdit(update)}>
                  Редактировать
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <div className="flex justify-center mt-6">
        <Pagination className="w-full">
          <PaginationContent className="w-full gap-3 justify-end">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={cn(currentPage === 1 && "pointer-events-none cursor-pointer opacity-50")}
              />
            </PaginationItem>
            
            {renderPaginationItems()}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={cn(currentPage === totalPages && "pointer-events-none opacity-50", "cursor-pointer")}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <UpdateDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        update={selectedUpdate}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
