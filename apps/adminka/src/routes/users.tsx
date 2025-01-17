import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { type components } from '@repo/api-client'
import { users } from '@repo/api-client'
import { z } from 'zod'
import { Link } from '@tanstack/react-router'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table'
import { Button } from '@repo/ui/components/button'
import { Badge } from '@repo/ui/components/badge'
import PageTitle from '@/components/PageTitle'
import UserDialog from '@/components/UserDialog'

const searchSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
})

export const Route = createFileRoute('/users')({
  validateSearch: searchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { page, limit } = Route.useSearch()
  const [selectedUser, setSelectedUser] = useState<components['schemas']['UserResponseDto'] | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const queryClient = useQueryClient()
  const navigate = Route.useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['users', { page, limit }],
    queryFn: () => users.getAll({ page, limit }),
  })

  const usersList = (data?.data ?? []) as components['schemas']['UserDto'][]
  const pagination = data?.metadata?.pagination ?? { total: 0, page: 1, limit: 10, totalPages: 1 }

  const createMutation = useMutation({
    mutationFn: (data: components['schemas']['CreateUserDto']) => users.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsDialogOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: components['schemas']['UpdateUserDto'] }) => users.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsDialogOpen(false)
    },
  })

  const handleCreate = () => {
    setSelectedUser(undefined)
    setIsDialogOpen(true)
  }

  const handleEdit = (user: components['schemas']['UserResponseDto']) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (data: components['schemas']['CreateUserDto'] | components['schemas']['UpdateUserDto']) => {
    if (selectedUser) {
      await updateMutation.mutateAsync({ id: selectedUser.id, data })
    } else {
      await createMutation.mutateAsync(data)
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
        title="Users"
        description="Manage system users and their subscriptions"
        action={
          <Button onClick={handleCreate}>
            Add User
          </Button>
        }
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Telegram ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subscriptions</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : usersList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              usersList.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.telegramId}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link to="/users/$userId" params={{ userId: user.id }}>
                        Manage
                      </Link>
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
          {usersList.length > 0 ? (
            <>Showing {(pagination?.page ?? 1) * (pagination?.limit ?? 10) + 1} - {Math.min((pagination?.page ?? 1) * (pagination?.limit ?? 10), pagination?.total ?? 0)} of {pagination?.total ?? 0}</>
          ) : (
            'No data'
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange((pagination?.page ?? 1) - 1)}
            disabled={(pagination?.page ?? 1) <= 1 || usersList.length === 0}
          >
            Previous
          </Button>
          {Array.from({ length: pagination?.totalPages ?? 0 }, (_, i) => i + 1).map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === pagination?.page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
              disabled={usersList.length === 0}
            >
              {pageNum}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange((pagination?.page ?? 1) + 1)}
            disabled={(pagination?.page ?? 1) >= (pagination?.totalPages ?? 1) || usersList.length === 0}
          >
            Next
          </Button>
        </div>
      </div>

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={selectedUser}
        onSubmit={handleSubmit}
      />
    </div>
  )
} 