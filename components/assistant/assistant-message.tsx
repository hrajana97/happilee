import { cn } from '@/lib/utils'
import { AssistantCharacter } from './assistant-character'

interface AssistantMessageProps {
  children: React.ReactNode
  className?: string
}

export function AssistantMessage({ children, className }: AssistantMessageProps) {
  return (
    <div className="flex gap-2">
      <AssistantCharacter size="sm" className="mt-2" />
      <div className={cn("rounded-lg bg-sage-100 px-4 py-2", className)}>
        {children}
      </div>
    </div>
  )
}

