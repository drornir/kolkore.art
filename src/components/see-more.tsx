import { useState } from 'react'

import { type ButtonVariantProps, buttonVariants } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

export const SeeMore = ({
  text,
  className,
  variant = 'link',
  size = 'lg',
  lines = 5,
}: {
  text: string
  lines?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
} & ButtonVariantProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const truncated = text.split('\n').slice(0, lines).join('\n').trimEnd()
  console.log(truncated)
  const shouldCollapsible = text !== truncated
  if (!shouldCollapsible) {
    return <p>{text}</p>
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex flex-col"
    >
      {!isOpen && (
        <>
          <p className={cn(`line-clamp-${lines}`)}>{truncated}</p>
          <p className="text-accent-foreground">...</p>
        </>
      )}
      <CollapsibleContent>
        <p>{text}</p>
      </CollapsibleContent>
      <CollapsibleTrigger
        className={cn(
          'ms-auto me-auto w-full',
          buttonVariants({ variant, size, className }),
        )}
      >
        {isOpen ? 'פחות' : 'עוד'}
      </CollapsibleTrigger>
    </Collapsible>
  )
}
