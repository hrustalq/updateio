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

interface Message {
  id: string
  userId: string
  content: string
  createdAt: string
  updatedAt: string
  status: 'unread' | 'read' | 'archived'
}

export const Route = createFileRoute('/messages')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: () => apiClient.get('/v1/messages').then(res => res.data.data),
  })

  return (
    <div className='flex flex-col h-[calc(100vh-57px)] w-full container mx-auto max-w-screen-2xl p-8 gap-8'>
      <PageTitle
        title="Сообщения"
        description="Просмотр и управление сообщениями пользователей"
      />

      <div className='flex-1 flex flex-col min-h-0 rounded-md border'>
        <div className="flex-1 min-h-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID пользователя</TableHead>
                <TableHead>Сообщение</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-[200px]">
                    <div className="flex items-center justify-center h-full">
                      Загрузка...
                    </div>
                  </TableCell>
                </TableRow>
              ) : messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-[200px]">
                    <div className="flex items-center justify-center h-full">
                      Сообщения не найдены
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>{message.userId}</TableCell>
                    <TableCell className="max-w-[400px] truncate">
                      {message.content}
                    </TableCell>
                    <TableCell>
                      {message.status === 'unread' && 'Не прочитано'}
                      {message.status === 'read' && 'Прочитано'}
                      {message.status === 'archived' && 'В архиве'}
                    </TableCell>
                    <TableCell>
                      {new Date(message.createdAt).toLocaleDateString()}
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