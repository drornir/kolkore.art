import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/login')({
  component: SignIn,
})

function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4"
      dir="rtl"
    >
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">התחברות</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            הזן את האימייל שלך למטה כדי להתחבר לחשבון שלך
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                value={email}
                className="text-left"
                dir="ltr"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">סיסמה</Label>
              </div>

              <Input
                id="password"
                type="password"
                placeholder="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-left"
                dir="ltr"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                onCheckedChange={(checked: boolean) => {
                  setRememberMe(checked)
                }}
                checked={rememberMe}
              />
              <Label htmlFor="remember">זכור אותי</Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              onClick={async () => {
                await authClient.signIn.email(
                  {
                    email,
                    password,
                    rememberMe,
                  },
                  {
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
                  },
                )
              }}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <p> התחבר </p>
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-center w-full border-t py-4">
            <p className="text-center text-xs text-neutral-500">
              נבנה עם{' '}
              <a
                href="https://better-auth.com"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                <span className="dark:text-white/70 cursor-pointer">
                  better-auth.
                </span>
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
