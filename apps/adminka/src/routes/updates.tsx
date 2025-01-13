import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table'
import PageTitle from '@/components/PageTitle'

interface Update {
  id: string
  gameId: string
  version: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
}

export const Route = createFileRoute('/updates')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: updates = [], isLoading } = useQuery<Update[]>({
    queryKey: ['updates'],
    queryFn: () => apiClient.get('/v1/updates').then(res => res.data.data),
  })

  return (
    <div className='flex flex-col h-[calc(100vh-57px)] w-full container mx-auto max-w-screen-2xl p-8 gap-8'>
      <PageTitle
        title="Обновления"
        description="Мониторинг и управление обновлениями игр"
      />

      <div className='flex-1 flex flex-col min-h-0 rounded-md border'>
        <div className="flex-1 min-h-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID игры</TableHead>
                <TableHead>Версия</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-[200px]">
                    <div className="flex items-center justify-center h-full">
                      Загрузка...
                    </div>
                  </TableCell>
                </TableRow>
              ) : updates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-[200px]">
                    <div className="flex items-center justify-center h-full">
                      Обновления не найдены
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                updates.map((update) => (
                  <TableRow key={update.id}>
                    <TableCell>{update.gameId}</TableCell>
                    <TableCell>{update.version}</TableCell>
                    <TableCell className="max-w-[400px] truncate">
                      {update.description}
                    </TableCell>
                    <TableCell>
                      {update.status === 'pending' && 'Ожидает'}
                      {update.status === 'in_progress' && 'В процессе'}
                      {update.status === 'completed' && 'Завершено'}
                      {update.status === 'failed' && 'Ошибка'}
                    </TableCell>
                    <TableCell>
                      {new Date(update.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
} 