import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import {
  Building2,
  CalendarDays,
  ChevronLeft,
  Clock,
  MapPin,
  Search,
  Tag,
} from 'lucide-react'
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
import { zodQueryParams } from '@/data/calls'
import { getHomepageCalls } from '@/server/calls'

export const Route = createFileRoute('/')({
  validateSearch: zodValidator(zodQueryParams),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    return { calls: await getHomepageCalls({ data: deps }) }
  },
  component: OpenCallsPage,
})

function OpenCallsPage() {
  // const router = useRouter()
  const { calls } = Route.useLoaderData()

  const typesForSelect: Parameters<typeof Select>[0]['items'] = [
    {
      label: 'כל הסוגים',
      value: null,
    },
    {
      label: 'שהות אמן (Residency)',
      value: 'residency',
    },
    {
      label: 'מענק',
      value: 'grant',
    },
    {
      label: 'קול קורא לתערוכה',
      value: 'exhibition',
    },
    {
      label: 'פסטיבל',
      value: 'festival',
    },
  ]

  const locationsForSelect: Parameters<typeof Select>[0]['items'] = [
    {
      label: 'כל הארץ',
      value: null,
    },
    {
      label: 'תל אביב',
      value: 'tel-aviv',
    },
    {
      label: 'ירושלים',
      value: 'jerusalem',
    },
    {
      label: 'חיפה',
      value: 'haifa',
    },
    {
      label: 'ארצי',
      value: 'national',
    },
  ]

  return (
    <div
      className="min-h-screen bg-background pb-12 font-sans text-foreground"
      dir="rtl"
    >
      {/* Hero Section */}
      <section className="bg-card border-b py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            לוח הזדמנויות לאמנים
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            מרכז המידע העדכני ביותר לקולות קוראים, מענקים, מלגות ותערוכות לאמנים
            בישראל.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <Card className="border-none ring-1 ring-border">
          <CardContent className="p-4 md:p-6">
            <span className="text-red-600">כל החלק הזה עדיין בפיתוח</span>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end opacity-30">
              {/* Search */}
              <Field className="md:col-span-2">
                <FieldLabel htmlFor="search">חיפוש חופשי</FieldLabel>
                <InputGroup>
                  <InputGroupAddon className="ps-3 pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="search"
                    placeholder="חיפוש לפי מילת מפתח..."
                  />
                </InputGroup>
              </Field>

              {/* Type Filter */}
              <Field>
                <FieldLabel>סוג הזדמנות</FieldLabel>
                <Select items={typesForSelect}>
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
                <Select items={locationsForSelect}>
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
            </div>
            <Separator className="my-6" />
            <div className="flex flex-wrap gap-2 opacity-30">
              <Badge variant="secondary" className="">
                הכל
              </Badge>
              <Badge variant="secondary" className="">
                נסגר השבוע
              </Badge>
              <Badge variant="secondary" className="">
                ללא עלות הגשה
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Main Content List */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="space-y-6">
          {calls.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden border-none ring-1 ring-border"
            >
              <CardHeader className="p-6 md:p-8 pb-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">
                    <Tag className="w-3 h-3 me-1" />
                    {item.type}
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
                {item.description && (
                  <CardDescription className="text-base text-muted-foreground mt-2 line-clamp-2">
                    {item.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="p-6 md:p-8 pt-4">
                <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-muted-foreground mb-6">
                  {item.institution && (
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 me-1.5 opacity-70" />
                      {item.institution}
                    </div>
                  )}
                  {item.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 me-1.5 opacity-70" />
                      {item.location}
                    </div>
                  )}
                  {item.deadline && (
                    <div className="flex items-center text-destructive font-medium bg-destructive/10 px-2 py-0.5 rounded-sm">
                      <Clock className="w-4 h-4 me-1.5" />
                      דדליין:
                      {item.deadline?.toLocaleDateString()}
                    </div>
                  )}
                </div>

                {item.requirements && (
                  <Accordion className="w-full">
                    <AccordionItem value="requirements" className="border-none">
                      <AccordionTrigger className="bg-muted/30 px-4 py-2 rounded-lg hover:no-underline hover:bg-muted/50 transition-colors">
                        <span className="font-semibold text-foreground">
                          דרישות עיקריות
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 px-4">
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground marker:text-muted-foreground/50">
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

              <CardFooter className="p-4 bg-muted/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarDays className="w-4 h-4 me-1.5 opacity-50" />
                  <span>פורסם לפני יומיים</span>
                </div>
                {item.link && (
                  <Button className="w-full sm:w-auto">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      פרטים והגשה
                      <ChevronLeft className="w-4 h-4 ms-1.5 inline" />
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
