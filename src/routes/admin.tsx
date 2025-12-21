import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import {
  Archive,
  ArchiveRestore,
  CalendarIcon,
  ExternalLink,
  Loader2,
  Maximize2,
  Plus,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Call, CallNoId } from '@/data/calls'
import { cn } from '@/lib/utils'
import {
  archiveCall,
  createCall,
  getAdminCalls,
  updateCall,
} from '@/server/calls'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  const queryParams = {
    filters: {},
    sort: { by: 'createdAt' as const, order: 'desc' as const },
    pagination: { offset: 0, limit: 100 },
  }

  const { data: calls } = useSuspenseQuery({
    queryKey: ['admin-calls', queryParams],
    queryFn: () => getAdminCalls({ data: queryParams }),
  })

  return (
    <div className="container mx-auto py-10 px-4" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ניהול קולות קוראים</h1>
      </div>

      <div className="border rounded-md shadow-sm bg-card">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12.5 text-center">#</TableHead>
                <TableHead className="min-w-37.5 text-right">כותרת</TableHead>
                <TableHead className="min-w-30 text-right">מוסד</TableHead>
                <TableHead className="min-w-25 text-right">סוג</TableHead>
                <TableHead className="min-w-25 text-right">מיקום</TableHead>
                <TableHead className="w-30 text-center">דדליין</TableHead>
                <TableHead className="w-20 text-center">תיאור</TableHead>
                <TableHead className="w-20 text-center">דרישות</TableHead>
                <TableHead className="w-12.5 text-center">קישור</TableHead>
                <TableHead className="w-20 text-center">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <NewCallRow />
              {calls.map((call) => (
                <EditableCallRow key={call.id} call={call} />
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>
    </div>
  )
}

function NewCallRow() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [data, setData] = useState<Partial<CallNoId>>({
    title: '',
    institution: '',
    type: '',
    location: '',
    description: '',
    requirements: [],
    link: '',
    deadline: null,
  })

  const createMutation = useMutation({
    mutationFn: async (newData: Partial<CallNoId>) => {
      // Ensure required fields
      if (!newData.title) throw new Error('כותרת היא שדה חובה')

      const submissionData = {
        title: newData.title,
        institution: newData.institution || null,
        type: newData.type || null,
        location: newData.location || null,
        description: newData.description || null,
        requirements: newData.requirements?.length
          ? newData.requirements
          : null,
        link: newData.link || null,
        deadline: newData.deadline || null,
      }
      return await createCall({ data: submissionData })
    },
    onSuccess: () => {
      toast.success('נוצר בהצלחה')
      setData({
        title: '',
        institution: '',
        type: '',
        location: '',
        description: '',
        requirements: [],
        link: '',
        deadline: null,
      })
      queryClient.invalidateQueries({ queryKey: ['admin-calls'] })
      router.invalidate()
    },
    onError: (err) => toast.error(err.message),
  })

  const handleChange = (
    field: keyof CallNoId,
    value: CallNoId[keyof CallNoId],
  ) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    createMutation.mutate(data)
  }

  return (
    <TableRow className="bg-primary/5 hover:bg-primary/10 transition-colors border-b-2 border-primary/20">
      <TableCell className="text-center">
        <Plus className="w-4 h-4 mx-auto text-primary" />
      </TableCell>
      <TableCell>
        <Input
          placeholder="כותרת חדשה..."
          value={data.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="h-8 bg-background"
        />
      </TableCell>
      <TableCell>
        <Input
          placeholder="מוסד"
          value={data.institution ?? ''}
          onChange={(e) => handleChange('institution', e.target.value)}
          className="h-8 bg-background"
        />
      </TableCell>
      <TableCell>
        <Input
          placeholder="סוג"
          value={data.type ?? ''}
          onChange={(e) => handleChange('type', e.target.value)}
          className="h-8 bg-background"
        />
      </TableCell>
      <TableCell>
        <Input
          placeholder="מיקום"
          value={data.location ?? ''}
          onChange={(e) => handleChange('location', e.target.value)}
          className="h-8 bg-background"
        />
      </TableCell>
      <TableCell>
        <DatePicker
          date={data.deadline}
          onSelect={(d) => handleChange('deadline', d)}
        />
      </TableCell>
      <TableCell className="text-center">
        <LongTextEditor
          title="תיאור"
          value={data.description ?? ''}
          onSave={(val) => handleChange('description', val)}
          placeholder="ערוך תיאור..."
        />
      </TableCell>
      <TableCell className="text-center">
        <LongTextEditor
          title="דרישות"
          value={data.requirements ? data.requirements.join('\n') : ''}
          onSave={(val) =>
            handleChange(
              'requirements',
              val
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
          placeholder="ערוך דרישות..."
        />
      </TableCell>
      <TableCell className="text-center">
        <Input
          placeholder="https://..."
          value={data.link ?? ''}
          onChange={(e) => handleChange('link', e.target.value)}
          className="h-8 bg-background w-full min-w-25"
        />
      </TableCell>
      <TableCell className="text-center">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!data.title || createMutation.isPending}
        >
          {createMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span className="sr-only">הוסף</span>
        </Button>
      </TableCell>
    </TableRow>
  )
}

function EditableCallRow({ call }: { call: Call }) {
  const queryClient = useQueryClient()
  const router = useRouter()

  // Local state for immediate feedback, synced with props
  const [localData, setLocalData] = useState(call)

  // Update local state when prop changes (e.g. after refresh)
  useEffect(() => {
    setLocalData(call)
  }, [call])

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<CallNoId>) => {
      return await updateCall({ data: { id: call.id, data: updates } })
    },
    onSuccess: () => {
      toast.success('עודכן', { position: 'bottom-left', duration: 1500 })
      queryClient.invalidateQueries({ queryKey: ['admin-calls'] })
      router.invalidate()
    },
    onError: (err) => {
      toast.error(`שגיאה: ${err.message}`)
      // Revert on error
      setLocalData(call)
    },
  })

  const archiveMutation = useMutation({
    mutationFn: async ({ unarchive }: { unarchive: boolean }) => {
      await archiveCall({ data: { id: call.id, unarchive } })
    },
    onSuccess: () => {
      toast.success('סטטוס עודכן')
      queryClient.invalidateQueries({ queryKey: ['admin-calls'] })
      router.invalidate()
    },
  })

  const handleBlur = (
    field: keyof CallNoId,
    value: CallNoId[keyof CallNoId],
  ) => {
    const originalValue = call[field as keyof Call]
    // Simple equality check (basic types + array join check for requirements)
    let isChanged = false

    if (field === 'requirements') {
      const v1 = JSON.stringify(value)
      const v2 = JSON.stringify(originalValue)
      isChanged = v1 !== v2
    } else if (field === 'deadline') {
      const d1 = value ? new Date(value as string | number | Date).getTime() : 0
      const d2 = originalValue ? new Date(originalValue as Date).getTime() : 0
      isChanged = d1 !== d2
    } else {
      isChanged = value !== originalValue
    }

    if (isChanged) {
      updateMutation.mutate({ [field]: value })
    }
  }

  const handleChange = (
    field: keyof CallNoId,
    value: CallNoId[keyof CallNoId],
  ) => {
    setLocalData((prev) => ({ ...prev, [field]: value }))
  }

  const isArchived = !!call.archivedAt

  return (
    <TableRow className={cn(isArchived && 'opacity-60 bg-muted')}>
      <TableCell className="text-center text-xs text-muted-foreground">
        {call.id}
      </TableCell>
      <TableCell>
        <Input
          value={localData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          onBlur={(e) => handleBlur('title', e.target.value)}
          className="h-8 border-transparent hover:border-input focus:border-ring bg-transparent focus:bg-background transition-colors"
        />
      </TableCell>
      <TableCell>
        <Input
          value={localData.institution ?? ''}
          onChange={(e) => handleChange('institution', e.target.value)}
          onBlur={(e) => handleBlur('institution', e.target.value)}
          className="h-8 border-transparent hover:border-input focus:border-ring bg-transparent focus:bg-background transition-colors"
        />
      </TableCell>
      <TableCell>
        <Input
          value={localData.type ?? ''}
          onChange={(e) => handleChange('type', e.target.value)}
          onBlur={(e) => handleBlur('type', e.target.value)}
          className="h-8 border-transparent hover:border-input focus:border-ring bg-transparent focus:bg-background transition-colors"
        />
      </TableCell>
      <TableCell>
        <Input
          value={localData.location ?? ''}
          onChange={(e) => handleChange('location', e.target.value)}
          onBlur={(e) => handleBlur('location', e.target.value)}
          className="h-8 border-transparent hover:border-input focus:border-ring bg-transparent focus:bg-background transition-colors"
        />
      </TableCell>
      <TableCell>
        <DatePicker
          date={localData.deadline}
          onSelect={(d) => {
            handleChange('deadline', d)
            handleBlur('deadline', d)
          }}
          className="border-transparent hover:border-input bg-transparent"
        />
      </TableCell>
      <TableCell className="text-center">
        <LongTextEditor
          title={`עריכת תיאור: ${localData.title}`}
          value={localData.description ?? ''}
          onSave={(val) => {
            handleChange('description', val)
            handleBlur('description', val)
          }}
          hasContent={!!localData.description}
        />
      </TableCell>
      <TableCell className="text-center">
        <LongTextEditor
          title={`עריכת דרישות: ${localData.title}`}
          value={
            localData.requirements ? localData.requirements.join('\n') : ''
          }
          onSave={(val) => {
            const arr = val
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean)
            handleChange('requirements', arr)
            handleBlur('requirements', arr)
          }}
          hasContent={
            !!(localData.requirements && localData.requirements.length > 0)
          }
        />
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1">
          {localData.link ? (
            <a
              href={localData.link}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
          <LongTextEditor
            title="עריכת קישור"
            value={localData.link ?? ''}
            onSave={(val) => {
              handleChange('link', val)
              handleBlur('link', val)
            }}
            iconOnly
          />
        </div>
      </TableCell>
      <TableCell className="text-center">
        {isArchived ? (
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => archiveMutation.mutate({ unarchive: true })}
                disabled={archiveMutation.isPending}
              >
                <ArchiveRestore className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>שחזר מארכיון</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                onClick={() => archiveMutation.mutate({ unarchive: false })}
                disabled={archiveMutation.isPending}
              >
                <Archive className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>העבר לארכיון</TooltipContent>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  )
}

function DatePicker({
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
            'w-full justify-start text-left font-normal h-8 px-2 text-xs',
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
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

function LongTextEditor({
  title,
  value,
  onSave,
  hasContent,
  placeholder,
  iconOnly = false,
}: {
  title: string
  value: string
  onSave: (val: string) => void
  hasContent?: boolean
  placeholder?: string
  iconOnly?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  useEffect(() => {
    if (open) setTempValue(value)
  }, [open, value])

  const handleSave = () => {
    onSave(tempValue)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {iconOnly ? (
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Maximize2 className="w-3 h-3" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-8 px-2 text-xs w-full justify-between',
              !hasContent &&
                value.length === 0 &&
                'text-muted-foreground border-dashed',
            )}
          >
            {hasContent || value.length > 0 ? 'יש תוכן' : 'ריק'}
            <Maximize2 className="w-3 h-3 ms-2 opacity-50" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-125" dir="rtl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            className="min-h-50"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder={placeholder}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            ביטול
          </Button>
          <Button onClick={handleSave}>שמור</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
