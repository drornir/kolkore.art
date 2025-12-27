import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { buttonVariants } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export type { DateRange }

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
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'h-8 w-full justify-start px-2 text-left font-normal text-xs',
          !date && 'text-muted-foreground',
          className,
        )}
      >
        {date ? format(date, 'P', { locale: he }) : <span>בחירה</span>}
        <CalendarIcon className="mr-auto h-3 w-3 opacity-50" />
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

export function DateRangePicker({
  date,
  onSelect,
  className,
  placeholder = 'בחירת תאריכים',
}: {
  date: DateRange | undefined
  onSelect: (date: DateRange | undefined) => void
  className?: string
  placeholder?: string
}) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger
          id="date"
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-8 w-full justify-start px-2 text-left font-normal text-xs',
            !date && 'text-muted-foreground',
          )}
        >
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, 'P', { locale: he })} -{' '}
                {format(date.to, 'P', { locale: he })}
              </>
            ) : (
              format(date.from, 'P', { locale: he })
            )
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="mr-auto h-3 w-3 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onSelect}
            numberOfMonths={2}
            locale={he}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
