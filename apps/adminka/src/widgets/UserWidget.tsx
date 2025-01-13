import { useNavigate } from '@tanstack/react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { Button } from '@repo/ui/components/button'
import { Avatar, AvatarFallback } from '@repo/ui/components/avatar'
import { useAuthStore } from '@/lib/auth'
import { logout } from '@/api/auth'

export default function UserWidget() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !user) {
    return (
      <Button variant="outline" onClick={() => navigate({ to: '/login' })}>
        Войти
      </Button>
    )
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate({ to: '/login' })
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={handleLogout}
        >
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}