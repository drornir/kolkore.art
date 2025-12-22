import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function DatePicker({
  date,
  onSelect,
  className,
}: {
  date: Date | null | undefined
  onSelect: (date: Date | null) => void
  className?: string
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant={'outline'}
          className={cn(
            'h-8 w-full justify-start px-2 text-left font-normal text-xs',
            !date && 'text-muted-foreground',
            className,
          )}
        >
          {date ? format(date, 'P', { locale: he }) : <span>בחר</span>}
          <CalendarIcon className="mr-auto h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={he}
          selected={date ?? undefined}
          onSelect={(d) => onSelect(d ?? null)}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
