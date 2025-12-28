import { useQuery } from '@tanstack/react-query'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { zodValidator } from '@tanstack/zod-adapter'
import { formatDistance } from 'date-fns'
import { he } from 'date-fns/locale'
import {
  Building2,
  CalendarDays,
  ChevronLeft,
  Clock,
  MapPin,
  Search,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { type DateRange, DateRangePicker } from '@/components/DatePicker'
import { SeeMore } from '@/components/see-more'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { type CallsFilters, zodQueryParams } from '@/data/calls'
import { getHomepageCalls, getHomepageFilterOptions } from '@/server/calls'

export const Route = createFileRoute('/')({
  validateSearch: zodValidator(zodQueryParams),
  search: {
    middlewares: [stripSearchParams(zodQueryParams.parse({}))],
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    return { calls: await getHomepageCalls({ data: deps }) }
  },
  component: OpenCallsPage,
})

export function OpenCallsPage() {
  // const router = useRouter()
  const { calls } = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const getFilters = useServerFn(getHomepageFilterOptions)
  const { data: filterOptionsData, isLoading: isLoadingFilters } = useQuery({
    queryKey: ['filters'],
    queryFn: () => getFilters(),
    staleTime: Infinity,
  })
  const [draftFilters, setDraftFilters] = useState<CallsFilters>(search.filters)

  useEffect(() => {
    setDraftFilters(search.filters)
  }, [search.filters])

  const handleApplyFilters = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        filters: draftFilters,
      }),
    })
  }

  const handleClearFilters = () => {
    const emptyFilters = {}
    setDraftFilters(emptyFilters)
    navigate({
      search: (prev) => ({
        ...prev,
        filters: emptyFilters,
      }),
    })
  }

  type SelectItems = Parameters<typeof Select>[0]['items']
  const toSelectItem = (s: string) => ({ label: s, value: s })

  const typesForSelect: Parameters<typeof Select>[0]['items'] = [
    {
      label: 'כל הסוגים',
      value: null,
    },
    ...(isLoadingFilters ? [] : (filterOptionsData?.types ?? [])).map(
      toSelectItem,
    ),
  ]

  const locationsForSelect: SelectItems = [
    {
      label: 'כל הארץ',
      value: null,
    },
    ...(isLoadingFilters ? [] : (filterOptionsData?.locations ?? [])).map(
      toSelectItem,
    ),
  ]

  const institutionsForSelect: SelectItems = [
    {
      label: 'כל המוסדות',
      value: null,
    },
    ...(isLoadingFilters ? [] : (filterOptionsData?.institutions ?? [])).map(
      toSelectItem,
    ),
  ]

  const onFormSubmit: React.FormEventHandler = (event) => {
    event.preventDefault()
    handleApplyFilters()
  }

  return (
    <div
      className="flex-1 bg-background pb-12 font-sans text-foreground"
      dir="rtl"
    >
      {/* Hero Section */}
      <section className="border-b bg-card py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 font-extrabold text-4xl text-foreground tracking-tight md:text-5xl">
            הלוח
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl"></p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="-mt-6 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <form onSubmit={onFormSubmit}>
          <Card className="border-none ring-1 ring-border">
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
                {/* Search */}
                <Field className="md:col-span-3">
                  <FieldLabel htmlFor="search">שם</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon className="pointer-events-none ps-3">
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="search"
                      placeholder=""
                      value={draftFilters.search ?? ''}
                      onChange={(e) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          search: e.target.value || undefined,
                        }))
                      }
                    />
                  </InputGroup>
                </Field>

                {/* Type Filter */}
                <Field>
                  <FieldLabel>סוג</FieldLabel>
                  <Select
                    items={typesForSelect}
                    value={draftFilters.type?.[0] ?? null}
                    onValueChange={(val) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        type: val ? [val] : undefined,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {typesForSelect.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                {/* Location Filter */}
                <Field>
                  <FieldLabel>מיקום</FieldLabel>
                  <Select
                    items={locationsForSelect}
                    value={draftFilters.location?.[0] ?? null}
                    onValueChange={(val) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        location: val ? [val] : undefined,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {locationsForSelect.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                {/* Institute Filter */}
                <Field>
                  <FieldLabel>מוסד</FieldLabel>
                  <Select
                    items={institutionsForSelect}
                    value={draftFilters.institution?.[0] ?? null}
                    onValueChange={(val) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        institution: val ? [val] : undefined,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {institutionsForSelect.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                {/* Deadline Filter */}
                <Field>
                  <FieldLabel>דדליין</FieldLabel>
                  <DateRangePicker
                    date={{
                      from: draftFilters.deadline?.after,
                      to: draftFilters.deadline?.before,
                    }}
                    onSelect={(range: DateRange | undefined) => {
                      setDraftFilters((prev) => ({
                        ...prev,
                        deadline: range
                          ? {
                              after: range.from,
                              before: range.to,
                            }
                          : undefined,
                      }))
                    }}
                  />
                </Field>

                {/* CreatedAt Filter */}
                <Field>
                  <FieldLabel>תאריך פרסום</FieldLabel>
                  <DateRangePicker
                    date={{
                      from: draftFilters.createdAt?.after,
                      to: draftFilters.createdAt?.before,
                    }}
                    onSelect={(range: DateRange | undefined) => {
                      setDraftFilters((prev) => ({
                        ...prev,
                        createdAt: range
                          ? {
                              after: range.from,
                              before: range.to,
                            }
                          : undefined,
                      }))
                    }}
                  />
                </Field>
                {/* Toggles */}
                <div></div>
              </div>
              <Separator className="my-4" />
              <div className="mr-auto flex w-32 gap-2">
                <Button
                  type="submit" /* onClick={handleApplyFilters} */
                  className="flex-2"
                >
                  סינון{' '}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="flex-"
                >
                  ללא סינון
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </section>

      {/* Main Content List */}
      <main className="mx-auto mt-10 max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {calls.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden border-none ring-1 ring-border"
            >
              <CardHeader className="mb-0">
                <CardTitle className="font-bold text-2xl">
                  {item.title}
                </CardTitle>
                <div className="my-2 flex items-center gap-2">
                  <Badge variant="secondary">{item.type}</Badge>
                </div>
                {item.description && (
                  <CardDescription className="mt-2 whitespace-break-spaces text-base text-muted-foreground">
                    <SeeMore text={item.description} />
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="p-6 pt-0 md:p-8">
                <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground text-sm">
                  {item.institution && (
                    <div className="flex items-center">
                      <Building2 className="me-1.5 h-4 w-4 opacity-70" />
                      {item.institution}
                    </div>
                  )}
                  {item.location && (
                    <div className="flex items-center">
                      <MapPin className="me-1.5 h-4 w-4 opacity-70" />
                      {item.location}
                    </div>
                  )}
                  {item.deadline && (
                    <div className="flex items-center rounded-sm bg-primary/10 px-2 py-0.5 font-medium text-secondary-foreground">
                      <Clock className="me-1.5 h-4 w-4" />
                      דדליין:
                      {` ${item.deadline?.toLocaleDateString('he-IL')}`}
                    </div>
                  )}
                </div>

                {item.requirements && (
                  <Accordion className="w-full">
                    <AccordionItem value="requirements" className="border-none">
                      <AccordionTrigger className="rounded-lg bg-muted/30 px-4 py-2 transition-colors hover:bg-muted/50 hover:no-underline">
                        <span className="font-light text-foreground">
                          דרישות עיקריות
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-4">
                        <ul className="list-inside list-disc space-y-1 text-secondary-foreground marker:text-secondary-foreground/20">
                          {item.requirements.map((req, idx) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: static
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </CardContent>

              <CardFooter className="flex flex-col items-center justify-between gap-4 bg-muted/10 p-4 sm:flex-row">
                <div className="flex items-center text-muted-foreground text-xs">
                  <CalendarDays className="me-1.5 h-4 w-4 opacity-50" />
                  <span>
                    פורסם לפני{' '}
                    {formatDistance(item.createdAt, new Date(), { locale: he })}
                  </span>
                </div>
                {item.link && (
                  <Button className="w-full sm:w-auto">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      פרטים והגשה
                      <ChevronLeft className="ms-1.5 inline h-4 w-4" />
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
