import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Game } from '@repo/types'
import { apiClient } from '@/api'

export const Route = createFileRoute('/games')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, error } = useQuery<Game[]>({
    queryKey: ['games'],
    queryFn: () => apiClient.get('/v1/games').then(res => res.data),
  })

  return (
    <div className='w-full h-full container mx-auto max-w-screen-2xl'>
      <div className='flex flex-col gap-4'>
        {data?.map((game) => (
          <div key={game.id}>{game.name}</div>
        ))}
      </div>
    </div>
  )
}
