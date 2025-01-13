import { Button } from '@repo/ui/components/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/unauthorized')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='h-screen w-screen flex flex-col gap-2 items-center justify-center bg-background fixed top-0 left-0 overflow-hidden unauthorized'>
      <h1 className='text-xl font-bold'>Unauthorized</h1>
      <p className='text-sm text-muted-foreground'>Для доступа к вебсайту необходимо авторизоваться</p>
      <Button variant='outline' className='my-4'>Войти</Button>
    </div>
  )
}