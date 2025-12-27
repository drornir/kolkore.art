import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/login')({
  component: SignInPage,
})

function SignInPage() {
  const router = useRouter()
  const [pageType, setPageType] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [password2ErrorMessage, setPassword2ErrorMessage] = useState('')

  const pageName = pageType === 'login' ? 'התחברות' : 'הרשמה'
  const linkToOtherPageText = pageType === 'login' ? 'להרשמה' : 'להתחברות'
  const ctaText = pageType === 'login' ? 'התחבר' : 'הירשם'

  const signinValidator = z.object({
    email: z.email(),
    password: z.string().min(8).max(64),
  })

  const signupValidator = z
    .object({
      email: z.email(),
      password: z.string().min(8).max(64),
      password2: z.string(),
    })
    .refine((data) => data.password === data.password2, {
      message: 'הסיסמאות אינן תואמות',
      path: ['password2'],
    })

  const onSubmit = async () => {
    const opts:
      | Parameters<typeof authClient.signIn.email>[1]
      | Parameters<typeof authClient.signUp.email>[1] = {
      onRequest: () => {
        setLoading(true)
      },
      onResponse: () => {
        setLoading(false)
      },
      onSuccess: async (ctx) => {
        if (ctx.data.user.role === 'admin') {
          router.navigate({ to: '/admin' })
        } else {
          router.navigate({ to: '/' })
        }
      },
      onError: (ctx) => {
        toast.error(ctx.error.message)
      },
    }

    if (pageType === 'signup') {
      const { success, error } = signupValidator.safeParse({
        email,
        password,
        password2,
      })
      if (!success) {
        const flattenErrors = z.flattenError(error)
        if (flattenErrors.fieldErrors.email) {
          setEmailErrorMessage(flattenErrors.fieldErrors.email[0])
        }
        if (flattenErrors.fieldErrors.password) {
          setPasswordErrorMessage(flattenErrors.fieldErrors.password[0])
        }
        if (flattenErrors.fieldErrors.password2) {
          setPassword2ErrorMessage(flattenErrors.fieldErrors.password2[0])
        }
        return
      }
      setEmailErrorMessage('')
      setPasswordErrorMessage('')
      setPassword2ErrorMessage('')

      await authClient.signUp.email(
        {
          email,
          password,
          name: email,
        },
        opts,
      )
    } else {
      const { success, error } = signinValidator.safeParse({
        email,
        password,
      })
      if (!success) {
        const flattenErrors = z.flattenError(error)
        if (flattenErrors.fieldErrors.email) {
          setEmailErrorMessage(flattenErrors.fieldErrors.email[0])
        }
        if (flattenErrors.fieldErrors.password) {
          setPasswordErrorMessage(flattenErrors.fieldErrors.password[0])
        }
        return
      }

      setEmailErrorMessage('')
      setPasswordErrorMessage('')
      setPassword2ErrorMessage('')

      await authClient.signIn.email(
        {
          email,
          password,
          rememberMe,
        },
        opts,
      )
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900"
      dir="rtl"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">{pageName}</CardTitle>
          <CardDescription className="text-xs md:text-sm"></CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-2">
            <Field className="">
              <FieldLabel htmlFor="email">אימייל</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder=""
                required
                onChange={(e) => {
                  setEmailErrorMessage('')
                  setEmail(e.target.value)
                }}
                value={email}
                className={cn({
                  'text-left': true,
                  'border-destructive': emailErrorMessage !== '',
                })}
                dir="ltr"
              />
              <FieldDescription className="h-4 text-destructive">
                {emailErrorMessage}
              </FieldDescription>
            </Field>

            <Field className="">
              <FieldLabel htmlFor="password">סיסמה</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder=""
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPasswordErrorMessage('')
                  setPassword(e.target.value)
                }}
                className={cn({
                  'text-left': true,
                  'border-destructive': passwordErrorMessage !== '',
                })}
                dir="ltr"
              />
              <FieldDescription className="h-4 text-destructive">
                {passwordErrorMessage}
              </FieldDescription>
            </Field>

            {pageType === 'login' && (
              <Field className="" orientation="horizontal">
                <Checkbox
                  id="remember"
                  onCheckedChange={(checked: boolean) => {
                    setRememberMe(checked)
                  }}
                  checked={rememberMe}
                />
                <FieldLabel htmlFor="remember">זכור אותי</FieldLabel>
              </Field>
            )}

            {pageType === 'signup' && (
              <Field className="grid gap-2">
                <FieldLabel htmlFor="password2">סיסמה שוב</FieldLabel>
                <Input
                  id="password2"
                  className={cn({
                    'border-destructive':
                      (password2 !== '' && password !== password2) ||
                      password2ErrorMessage !== '',
                    'text-left': true,
                  })}
                  type="password"
                  placeholder=""
                  autoComplete="current-password"
                  value={password2}
                  onChange={(e) => {
                    setPassword2ErrorMessage('')
                    setPassword2(e.target.value)
                  }}
                  dir="ltr"
                />
                <FieldDescription className="h-4 text-destructive">
                  {password2ErrorMessage}
                </FieldDescription>
              </Field>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              onClick={onSubmit}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <p> {ctaText} </p>
              )}
            </Button>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="mb-4">
            <Button
              variant="link"
              className="cursor-pointer"
              onClick={() =>
                setPageType(pageType === 'login' ? 'signup' : 'login')
              }
            >
              {linkToOtherPageText}
            </Button>
          </div>
          <div className="flex w-full justify-center border-t pt-2">
            <p className="text-center text-neutral-500 text-xs">
              נבנה עם{' '}
              <a
                href="https://better-auth.com"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                <span className="cursor-pointer dark:text-white/70">
                  better-auth
                </span>
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
