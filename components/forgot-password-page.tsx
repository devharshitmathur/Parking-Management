"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

export function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true)
    // Simulate sending a password reset email
    console.log("Sending password reset email to:", values.email)
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate network request
    setIsSuccess(true)
    setIsLoading(false)
    toast({
      title: "Password reset email sent!",
      description: "Check your inbox for instructions to reset your password.",
    })
  }

  const handleResendEmail = async () => {
    setIsResending(true)
    // Simulate resending the email
    console.log("Resending password reset email")
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate network request
    setIsResending(false)
    toast({
      title: "Password reset email resent!",
      description: "Check your inbox for the latest instructions.",
    })
  }

  const onBackToLogin = () => {
    router.push("/sign-in")
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">We have sent a password reset link to your email address.</p>
              <Button variant="default" className="w-full" onClick={onBackToLogin}>
                Back to Login
              </Button>
              <Button variant="outline" className="w-full" onClick={handleResendEmail} disabled={isResending}>
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend Email"
                )}
              </Button>
              <Button
                onClick={() => {
                  // For demo purposes, simulate clicking reset link
                  window.location.hash = "reset-password"
                }}
                variant="secondary"
                className="w-full"
              >
                Demo: Simulate Reset Link Click
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <Button type="button" variant="outline" className="w-full" onClick={onBackToLogin}>
                  Back to Login
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
