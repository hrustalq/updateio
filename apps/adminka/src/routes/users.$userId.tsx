import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { users, subscriptions } from '@repo/api-client'
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
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card'
import PageTitle from '@/components/PageTitle'
import UserSubscriptionsDialog from '@/components/UserSubscriptionsDialog'

const searchSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
})

export const Route = createFileRoute('/users/$userId')({
  validateSearch: searchSchema,
  component: UserDetailsComponent,
})

function UserDetailsComponent() {
  const { userId } = Route.useParams()
  const { page, limit } = Route.useSearch()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: userData } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => users.getById(userId),
  })

  const user = userData?.data

  const { data: subscriptionsData, isLoading } = useQuery({
    queryKey: ['user-subscriptions', userId, { page, limit }],
    queryFn: () => subscriptions.adminGetUserSubscriptions(userId, { page, limit }),
  })

  const createSubscriptionMutation = useMutation({
    mutationFn: (data: { gameIds: string[] }) => 
      subscriptions.adminCreateSubscription(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions', userId] })
      setIsDialogOpen(false)
    },
  })

  const deleteSubscriptionMutation = useMutation({
    mutationFn: subscriptions.adminDeleteSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions', userId] })
    },
  })

  const handleAddSubscriptions = async (data: { gameIds: string[] }) => {
    await createSubscriptionMutation.mutateAsync(data)
  }

  const handleDeleteSubscription = async (subscriptionId: string) => {
    await deleteSubscriptionMutation.mutateAsync(subscriptionId)
  }

  return (
    <div className='flex flex-col flex-1 w-full container mx-auto max-w-screen-2xl p-8 gap-8'>
      <PageTitle
        title={`User Details: ${user?.telegramId || userId}`}
        description="Manage user details and subscriptions"
        action={
          <Button onClick={() => setIsDialogOpen(true)}>
            Add Subscription
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">ID:</span> {user?.id}
            </div>
            <div>
              <span className="font-medium">Telegram ID:</span> {user?.telegramId}
            </div>
            <div>
              <span className="font-medium">Role:</span> {user?.role}
            </div>
            <div>
              <span className="font-medium">Created:</span>{' '}
              {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Total Subscriptions:</span>{' '}
              {subscriptionsData?.metadata?.pagination?.total || 0}
            </div>
            <div>
              <span className="font-medium">Active Games:</span>{' '}
              {subscriptionsData?.data?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Game</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Subscribed On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : subscriptionsData?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No subscriptions found
                  </TableCell>
                </TableRow>
              ) : (
                subscriptionsData?.data?.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>{subscription.game.name}</TableCell>
                    <TableCell>
                      {new Date(subscription.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteSubscription(subscription.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <UserSubscriptionsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        userId={userId}
        onSubmit={handleAddSubscriptions}
      />
    </div>
  )
} 