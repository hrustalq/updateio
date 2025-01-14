import React from 'react'
import { useAuth } from '@repo/credentials'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { Button } from '@repo/ui/components/button'

export default function UserWidget() {
  const { logout, loading, user } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <span className="font-medium">{user?.email?.charAt(0).toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={loading}
          onClick={() => logout()}
          className="text-red-600 cursor-pointer"
        >
          {loading ? 'Выход...' : 'Выйти'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}