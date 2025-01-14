import React from 'react';
import { Link } from "@tanstack/react-router"

import { cn } from "@repo/ui/lib/utils"
import UserWidget from "@/widgets/UserWidget"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@repo/ui/components/navigation-menu"

export default function PageHeader({ className }: { className?: string }) {
  return (
    <header className={cn('flex w-full px-4 py-2 border-b bg-background', className)}>
      <div className="container mx-auto max-w-screen-2xl w-full flex justify-between items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className="font-medium">
                Главная
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Игры</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[400px]">
                  <div className="grid grid-cols-1 gap-2">
                    <Link
                      to="/game-providers"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Провайдеры игр</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Управление провайдерами игр и их настройками
                      </p>
                    </Link>
                    <Link
                      to="/games"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Игры</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Управление играми и их обновлениями
                      </p>
                    </Link>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Пользователи</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[400px]">
                  <div className="grid grid-cols-1 gap-2">
                    <Link
                      to="/users"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Пользователи</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Управление пользователями и их подписками
                      </p>
                    </Link>
                    <Link
                      to="/messages"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Сообщения</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Просмотр и управление сообщениями пользователей
                      </p>
                    </Link>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Система</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[400px]">
                  <div className="grid grid-cols-1 gap-2">
                    <Link
                      to="/updates"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Обновления</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Мониторинг и управление обновлениями игр
                      </p>
                    </Link>
                    <Link
                      to="/settings"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Настройки</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Системные настройки и конфигурация
                      </p>
                    </Link>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <UserWidget />
      </div>
    </header>
  )
}
