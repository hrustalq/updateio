import { ReactNode } from 'react'

interface PageTitleProps {
  title: string
  description?: string
  action?: ReactNode
}

export default function PageTitle({ title, description, action }: PageTitleProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
} 