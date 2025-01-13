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

interface User {
  id: string
  username: string
  email: string
  createdAt: string
  updatedAt: string
}

export const Route = createFileRoute('/users')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => apiClient.get('/v1/users').then(res => res.data.data),
  })

  return (
    <div className='flex flex-col h-[calc(100vh-57px)] w-full container mx-auto max-w-screen-2xl p-8 gap-8'>
      <PageTitle
        title="Пользователи"
        description="Управление пользователями системы"
      />

      <div className='flex-1 flex flex-col min-h-0 rounded-md border'>
        <div className="flex-1 min-h-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя пользователя</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Дата регистрации</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-[200px]">
                    <div className="flex items-center justify-center h-full">
                      Загрузка...
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-[200px]">
                    <div className="flex items-center justify-center h-full">
                      Пользователи не найдены
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
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