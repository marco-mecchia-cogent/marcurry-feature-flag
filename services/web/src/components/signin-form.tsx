'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Field, FieldDescription, FieldGroup } from '@/ui/field';
import { Input } from '@/ui/input';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { signIn } from '@/server/users';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export function SigninForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const { success, message } = await signIn(data.email, data.password);
    if (!success) return toast.error(message);
    toast.success('Logged in successfully');
    return router.push('/app');
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <FormField
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem data-invalid={fieldState.invalid}>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        disabled={form.formState.isSubmitting}
                        aria-invalid={fieldState.invalid}
                        placeholder="m@example.com"
                        required
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem data-invalid={fieldState.invalid}>
                      <div className="flex items-center">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                          Forgot your password?
                        </a>
                      </div>
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        disabled={form.formState.isSubmitting}
                        aria-invalid={fieldState.invalid}
                        required
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Field>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <Loader2Icon className="animate-spin" /> : 'Login'}
                  </Button>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account? <a href="/sign-up">Sign up</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
